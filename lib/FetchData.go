package TRC

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

var Artists []Artist

// FetchArtists retrieves the list of artists from the API
func FetchArtists() error {
	response, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		return fmt.Errorf("Error fetching artists:", err)
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("Error reading artists data:", err)
	}

	// Unmarshal the JSON data into the Artists slice
	if err := json.Unmarshal(data, &Artists); err != nil {
		fmt.Println("Error unmarshalling artists data:", err)
	}
	return nil
}
