document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mainNav = document.querySelector(".main-nav")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
            if (mainNav.style.display === "flex") {
        // Close the menu
        mainNav.style.display = "none"
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
      } else {
        // Open the menu
        mainNav.style.display = "flex"
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>'

        // Close menu when a link is clicked
        const mobileNavLinks = mainNav.querySelectorAll("a")
        mobileNavLinks.forEach((link) => {
          link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
              mainNav.style.display = "none"
              mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
            }
          })
        })
      }
    })
  }

  // Hero slideshow
  const slides = document.querySelectorAll(".slide")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (slides.length > 0) {
    let currentSlide = 0

    // Function to show a specific slide
    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove("active"))
      slides[index].classList.add("active")
    }

    // Function to show the next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length
      showSlide(currentSlide)
    }

    // Function to show the previous slide
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length
      showSlide(currentSlide)
    }

    // Set up event listeners for the next and previous buttons
    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide)
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide)
    }

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000)
  }

  // Gallery modal
  const artworkCards = document.querySelectorAll(".artwork-card")
  const modal = document.getElementById("artworkModal")
  const closeModal = document.querySelector(".close-modal")
  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalArtist = document.getElementById("modalArtist")

  if (artworkCards.length > 0 && modal) {
    artworkCards.forEach((card) => {
      card.addEventListener("click", function () {
        const img = this.querySelector("img")
        const title = this.querySelector("h3").textContent
        const artist = this.querySelector(".artist").textContent

        modalImage.src = img.src
        modalTitle.textContent = title
        modalArtist.textContent = artist

        modal.style.display = "block"
        document.body.style.overflow = "hidden"
      })
    })

    closeModal.addEventListener("click", () => {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    })

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  }

  // Responsive adjustments
  function handleResponsive() {
    if (window.innerWidth > 768) {
      if (mainNav) {
        mainNav.style.display = "flex"

        // Reset mobile menu button icon
        if (mobileMenuBtn) {
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
        }
      }
    } else {
      if (mainNav) {
        mainNav.style.display = "none"
      }
    }
    
    // Adjust modal position for better mobile viewing
    const modal = document.getElementById("artworkModal")
    if (modal && modal.style.display === "block") {
      const modalContent = modal.querySelector(".modal-content")
      if (modalContent) {
        if (window.innerWidth <= 768) {
          modalContent.style.margin = "20px auto"
          modalContent.style.width = "95%"
        } else {
          modalContent.style.margin = "50px auto"
          modalContent.style.width = "90%"
        }
      }
    }
  }

  window.addEventListener("resize", handleResponsive)
  handleResponsive()

    // Add orientation change event listener
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResponsive, 100)
  })
})
