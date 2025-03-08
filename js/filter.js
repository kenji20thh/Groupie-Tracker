// State for artists data
let artists = []
let filteredArtists = []

// DOM Elements for filters
const searchInput = document.getElementById("search-input")
const mobileSearchInput = document.getElementById("mobile-search-input")
const creationMinSlider = document.getElementById("creation-min")
const creationMaxSlider = document.getElementById("creation-max")
const albumMinSlider = document.getElementById("album-min")
const albumMaxSlider = document.getElementById("album-max")
const artistGrid = document.getElementById("artist-grid")
const noResults = document.getElementById("no-results")
const applyFiltersBtn = document.getElementById("apply-filters")
const resetFiltersBtn = document.getElementById("reset-filters")
const searchForm = document.getElementById("search-form")
const mobileSearchForm = document.getElementById("mobile-search-form")

// Template
const artistCardTemplate = document.getElementById("artist-card-template")

// Declare updateSliderCards (assuming it's defined elsewhere or should be a no-op)
const updateSliderCards = () => {}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Fetch artists data from backend
  fetchArtists()

  // Set up event listeners for filtering
  initFilterEventListeners()
})

// Fetch artists data from backend
async function fetchArtists() {
  try {
    const response = await fetch("/api/artists")
    if (!response.ok) {
      throw new Error("Failed to fetch artists")
    }

    artists = await response.json()
    filteredArtists = [...artists]
    renderArtists(filteredArtists)
  } catch (error) {
    console.error("Error fetching artists:", error)
    artistGrid.innerHTML = '<p class="error-message">Failed to load artists. Please try again later.</p>'
  }
}

// Initialize filter event listeners
function initFilterEventListeners() {
  // Search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    applyFilters()
  })

  mobileSearchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    applyFilters()
  })

  // Apply filters button
  applyFiltersBtn.addEventListener("click", () => {
    applyFilters()
  })

  // Reset filters button
  resetFiltersBtn.addEventListener("click", () => {
    resetFilters()
  })

  // Member checkboxes
  document.querySelectorAll('[id^="member-"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      // Don't apply filters immediately to avoid too many refreshes
      // Filters will be applied when the user clicks "Apply"
    })
  })
}

// Apply all filters
function applyFilters() {
  // Start with all artists
  filteredArtists = [...artists]

  // Apply search filter
  const searchTerm = (searchInput.value || mobileSearchInput.value).trim().toLowerCase()
  if (searchTerm) {
    filteredArtists = filteredArtists.filter(
      (artist) =>
        artist.Name.toLowerCase().includes(searchTerm) ||
        artist.Members.some((member) => member.toLowerCase().includes(searchTerm)),
    )
  }

  // Apply creation date range filter
  const minCreationDate = Number.parseInt(creationMinSlider.value)
  const maxCreationDate = Number.parseInt(creationMaxSlider.value)
  filteredArtists = filteredArtists.filter(
    (artist) => artist.CreationDate >= minCreationDate && artist.CreationDate <= maxCreationDate,
  )

  // Apply first album date range filter
  const minAlbumDate = Number.parseInt(albumMinSlider.value)
  const maxAlbumDate = Number.parseInt(albumMaxSlider.value)
  filteredArtists = filteredArtists.filter((artist) => {
    // Extract year from FirstAlbum (format might be DD-MM-YYYY)
    const albumParts = artist.FirstAlbum.split("-")
    const albumYear = Number.parseInt(albumParts[albumParts.length - 1])
    return albumYear >= minAlbumDate && albumYear <= maxAlbumDate
  })

  // Apply members filter
  const selectedMembers = []
  document.querySelectorAll('[id^="member-"]:checked').forEach((checkbox) => {
    selectedMembers.push(Number.parseInt(checkbox.value))
  })

  if (selectedMembers.length > 0) {
    filteredArtists = filteredArtists.filter((artist) => selectedMembers.includes(artist.Members.length))
  }

  // Apply locations filter
  const selectedLocations = []
  document.querySelectorAll('[id^="location-"]:checked').forEach((checkbox) => {
    selectedLocations.push(checkbox.value)
  })

  if (selectedLocations.length > 0) {
    filteredArtists = filteredArtists.filter((artist) => {
      // Check if any of the artist's locations includes any of the selected locations
      // This depends on how your Locations data is structured
      if (artist.Locations && artist.Locations.length > 0) {
        return artist.Locations.some((location) =>
          selectedLocations.some((selectedLocation) => location.toLowerCase().includes(selectedLocation.toLowerCase())),
        )
      }
      return false
    })
  }

  // Render the filtered artists
  renderArtists(filteredArtists)
}

// Reset all filters
function resetFilters() {
  // Reset search inputs
  searchInput.value = ""
  mobileSearchInput.value = ""

  // Reset range sliders
  creationMinSlider.value = 1950
  creationMaxSlider.value = 2023
  document.getElementById("creation-min-value").textContent = 1950
  document.getElementById("creation-max-value").textContent = 2023

  albumMinSlider.value = 1950
  albumMaxSlider.value = 2023
  document.getElementById("album-min-value").textContent = 1950
  document.getElementById("album-max-value").textContent = 2023

  // Reset checkboxes
  document.querySelectorAll('[id^="member-"]:checked').forEach((checkbox) => {
    checkbox.checked = false
  })

  document.querySelectorAll('[id^="location-"]:checked').forEach((checkbox) => {
    checkbox.checked = false
  })

  // Update slider cards (from main.js)
  if (typeof updateSliderCards === "function") {
    updateSliderCards()
  }

  // Reset to all artists
  filteredArtists = [...artists]
  renderArtists(filteredArtists)
}

// Render artists to the grid
function renderArtists(artistsToRender) {
  // Clear the grid
  artistGrid.innerHTML = ""

  // Show "no results" message if no artists match the filters
  if (artistsToRender.length === 0) {
    noResults.classList.remove("hidden")
    return
  }

  // Hide "no results" message if we have artists to show
  noResults.classList.add("hidden")

  // Render each artist
  artistsToRender.forEach((artist) => {
    const card = artistCardTemplate.content.cloneNode(true)
    const artistCard = card.querySelector(".artist-card")
    const artistLink = artistCard.querySelector(".artist-card-link")

    // Set data and attributes
    artistCard.dataset.id = artist.ID
    artistLink.href = `/artist/${artist.ID}`

    // Set image
    const img = artistCard.querySelector(".artist-image img")
    img.src = artist.Image || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(artist.Name)}`
    img.alt = artist.Name

    // Set text content
    artistCard.querySelector(".artist-name").textContent = artist.Name
    artistCard.querySelector(".creation-date").textContent = `Since ${artist.CreationDate}`
    artistCard.querySelector(".member-count").textContent = `${artist.Members.length} members`

    // Set location count
    const locationCount = artist.Locations ? artist.Locations.length : 0
    artistCard.querySelector(".location-count").textContent =
      locationCount > 0 ? `${locationCount} locations` : "No upcoming concerts"

    // Add to grid
    artistGrid.appendChild(card)
  })
}

// Function to populate location checkboxes
function populateLocationCheckboxes() {
  const locationsContainer = document.getElementById("locations-container")
  const locationCheckboxTemplate = document.getElementById("location-checkbox-template")

  // Clear container
  locationsContainer.innerHTML = ""

  // Get unique locations from all artists
  const uniqueLocations = new Set()

  artists.forEach((artist) => {
    if (artist.Locations && artist.Locations.length > 0) {
      artist.Locations.forEach((location) => {
        // You might need to extract city/country from the location string
        // This depends on your data format
        uniqueLocations.add(location)
      })
    }
  })

  // Convert to array and sort
  const locationsList = Array.from(uniqueLocations).sort()

  // Limit to a reasonable number for UI
  const displayLocations = locationsList.slice(0, 15)

  // Create checkboxes
  displayLocations.forEach((location, index) => {
    const checkbox = locationCheckboxTemplate.content.cloneNode(true)
    const checkboxItem = checkbox.querySelector(".spotify-checkbox")
    const input = checkboxItem.querySelector("input")
    const label = checkboxItem.querySelector("label")
    const labelText = label.querySelector(".checkbox-label")

    const locationId = `location-${index}`
    input.id = locationId
    input.value = location
    label.htmlFor = locationId
    labelText.textContent = location

    locationsContainer.appendChild(checkbox)
  })
}

