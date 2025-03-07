   // DOM Elements
   const body = document.body
   const themeToggle = document.getElementById("theme-toggle")
   const locationToggles = document.querySelectorAll(".location-toggle")

   // Initialize
   document.addEventListener("DOMContentLoaded", () => {
       initTheme()
       initEventListeners()
       initConcertToggles()
   })

   // Theme Functions
   function initTheme() {
       const savedTheme = localStorage.getItem("theme")
       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

       if (savedTheme === "light") {
           body.classList.remove("dark-mode")
           body.classList.add("light-mode")
           updateThemeIcon(false)
       } else if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
           body.classList.add("dark-mode")
           body.classList.remove("light-mode")
           updateThemeIcon(true)
       }
   }

   function toggleTheme() {
       const isDarkMode = body.classList.contains("dark-mode")

       if (isDarkMode) {
           body.classList.remove("dark-mode")
           body.classList.add("light-mode")
           localStorage.setItem("theme", "light")
           updateThemeIcon(false)
       } else {
           body.classList.add("dark-mode")
           body.classList.remove("light-mode")
           localStorage.setItem("theme", "dark")
           updateThemeIcon(true)
       }
   }

   function updateThemeIcon(isDarkMode) {
       const themeIcon = themeToggle.querySelector("i")

       if (isDarkMode) {
           themeIcon.className = "fas fa-sun"
       } else {
           themeIcon.className = "fas fa-moon"
       }
   }

   // Event Listeners
   function initEventListeners() {
       // Theme Toggle
       themeToggle.addEventListener("click", toggleTheme)
   }

   // Initialize concert location toggles
   function initConcertToggles() {
       locationToggles.forEach((toggle) => {
           toggle.addEventListener("click", (e) => {
               e.preventDefault()
               const targetId = toggle.getAttribute("href").substring(1)
               const targetElement = document.getElementById(targetId)

               // Toggle visibility
               if (targetElement.style.display === "none") {
                   targetElement.style.display = "block"
                   toggle.querySelector("i").style.transform = "rotate(-180deg)"
               } else {
                   targetElement.style.display = "none"
                   toggle.querySelector("i").style.transform = "rotate(0)"
               }
           })
       })
   }

