package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PlacesDoc struct {
	ID     primitive.ObjectID `json:"_id,omitempty"`
	Places []Place            `bson:"places,omitempty"`
}

type Place struct {
	Category    string                 `json:"category"`
	Type        string                 `json:"type"`
	Coords      map[string]interface{} `json:"coords" bson:"coords"`
	Content     string                 `json:"content"`
	Url         string                 `json:"url"`
	PlaceID     string                 `json:"placeID"`
	Price       int                    `json:"price"`
	Rating      float64                `json:"rating"`
	Area        string                 `json:"area"`
	Active      bool                   `json:"active"`
	Inexpensive bool                   `json:"Inexpensive"`
	Best        bool                   `json:"Best"`
	Favorite    bool                   `json:"favorite"`
	Popular     bool                   `json:"popular"`
	City        string                 `json:"city"`
	Style       string                 `json:"style"`
	Serves      string                 `json:"serves"`
	Sponsored   bool                   `json:"sponsored"`
	Name        string                 `json:"name"`
}

func main() {

	clientOptions := options.Client().ApplyURI("mongodb+srv://avalerosoftware:EnSuXjucfRfCcvEN@cluster0.pgjzzcc.mongodb.net/umacc?retryWrites=true&w=majority")

	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatal("Error disconnecting from MongoDB:", err)
		}
	}()

	// Ping the MongoDB server to verify connectivity
	if err := client.Ping(context.Background(), nil); err != nil {
		log.Fatal("Failed to ping MongoDB server:", err)
	}

	// Now you can use the client to interact with MongoDB
	// Example: Get a collection from the database
	collection := client.Database("TravelSmart").Collection("Places")

	// Register the helloHandler function to handle requests to /hello
	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")
		cursor, err := collection.Find(context.Background(), bson.D{}, options.Find())
		if err != nil {
			log.Fatal("Error finding documents:", err)
		}
		if err := cursor.Err(); err != nil {
			log.Fatal("Cursor error:", err)
		}

		var placesDoc PlacesDoc

		for cursor.Next(context.Background()) {
			if err := cursor.Decode(&placesDoc); err != nil {
				log.Println("Error decoding document:", err)
			}

			if err := json.NewEncoder(w).Encode(placesDoc.Places); err != nil {
				log.Println("Error encoding JSON:", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

		}

		defer cursor.Close(context.Background())

	})

	// Determine the directory of the React build output (containing index.html)
	reactBuildDir := "../build"

	// Serve the index.html file for all routes except static assets
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Construct the path to the index.html file
		indexPath := filepath.Join(reactBuildDir, "index.html")

		// Serve the index.html file
		http.ServeFile(w, r, indexPath)
	})

	// Serve static assets (e.g., JS, CSS, images)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(reactBuildDir+"/static"))))

	// Start the HTTP server on port 10000
	fmt.Println("Starting server on port 10000...")
	if err := http.ListenAndServe(":10000", nil); err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}

}
