document.addEventListener("DOMContentLoaded", () => {
  // Initialize the rich text editor
  let quill
  try {
    quill = new Quill("#rich-text-editor", {
      theme: "snow",
      placeholder: "Write task description...",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link"],
          ["clean"],
        ],
      },
    })
  } catch (error) {
    console.error("Quill editor could not be initialized. Ensure Quill library is properly included.", error)
  }

  // Global search functionality
  const globalSearchInput = document.getElementById("global-search-input")
  if (globalSearchInput) {
    globalSearchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.trim().toLowerCase()
        if (searchTerm) {
          alert(
            `Searching across all projects for: "${searchTerm}"\nThis would search tasks, contacts, and all other data.`,
          )
          // In a real app, this would trigger a global search across all data
        }
      }
    })
  }

  // User dropdown toggle
  const userDropdown = document.querySelector(".user-dropdown")
  if (userDropdown) {
    userDropdown.addEventListener("click", () => {
      const dropdownMenu = document.querySelector(".user-dropdown-menu")
      if (dropdownMenu) {
        dropdownMenu.classList.toggle("show")
      }
    })
  }

  // Global navigation active state
  const globalNavItems = document.querySelectorAll(".global-nav-item")
  globalNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      globalNavItems.forEach((navItem) => navItem.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // View switching
  const viewButtons = document.querySelectorAll(".view-btn")
  const taskViews = document.querySelectorAll(".task-view")

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const viewType = button.getAttribute("data-view")

      // Update active button
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Show selected view
      taskViews.forEach((view) => {
        view.classList.remove("active")
        if (view.id === `${viewType}-view`) {
          view.classList.add("active")
        }
      })
    })
  })

  // Add this code after the view switching code for the view buttons
  // Sidebar navigation
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a")

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const viewType = link.getAttribute("data-view")

      // Skip if the view doesn't exist
      if (!document.getElementById(`${viewType}-view`) && viewType !== "reports" && viewType !== "settings") {
        return
      }

      // Update active sidebar link
      sidebarLinks.forEach((sidebarLink) => {
        sidebarLink.parentElement.classList.remove("active")
      })
      link.parentElement.classList.add("active")

      // Handle special views like reports and settings
      if (viewType === "reports" || viewType === "settings") {
        // Hide all views
        taskViews.forEach((view) => {
          view.classList.remove("active")
        })

        // Show a message for these views
        alert(`The ${viewType} view is not implemented in this demo.`)
        return
      }

      // Update active view button
      viewButtons.forEach((btn) => {
        btn.classList.remove("active")
        if (btn.getAttribute("data-view") === viewType) {
          btn.classList.add("active")
        }
      })

      // Show selected view
      taskViews.forEach((view) => {
        view.classList.remove("active")
        if (view.id === `${viewType}-view`) {
          view.classList.add("active")
        }
      })
    })
  })

  // Dropdown toggle
  document.addEventListener("click", (e) => {
    const dropdown = e.target.closest(".dropdown")

    if (!dropdown) {
      // Close all dropdowns if clicking outside
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show")
      })
      return
    }

    if (e.target.closest(".dropdown-toggle")) {
      const menu = dropdown.querySelector(".dropdown-menu")
      menu.classList.toggle("show")

      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.remove("show")
        }
      })

      e.stopPropagation()
    }
  })

  // Modal handling
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId)
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  const closeModal = (modal) => {
    modal.classList.remove("show")
    document.body.style.overflow = ""
  }

  // Close modal when clicking on close button or outside
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal")
      closeModal(modal)
    })
  })

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Open task modal
  document.getElementById("create-task-btn").addEventListener("click", () => {
    document.getElementById("modal-title").textContent = "Create New Task"
    document.getElementById("task-form").reset()
    if (quill) {
      quill.root.innerHTML = ""
    }
    document.getElementById("tags-container").innerHTML = ""
    document.getElementById("attachments-preview").innerHTML = ""
    document.getElementById("subtask-list").innerHTML = ""
    openModal("task-modal")
  })

  // Open save filter modal
  document.getElementById("save-filter-btn").addEventListener("click", () => {
    openModal("save-filter-modal")
  })

  // Tags input handling
  const tagsInput = document.getElementById("task-tags")
  const tagsContainer = document.getElementById("tags-container")

  tagsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && tagsInput.value.trim() !== "") {
      e.preventDefault()

      const tag = tagsInput.value.trim()
      const tagElement = document.createElement("div")
      tagElement.classList.add("tag-item")
      tagElement.innerHTML = `
                ${tag}
                <button type="button" class="tag-remove">
                    <i class="fas fa-times"></i>
                </button>
            `

      tagsContainer.appendChild(tagElement)
      tagsInput.value = ""

      // Add event listener to remove tag
      tagElement.querySelector(".tag-remove").addEventListener("click", () => {
        tagsContainer.removeChild(tagElement)
      })
    }
  })

  // Subtasks handling
  const newSubtaskInput = document.getElementById("new-subtask")
  const subtaskList = document.getElementById("subtask-list")
  const addSubtaskBtn = document.getElementById("add-subtask-btn")

  const addSubtask = () => {
    const subtaskText = newSubtaskInput.value.trim()
    if (subtaskText !== "") {
      const subtaskElement = document.createElement("div")
      subtaskElement.classList.add("subtask-item")
      subtaskElement.innerHTML = `
                <input type="checkbox" class="subtask-checkbox">
                <span class="subtask-text">${subtaskText}</span>
                <button type="button" class="subtask-remove">
                    <i class="fas fa-times"></i>
                </button>
            `

      subtaskList.appendChild(subtaskElement)
      newSubtaskInput.value = ""

      // Add event listener to remove subtask
      subtaskElement.querySelector(".subtask-remove").addEventListener("click", () => {
        subtaskList.removeChild(subtaskElement)
      })
    }
  }

  addSubtaskBtn.addEventListener("click", addSubtask)
  newSubtaskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSubtask()
    }
  })

  // File attachments handling
  const fileInput = document.getElementById("task-attachments")
  const attachmentsPreview = document.getElementById("attachments-preview")

  fileInput.addEventListener("change", () => {
    attachmentsPreview.innerHTML = ""

    Array.from(fileInput.files).forEach((file) => {
      const attachmentElement = document.createElement("div")
      attachmentElement.classList.add("attachment-item")

      // Determine icon based on file type
      let icon = "file"
      if (file.type.startsWith("image/")) icon = "image"
      else if (file.type.startsWith("video/")) icon = "video"
      else if (file.type.startsWith("audio/")) icon = "music"
      else if (file.type.includes("pdf")) icon = "file-pdf"
      else if (file.type.includes("word")) icon = "file-word"
      else if (file.type.includes("excel") || file.type.includes("sheet")) icon = "file-excel"

      attachmentElement.innerHTML = `
                <i class="fas fa-${icon}"></i>
                <span>${file.name}</span>
                <button type="button" class="attachment-remove">
                    <i class="fas fa-times"></i>
                </button>
            `

      attachmentsPreview.appendChild(attachmentElement)

      // Add event listener to remove attachment
      attachmentElement.querySelector(".attachment-remove").addEventListener("click", () => {
        attachmentsPreview.removeChild(attachmentElement)
        // Note: This doesn't actually remove the file from the input
        // In a real app, you'd need to handle this with a custom file list
      })
    })
  })

  // Custom fields handling
  const fieldTypeSelect = document.getElementById("field-type")
  const fieldOptionsContainer = document.querySelector(".field-options-container")

  fieldTypeSelect.addEventListener("change", () => {
    if (fieldTypeSelect.value === "dropdown") {
      fieldOptionsContainer.style.display = "block"
    } else {
      fieldOptionsContainer.style.display = "none"
    }
  })

  document.getElementById("add-custom-field-btn").addEventListener("click", () => {
    openModal("custom-field-modal")
  })

  document.getElementById("add-field-btn").addEventListener("click", () => {
    const fieldName = document.getElementById("field-name").value.trim()
    const fieldType = document.getElementById("field-type").value

    if (fieldName !== "") {
      const customFieldsContainer = document.getElementById("custom-fields-container")
      const fieldElement = document.createElement("div")
      fieldElement.classList.add("form-group")

      let fieldHtml = `<label for="custom-${fieldName.toLowerCase().replace(/\s+/g, "-")}">${fieldName}</label>`

      switch (fieldType) {
        case "text":
          fieldHtml += `<input type="text" id="custom-${fieldName.toLowerCase().replace(/\s+/g, "-")}">`
          break
        case "number":
          fieldHtml += `<input type="number" id="custom-${fieldName.toLowerCase().replace(/\s+/g, "-")}">`
          break
        case "date":
          fieldHtml += `<input type="date" id="custom-${fieldName.toLowerCase().replace(/\s+/g, "-")}">`
          break
        case "checkbox":
          fieldHtml += `<div class="checkbox-group"><label><input type="checkbox" id="custom-${fieldName.toLowerCase().replace(/\s+/g, "-")}"> ${fieldName}</label></div>`
          break
        case "dropdown":
          const options = document
            .getElementById("field-options")
            .value.split("\n")
            .filter((opt) => opt.trim() !== "")
          fieldHtml += `<select id="custom-${fieldName.toLowerCase().replace(/\s+/g, "-")}">`
          options.forEach((option) => {
            fieldHtml += `<option value="${option.trim()}">${option.trim()}</option>`
          })
          fieldHtml += `</select>`
          break
      }

      fieldElement.innerHTML = fieldHtml
      customFieldsContainer.appendChild(fieldElement)

      // Close the modal and reset form
      closeModal(document.getElementById("custom-field-modal"))
      document.getElementById("custom-field-form").reset()
      fieldOptionsContainer.style.display = "none"
    }
  })

  // Initialize the task list
  const initializeTaskData = () => {
    console.log("initializeTaskData function called")
  }
  initializeTaskData()
})
