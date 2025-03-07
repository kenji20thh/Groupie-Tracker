package TRC

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Artist represents the structure for each artist with additional info like dates and locations
type Artist struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Image        string   `json:"image"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	LocationsApi string   `json:"locations"`
	DatesApi     string   `json:"concertDates"`
	RelationsApi string   `json:"relations"`
	Locations    Locations
	Dates        Dates
	Relations    Relations
}

type LocationsData struct {
	Index []Locations `json:"index"`
}

// OtherInfo holds extra details like locations and dates for each artist
type Locations struct {
	Locations     []string `json:"locations"`
	SortLocations []string
}

type Dates struct {
	Dates []string `json:"dates"`
}

type Relations struct {
	DatesLocations map[string][]string `json:"datesLocations"`
}

// FetchLocations retrieves the location data for the artist
func (ar *Artist) FetchLocations() error {
	response, err := http.Get(ar.LocationsApi)
	if err != nil {
		return fmt.Errorf("Error fetching locations:", err)
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("Error reading locations data:", err)
	}

	// Unmarshal the JSON data into the artist's OtherInfo
	if err := json.Unmarshal(data, &ar.Locations); err != nil {
		return fmt.Errorf("Error unmarshalling locations data:", err)
	}
	return nil
}

// FetchDates retrieves the concert dates data for the artist
func (ar *Artist) FetchDates() error {
	response, err := http.Get(ar.DatesApi)
	if err != nil {
		return fmt.Errorf("Error fetching dates:", err)
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("Error reading dates data:", err)
	}

	// Unmarshal the JSON data into the artist's OtherInfo
	if err := json.Unmarshal(data, &ar.Dates); err != nil {
		return fmt.Errorf("Error unmarshalling dates data:", err)
	}

	return nil
}

// FetchRelations retrieves the relations data (dates and locations combined) for the artist
func (ar *Artist) FetchRelations() error {
	response, err := http.Get(ar.RelationsApi)
	if err != nil {
		return fmt.Errorf("Error fetching relations:", err)
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("Error reading relations data:", err)
	}

	// Unmarshal the JSON data into the artist's DatesLocations map
	if err := json.Unmarshal(data, &ar.Relations); err != nil {
		return fmt.Errorf("Error unmarshalling relations data:", err)
	}
	return nil
}

func (a *Artist) FetchOtherData() error {
	errFetchLocations := a.FetchLocations()
	if errFetchLocations != nil {
		return (errFetchLocations)
	}
	errFetchDates := a.FetchDates()
	if errFetchDates != nil {
		return (errFetchDates)
	}
	errFetchRelations := a.FetchRelations()
	if errFetchRelations != nil {
		return (errFetchRelations)
	}
	return nil
}
