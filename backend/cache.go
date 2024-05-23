package main

import (
	"context"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

type Cache struct {
	client *redis.Client
}

func NewCache(client *redis.Client) *Cache {
	return &Cache{
		client: client,
	}
}

func (c *Cache) GetUserID(id string) (string, error) {
	userID, err := c.getUserIDFromCache(id)
	if err != nil {
		// Cache miss, retrieve from Redis
		userID, err = c.getUserIDFromRedis(id)
		if err != nil {
			return "", err
		}
		// Cache the user ID for future requests
		c.cacheUserID(userID)
	}
	return userID, nil
}

func (c *Cache) getUserIDFromCache(id string) (string, error) {
	return c.client.Get(context.Background(), id).Result()
}

func (c *Cache) getUserIDFromRedis(id string) (string, error) {
	return c.client.HGet(context.Background(), "users", id).Result()
}

func (c *Cache) cacheUserID(userID string) error {
	err := c.client.Set(context.Background(), userID, userID, 0*time.Second).Err()
	if err != nil {
		log.Println(err)
	} else {
		log.Printf("Cached ID: %s", userID)
	}
	return err
}
