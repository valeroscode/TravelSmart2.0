package main

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        string                 `bson:"_id,omitempty"`
	Username  string                 `bson:"username,omitempty"`
	Email     string                 `bson:"email,omitempty"`
	Password  string                 `bson:"password,omitempty"`
	Favorites []string               `bson:"favorites, omitempty"`
	Trips     map[string]interface{} `bson:"trips, omitempty"`
}

type UserRepo struct {
	Collection *mongo.Collection
}

func NewUserRepo(collection *mongo.Collection) *UserRepo {
	return &UserRepo{
		Collection: collection,
	}
}

func (r *UserRepo) GetUserByID(userID string) (*User, error) {
	var user User
	filter := bson.M{"_id": userID}
	err := r.Collection.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		log.Printf("Error retrieving user: %v\n", err)
		return nil, err
	}
	return &user, nil
}

func (r *UserRepo) CreateUser(user *User) error {

	hashedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if hashErr != nil {
		log.Printf("Error hashing password: %v\n", hashErr)
		return hashErr
	}

	user.Password = string(hashedPassword)

	_, err := r.Collection.InsertOne(context.Background(), user)
	if err != nil {
		log.Printf("Error creating user: %v\n", err)
		return err
	}
	return nil
}

func (r *UserRepo) UpdateUser(userID string, updatedUser *User) error {
	filter := bson.M{"_id": userID}
	update := bson.M{"$set": updatedUser}
	_, err := r.Collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Printf("Error updating user: %v\n", err)
		return err
	}
	return nil
}

func (r *UserRepo) DeleteUser(userID string) error {
	filter := bson.M{"_id": userID}
	_, err := r.Collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Printf("Error deleting user: %v\n", err)
		return err
	}
	return nil
}

func (user *User) ValidatePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}
