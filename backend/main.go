package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Place struct {
	Id          int     `json:"id"`
	Category    string  `json:"category"`
	Type        string  `json:"type"`
	Coords      Coords  `json:"coords"`
	Content     string  `json:"content"`
	Url         *string `json:"url"`
	Placeid     string  `json:"placeid"`
	Price       int     `json:"price"`
	Rating      float64 `json:"rating"`
	Area        string  `json:"area"`
	Active      bool    `json:"active"`
	Inexpensive bool    `json:"inexpensive"`
	Best        bool    `json:"best"`
	Favorite    bool    `json:"favorite"`
	Popular     bool    `json:"popular"`
	City        string  `json:"city"`
	Style       string  `json:"style"`
	Serves      string  `json:"serves"`
	Sponsored   bool    `json:"sponsored"`
	Name        string  `json:"name"`
	Awards      string  `json:"awards"`
	Score 		string 	`json:"score"`
}

type Coords struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type Database struct {
	*sql.DB
}

type RequestBody struct {
	City string `json:"city"`
}

func corsHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token")
		if r.Method == "OPTIONS" {
			return
		}
		h.ServeHTTP(w, r)
	})
}

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println(err)
		return
	}

	connStr := os.Getenv("CONN_STR")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/places", func(w http.ResponseWriter, r *http.Request) {
		getPlacesHandler(w, r, db)
	})

	defer db.Close()

	http.HandleFunc("/createUser", createUserHandler(db))
	http.HandleFunc("/getUser", getUserHandler(db))
	http.HandleFunc("/getUserData", refreshHandler(db))
	http.HandleFunc("/deleteUser", deleteUserHandler(db))
	http.HandleFunc("/updateFavorites", updateFavoritesHandler(db))
	http.HandleFunc("/updateName", updateNameHandler(db))
	http.HandleFunc("/createTrip", createTripHandler(db))
	http.HandleFunc("/updateTripName", updateTripNameHandler(db))
	http.HandleFunc("/updateTrip", updateTripHandler(db))
	http.HandleFunc("/deleteTrip", deleteTripHandler(db))

	reactBuildDir := "../build"

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(reactBuildDir+"/static"))))
	// Serve the index.html file for all routes except static assets
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Construct the path to the index.html file
		indexPath := filepath.Join(reactBuildDir, "index.html")
		// Serve the index.html file
		http.ServeFile(w, r, indexPath)
	})

	fmt.Println("Server is listening on port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

func getPlacesHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var requestBody RequestBody
	jsonerr := json.NewDecoder(r.Body).Decode(&requestBody)
	if jsonerr != nil {
		log.Fatal(jsonerr)
	}

	// Extract the JWT token from the Authorization header
	authHeader := r.Header.Get("Authorization")
	jwtToken := strings.TrimPrefix(authHeader, "Bearer ")
	// Verify the JWT token
	valid, errJWT := verifyJWT(jwtToken)
	if valid == -1 {
		http.Error(w, errJWT.Error(), http.StatusUnauthorized)
		return
	}

	var rows *sql.Rows
	var err error

	// Create the database query
	query := "SELECT * FROM places"

	// If a city is specified, add a WHERE clause to filter the results
	if requestBody.City != "" {
		query += " WHERE city = $1"
		// Execute the query
		vars := []interface{}{requestBody.City}
		rows, err = db.Query(query, vars...)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		rows, err = db.Query(query)
	}

	if err != nil {
		log.Fatal(err)
	}

	// Create a slice to store the places
	var places []Place

	// Iterate over the rows and append to the slice
	for rows.Next() {

		var p Place

		err := rows.Scan(
			&p.Id,
			&p.Category,
			&p.Type,
			&p.Coords.Lat,
			&p.Coords.Lng,
			&p.Content,
			&p.Url,
			&p.Placeid,
			&p.Price,
			&p.Rating,
			&p.Area,
			&p.Active,
			&p.Inexpensive,
			&p.Best,
			&p.Favorite,
			&p.Popular,
			&p.City,
			&p.Style,
			&p.Serves,
			&p.Sponsored,
			&p.Name,
			&p.Awards,
			&p.Score,
		)
		if err != nil {
			http.Error(w, "Error scanning database row: "+err.Error(), 500)
			return
		}
		places = append(places, p)
	}

	defer rows.Close()

	// Encode the slice as JSON and write to the response
	json.NewEncoder(w).Encode(places)
}
