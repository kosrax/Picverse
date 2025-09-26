document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("artworkSubmissionForm")
  const emailInput = document.getElementById("email")
  const titleInput = document.getElementById("title")
  const descriptionInput = document.getElementById("description")
  const tagsInput = document.getElementById("tags")
  const artworkInput = document.getElementById("artwork")
  const aiYesInput = document.getElementById("aiYes")
  const aiNoInput = document.getElementById("aiNo")
  const resetBtn = document.getElementById("resetBtn")
  const submitBtn = document.getElementById("submitBtn")
  const uploadArea = document.getElementById("uploadArea")
  const previewArea = document.getElementById("previewArea")
  const imagePreview = document.getElementById("imagePreview")
  const removeImage = document.getElementById("removeImage")

  const customTagInput = document.getElementById("customTagInput")
  const selectedTagsContainer = document.getElementById("selectedTags")
  const tagButtons = document.querySelectorAll(".tag-btn")

  let selectedTags = []

  // Function to update the selected tags display
  function updateSelectedTagsDisplay() {
    if (selectedTags.length === 0) {
      selectedTagsContainer.innerHTML = '<span class="no-tags-message">No tags selected yet</span>'
    } else {
      selectedTagsContainer.innerHTML = selectedTags
        .map(
          (tag) =>
            `<span class="selected-tag">
          #${tag}
          <button type="button" class="remove-tag" data-tag="${tag}">×</button>
        </span>`,
        )
        .join("")
    }

    // Update hidden input
    tagsInput.value = selectedTags.join(", ")

    // Update tag counter
    const counter = document.querySelector(".tag-counter")
    if (counter) {
      counter.textContent = `${selectedTags.length} tag(s) selected`
    }
  }

  // Function to add a tag
  function addTag(tag) {
    const cleanTag = tag.trim().replace(/^#/, "") // Remove # if present
    if (cleanTag && !selectedTags.includes(cleanTag)) {
      selectedTags.push(cleanTag)
      updateSelectedTagsDisplay()
      updateTagButtons()
    }
  }

  // Function to remove a tag
  function removeTag(tag) {
    selectedTags = selectedTags.filter((t) => t !== tag)
    updateSelectedTagsDisplay()
    updateTagButtons()
  }

  // Function to update tag button states
  function updateTagButtons() {
    tagButtons.forEach((btn) => {
      const tag = btn.dataset.tag
      if (selectedTags.includes(tag)) {
        btn.classList.add("selected")
      } else {
        btn.classList.remove("selected")
      }
    })
  }

  // Handle recommended tag button clicks
  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag
      if (selectedTags.includes(tag)) {
        removeTag(tag)
      } else {
        addTag(tag)
      }
    })
  })

  // Handle custom tag input
  customTagInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const tag = customTagInput.value.trim()
      if (tag) {
        addTag(tag)
        customTagInput.value = ""
      }
    }
  })

  // Handle removing tags from selected tags display
  selectedTagsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-tag")) {
      const tag = e.target.dataset.tag
      removeTag(tag)
    }
  })


  // Error message elements
  const emailError = document.getElementById("emailError")
  const titleError = document.getElementById("titleError")
  const descriptionError = document.getElementById("descriptionError")
  const tagsError = document.getElementById("tagsError")
  const artworkError = document.getElementById("artworkError")
  const aiGeneratedError = document.getElementById("aiGeneratedError")

  // Validation functions
  function validateEmail(email) {
    // Simple email validation
    if (!email) {
      return "Email is required"
    }

    // Check if it has @ and .
    if (!email.includes("@") || !email.includes(".")) {
      return "Please enter a valid email address"
    }

    // Check if there's text before @ and after .
    const parts = email.split("@")
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return "Please enter a valid email address"
    }

    const domainParts = parts[1].split(".")
    if (domainParts.length < 2 || !domainParts[0] || !domainParts[domainParts.length - 1]) {
      return "Please enter a valid email address"
    }

    return ""
  }

  function validateTitle(title) {
    if (!title) {
      return "Title is required"
    }

    if (title.length < 3) {
      return "Title must be at least 3 characters long"
    }

    if (title.length > 100) {
      return "Title must be less than 100 characters"
    }

    return ""
  }

  function validateDescription(description) {
    if (!description) {
      return "Description is required"
    }

    if (description.length < 10) {
      return "Description must be at least 10 characters long"
    }

    if (description.length > 1000) {
      return "Description must be less than 1000 characters"
    }

    return ""
  }

  function validateTags() {
    if (selectedTags.length === 0) {
      return "At least one tag is required"
    }

    if (selectedTags.some((tag) => tag.length < 2)) {
      return "Each tag must be at least 2 characters long"
    }

    return ""
  }

  function validateArtwork(file) {
    if (!file) {
      return "Artwork file is required"
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, and GIF files are allowed"
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return "File size must be less than 10MB"
    }

    return ""
  }

  function validateAiGenerated() {
    if (!aiYesInput.checked && !aiNoInput.checked) {
      return "Please select whether the artwork is AI-generated"
    }

    return ""
  }

  // Handle file upload and preview
  artworkInput.addEventListener("change", (e) => {
    const file = e.target.files[0]

    if (file) {
      const error = validateArtwork(file)
      artworkError.textContent = error

      if (!error) {
        const reader = new FileReader()

        reader.onload = (e) => {
          imagePreview.src = e.target.result
          uploadArea.style.display = "none"
          previewArea.style.display = "block"
        }

        reader.readAsDataURL(file)
      }
    }
  })

  // Handle drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--primary-color)"
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "var(--border-color)"
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--border-color)"

    const file = e.dataTransfer.files[0]

    if (file) {
      artworkInput.files = e.dataTransfer.files

      const error = validateArtwork(file)
      artworkError.textContent = error

      if (!error) {
        const reader = new FileReader()

        reader.onload = (e) => {
          imagePreview.src = e.target.result
          uploadArea.style.display = "none"
          previewArea.style.display = "block"
        }

        reader.readAsDataURL(file)
      }
    }
  })

  // Remove image
  removeImage.addEventListener("click", () => {
    artworkInput.value = ""
    imagePreview.src = ""
    previewArea.style.display = "none"
    uploadArea.style.display = "block"
    artworkError.textContent = ""
  })

  // Reset form
  resetBtn.addEventListener("click", () => {
    form.reset()
    previewArea.style.display = "none"
    uploadArea.style.display = "block"

    // Clear selected tags
    selectedTags = []
    updateSelectedTagsDisplay()
    updateTagButtons()
    customTagInput.value = ""

    // Clear error messages
    emailError.textContent = ""
    titleError.textContent = ""
    descriptionError.textContent = ""
    tagsError.textContent = ""
    artworkError.textContent = ""
    aiGeneratedError.textContent = ""
  })

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate all fields
    const emailErrorMsg = validateEmail(emailInput.value)
    const titleErrorMsg = validateTitle(titleInput.value)
    const descriptionErrorMsg = validateDescription(descriptionInput.value)
    const tagsErrorMsg = validateTags()
    const artworkErrorMsg = validateArtwork(artworkInput.files[0])
    const aiGeneratedErrorMsg = validateAiGenerated()

    // Display error messages
    emailError.textContent = emailErrorMsg
    titleError.textContent = titleErrorMsg
    descriptionError.textContent = descriptionErrorMsg
    tagsError.textContent = tagsErrorMsg
    artworkError.textContent = artworkErrorMsg
    aiGeneratedError.textContent = aiGeneratedErrorMsg

    // Check if there are any errors
    if (
      !emailErrorMsg &&
      !titleErrorMsg &&
      !descriptionErrorMsg &&
      !tagsErrorMsg &&
      !artworkErrorMsg &&
      !aiGeneratedErrorMsg
    ) {
      // Form is valid, submit it
      alert("Artwork submitted successfully!")
      form.reset()
      previewArea.style.display = "none"
      uploadArea.style.display = "block"
    }
  })

  // Real-time validation
  emailInput.addEventListener("blur", () => {
    emailError.textContent = validateEmail(emailInput.value)
  })

  titleInput.addEventListener("blur", () => {
    titleError.textContent = validateTitle(titleInput.value)
  })

  descriptionInput.addEventListener("blur", () => {
    descriptionError.textContent = validateDescription(descriptionInput.value)
  })

  tagsInput.addEventListener("blur", () => {
      tagsError.textContent = validateTags()
  })

  // Add tag counter after selected tags section
  const selectedTagsSection = document.querySelector(".selected-tags-section")
  if (selectedTagsSection) {
    const counter = document.createElement("div")
    counter.className = "tag-counter"
    counter.textContent = "0 tag(s) selected"
    selectedTagsSection.appendChild(counter)
  }

  // Initialize display
  updateSelectedTagsDisplay()
})
