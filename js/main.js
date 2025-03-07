// DOM Elements
const body = document.body
const themeToggle = document.getElementById("theme-toggle")
const mobileThemeToggle = document.getElementById("mobile-theme-toggle")
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const mobileMenu = document.querySelector(".mobile-menu")
const filterSidebar = document.getElementById("filter-sidebar")
const showFilterBtn = document.getElementById("show-filter-btn")
const closeFilterBtn = document.getElementById("close-filter")

// Range Sliders
const creationMinSlider = document.getElementById("creation-min")
const creationMaxSlider = document.getElementById("creation-max")
const creationMinValue = document.getElementById("creation-min-value")
const creationMaxValue = document.getElementById("creation-max-value")
const albumMinSlider = document.getElementById("album-min")
const albumMaxSlider = document.getElementById("album-max")
const albumMinValue = document.getElementById("album-min-value")
const albumMaxValue = document.getElementById("album-max-value")

// Slider Cards
const creationSliderCard = document.getElementById("creation-slider-card")
const albumSliderCard = document.getElementById("album-slider-card")

// Filter Buttons
const applyFiltersBtn = document.getElementById("apply-filters")
const resetFiltersBtn = document.getElementById("reset-filters")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  initEventListeners()
  updateSliderCards()
  initArtistHoverEffects()
})

// Theme Functions
function initTheme() {
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "light") {
    body.classList.remove("dark-mode")
    body.classList.add("light-mode")
    updateThemeIcons(false)
  } else if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    body.classList.add("dark-mode")
    body.classList.remove("light-mode")
    updateThemeIcons(true)
  }
}

function toggleTheme() {
  const isDarkMode = body.classList.contains("dark-mode")

  if (isDarkMode) {
    body.classList.remove("dark-mode")
    body.classList.add("light-mode")
    localStorage.setItem("theme", "light")
    updateThemeIcons(false)
  } else {
    body.classList.add("dark-mode")
    body.classList.remove("light-mode")
    localStorage.setItem("theme", "dark")
    updateThemeIcons(true)
  }
}

function updateThemeIcons(isDarkMode) {
  const themeIcon = themeToggle.querySelector("i")
  const mobileThemeIcon = mobileThemeToggle.querySelector("i")

  if (isDarkMode) {
    themeIcon.className = "fas fa-sun"
    mobileThemeIcon.className = "fas fa-sun"
  } else {
    themeIcon.className = "fas fa-moon"
    mobileThemeIcon.className = "fas fa-moon"
  }
}

// Event Listeners
function initEventListeners() {
  // Theme Toggle
  themeToggle.addEventListener("click", toggleTheme)
  mobileThemeToggle.addEventListener("click", toggleTheme)

  // Mobile Menu
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show")
  })

  // Filter Sidebar
  showFilterBtn.addEventListener("click", () => {
    filterSidebar.classList.add("show")
  })

  closeFilterBtn.addEventListener("click", () => {
    filterSidebar.classList.remove("show")
  })

  // Range Sliders
  creationMinSlider.addEventListener("input", () => {
    const minVal = Number.parseInt(creationMinSlider.value)
    const maxVal = Number.parseInt(creationMaxSlider.value)

    if (minVal > maxVal) {
      creationMaxSlider.value = minVal
      creationMaxValue.textContent = minVal
    }

    creationMinValue.textContent = minVal
    updateSliderCards()
  })

  creationMaxSlider.addEventListener("input", () => {
    const minVal = Number.parseInt(creationMinSlider.value)
    const maxVal = Number.parseInt(creationMaxSlider.value)

    if (maxVal < minVal) {
      creationMinSlider.value = maxVal
      creationMinValue.textContent = maxVal
    }

    creationMaxValue.textContent = maxVal
    updateSliderCards()
  })

  albumMinSlider.addEventListener("input", () => {
    const minVal = Number.parseInt(albumMinSlider.value)
    const maxVal = Number.parseInt(albumMaxSlider.value)

    if (minVal > maxVal) {
      albumMaxSlider.value = minVal
      albumMaxValue.textContent = minVal
    }

    albumMinValue.textContent = minVal
    updateSliderCards()
  })

  albumMaxSlider.addEventListener("input", () => {
    const minVal = Number.parseInt(albumMinSlider.value)
    const maxVal = Number.parseInt(albumMaxSlider.value)

    if (maxVal < minVal) {
      albumMinSlider.value = maxVal
      albumMinValue.textContent = maxVal
    }

    albumMaxValue.textContent = maxVal
    updateSliderCards()
  })

  // Filter Buttons
  applyFiltersBtn.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      filterSidebar.classList.remove("show")
    }
  })

  resetFiltersBtn.addEventListener("click", () => {
    // Reset range sliders
    creationMinSlider.value = 1950
    creationMaxSlider.value = 2023
    creationMinValue.textContent = 1950
    creationMaxValue.textContent = 2023

    albumMinSlider.value = 1950
    albumMaxSlider.value = 2023
    albumMinValue.textContent = 1950
    albumMaxValue.textContent = 2023

    // Reset checkboxes
    document.querySelectorAll('[id^="member-"]:checked').forEach((checkbox) => {
      checkbox.checked = false
    })

    document.querySelectorAll('[id^="location-"]:checked').forEach((checkbox) => {
      checkbox.checked = false
    })

    // Update slider cards
    updateSliderCards()
  })

  // Close filter sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (
      filterSidebar.classList.contains("show") &&
      !filterSidebar.contains(e.target) &&
      e.target !== showFilterBtn &&
      !showFilterBtn.contains(e.target)
    ) {
      filterSidebar.classList.remove("show")
    }
  })
}

// Slider Card Functions
function updateSliderCards() {
  // Creation date slider card
  const creationMin = Number.parseInt(creationMinSlider.value)
  const creationMax = Number.parseInt(creationMaxSlider.value)
  const creationMidpoint = (creationMin + creationMax) / 2
  const creationPercentage = (creationMidpoint - 1950) / (2023 - 1950)

  // Position the card
  const creationCardPosition = Math.max(0, Math.min(creationPercentage * 100, 100))
  creationSliderCard.style.left = `calc(${creationCardPosition}% - 50px)`

  // Apply filter based on position
  const creationFilterValue = Math.min(creationPercentage * 2, 1)
  creationSliderCard.querySelector("img").style.filter = `grayscale(${1 - creationFilterValue})`

  // Album date slider card
  const albumMin = Number.parseInt(albumMinSlider.value)
  const albumMax = Number.parseInt(albumMaxSlider.value)
  const albumMidpoint = (albumMin + albumMax) / 2
  const albumPercentage = (albumMidpoint - 1950) / (2023 - 1950)

  // Position the card
  const albumCardPosition = Math.max(0, Math.min(albumPercentage * 100, 100))
  albumSliderCard.style.left = `calc(${albumCardPosition}% - 50px)`

  // Apply filter based on position
  const albumFilterValue = Math.min(albumPercentage * 2, 1)
  albumSliderCard.querySelector("img").style.filter = `grayscale(${1 - albumFilterValue})`
}

// Artist Card Hover Effects
function initArtistHoverEffects() {
  // Add hover effects to artist cards that might be added dynamically
  document.addEventListener(
    "mouseover",
    (e) => {
      const artistCard = e.target.closest(".artist-card")
      if (artistCard) {
        const playOverlay = artistCard.querySelector(".play-overlay")
        if (playOverlay) {
          playOverlay.style.opacity = "1"
        }

        const playBtn = artistCard.querySelector(".play-btn")
        if (playBtn) {
          playBtn.style.transform = "translateY(0)"
        }
      }
    },
    true,
  )

  document.addEventListener(
    "mouseout",
    (e) => {
      const artistCard = e.target.closest(".artist-card")
      if (artistCard) {
        const playOverlay = artistCard.querySelector(".play-overlay")
        if (playOverlay) {
          playOverlay.style.opacity = "0"
        }

        const playBtn = artistCard.querySelector(".play-btn")
        if (playBtn) {
          playBtn.style.transform = "translateY(10px)"
        }
      }
    },
    true,
  )
}



//////////////////////////////////////////////////




