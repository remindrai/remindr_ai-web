document.addEventListener("DOMContentLoaded", () => {
  // Declare Quill variable
  let Quill

  // Declare sampleTasks variable
  const sampleTasks = []

  // Declare renderTaskList variable
  let renderTaskList

  // Declare renderKanbanBoard variable
  let renderKanbanBoard

  // Declare renderCalendar variable
  let renderCalendar

  // Declare renderGanttChart variable
  let renderGanttChart

  // Task template functionality
  const templateData = [
    {
      name: "Bug Report",
      description: "<p>Investigate and fix a reported bug.</p>",
      subtasks: ["Reproduce the issue", "Identify root cause", "Implement fix", "Write tests", "Document solution"],
      tags: ["Bug", "Fix"],
      priority: "high",
      customFields: [
        { name: "Bug ID", type: "text" },
        { name: "Affected Systems", type: "text" },
        { name: "Reproducibility", type: "dropdown", options: ["Always", "Sometimes", "Rarely"] },
      ],
    },
    {
      name: "Feature Request",
      description: "<p>Implement a new feature based on requirements.</p>",
      subtasks: [
        "Analyze requirements",
        "Create design document",
        "Implement feature",
        "Write tests",
        "Update documentation",
      ],
      tags: ["Feature", "Enhancement"],
      priority: "medium",
      customFields: [
        { name: "Feature ID", type: "text" },
        { name: "Estimated Hours", type: "number" },
      ],
    },
    {
      name: "Documentation Task",
      description: "<p>Create or update documentation for a feature or process.</p>",
      subtasks: ["Research topic", "Create outline", "Write first draft", "Get feedback", "Finalize documentation"],
      tags: ["Documentation"],
      priority: "low",
      customFields: [
        { name: "Doc Type", type: "dropdown", options: ["User Guide", "API Reference", "Tutorial", "Process"] },
      ],
    },
  ]

  // Add template dropdown to task modal
  const taskForm = document.getElementById("task-form")
  const templateDropdown = document.createElement("div")
  templateDropdown.classList.add("form-group")
  templateDropdown.innerHTML = `
        <label for="task-template">Use Template</label>
        <select id="task-template">
            <option value="">Select a template...</option>
            ${templateData.map((template) => `<option value="${template.name}">${template.name}</option>`).join("")}
        </select>
    `

  taskForm.insertBefore(templateDropdown, taskForm.firstChild)

  // Template selection handler
  document.getElementById("task-template").addEventListener("change", function () {
    const templateName = this.value
    if (!templateName) return

    const template = templateData.find((t) => t.name === templateName)
    if (!template) return

    // Apply template to form
    document.getElementById("task-title").value = ""

    // Set description
    const quill = Quill.find(document.getElementById("rich-text-editor"))
    quill.root.innerHTML = template.description

    // Set priority
    document.getElementById("task-priority").value = template.priority

    // Set tags
    const tagsContainer = document.getElementById("tags-container")
    tagsContainer.innerHTML = ""
    template.tags.forEach((tag) => {
      const tagElement = document.createElement("div")
      tagElement.classList.add("tag-item")
      tagElement.innerHTML = `
                ${tag}
                <button type="button" class="tag-remove">
                    <i class="fas fa-times"></i>
                </button>
            `

      tagsContainer.appendChild(tagElement)

      // Add event listener to remove tag
      tagElement.querySelector(".tag-remove").addEventListener("click", () => {
        tagsContainer.removeChild(tagElement)
      })
    })

    // Set subtasks
    const subtaskList = document.getElementById("subtask-list")
    subtaskList.innerHTML = ""
    template.subtasks.forEach((subtask) => {
      const subtaskElement = document.createElement("div")
      subtaskElement.classList.add("subtask-item")
      subtaskElement.innerHTML = `
                <input type="checkbox" class="subtask-checkbox">
                <span class="subtask-text">${subtask}</span>
                <button type="button" class="subtask-remove">
                    <i class="fas fa-times"></i>
                </button>
            `

      subtaskList.appendChild(subtaskElement)

      // Add event listener to remove subtask
      subtaskElement.querySelector(".subtask-remove").addEventListener("click", () => {
        subtaskList.removeChild(subtaskElement)
      })
    })

    // Set custom fields
    const customFieldsContainer = document.getElementById("custom-fields-container")
    customFieldsContainer.innerHTML = ""
    template.customFields.forEach((field) => {
      const fieldElement = document.createElement("div")
      fieldElement.classList.add("form-group")

      let fieldHtml = `<label for="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}">${field.name}</label>`

      switch (field.type) {
        case "text":
          fieldHtml += `<input type="text" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}">`
          break
        case "number":
          fieldHtml += `<input type="number" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}">`
          break
        case "date":
          fieldHtml += `<input type="date" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}">`
          break
        case "checkbox":
          fieldHtml += `<div class="checkbox-group"><label><input type="checkbox" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}"> ${field.name}</label></div>`
          break
        case "dropdown":
          fieldHtml += `<select id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}">`
          field.options.forEach((option) => {
            fieldHtml += `<option value="${option}">${option}</option>`
          })
          fieldHtml += `</select>`
          break
      }

      fieldElement.innerHTML = fieldHtml
      customFieldsContainer.appendChild(fieldElement)
    })
  })

  // Add @mentions functionality to comments
  const commentInput = document.getElementById("comment-input")

  commentInput.addEventListener("input", function () {
    const text = this.value
    const lastWord = text.split(" ").pop()

    if (lastWord.startsWith("@")) {
      // In a real app, you would show a dropdown of users to mention
      // For this demo, we'll just highlight the @mention
      this.style.color = "#4f46e5"
    } else {
      this.style.color = ""
    }
  })

  // Task watcher functionality
  const taskDetailsHeader = document.querySelector(".modal-header-actions")
  const watchButton = document.createElement("button")
  watchButton.classList.add("btn", "btn-sm", "btn-outline")
  watchButton.innerHTML = '<i class="fas fa-eye"></i> Watch'
  watchButton.style.marginRight = "0.5rem"

  let isWatching = false

  watchButton.addEventListener("click", function () {
    isWatching = !isWatching

    if (isWatching) {
      this.innerHTML = '<i class="fas fa-eye-slash"></i> Unwatch'

      // In a real app, you would add the user to the task watchers
      // For this demo, we'll just show a notification
      alert("You are now watching this task. You will receive notifications for updates.")
    } else {
      this.innerHTML = '<i class="fas fa-eye"></i> Watch'

      // In a real app, you would remove the user from the task watchers
      alert("You are no longer watching this task.")
    }
  })

  taskDetailsHeader.insertBefore(watchButton, taskDetailsHeader.firstChild)

  // Bulk actions functionality
  const taskListHeader = document.querySelector(".task-list-header")
  const bulkActionsContainer = document.createElement("div")
  bulkActionsContainer.classList.add("bulk-actions")
  bulkActionsContainer.style.display = "none"
  bulkActionsContainer.style.padding = "0.5rem 1rem"
  bulkActionsContainer.style.backgroundColor = "#f3f4f6"
  bulkActionsContainer.style.borderBottom = "1px solid #e5e7eb"
  bulkActionsContainer.innerHTML = `
        <span><span id="selected-count">0</span> items selected</span>
        <div class="bulk-actions-buttons">
            <button class="btn btn-sm btn-outline bulk-status-btn">
                <i class="fas fa-exchange-alt"></i> Change Status
            </button>
            <button class="btn btn-sm btn-outline bulk-assignee-btn">
                <i class="fas fa-user"></i> Assign To
            </button>
            <button class="btn btn-sm btn-outline bulk-priority-btn">
                <i class="fas fa-flag"></i> Set Priority
            </button>
            <button class="btn btn-sm btn-danger bulk-delete-btn">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `

  bulkActionsContainer.querySelector(".bulk-actions-buttons").style.display = "flex"
  bulkActionsContainer.querySelector(".bulk-actions-buttons").style.gap = "0.5rem"

  document.querySelector(".main-content").insertBefore(bulkActionsContainer, taskListHeader)

  // Select all checkbox
  const selectAllCheckbox = document.getElementById("select-all")

  selectAllCheckbox.addEventListener("change", function () {
    const isChecked = this.checked
    const taskCheckboxes = document.querySelectorAll('.task-item .task-checkbox input[type="checkbox"]')

    taskCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked
    })

    updateBulkActions()
  })

  // Task checkbox change
  document.addEventListener("change", (e) => {
    if (e.target.matches('.task-item .task-checkbox input[type="checkbox"]')) {
      updateBulkActions()
    }
  })

  function updateBulkActions() {
    const selectedCheckboxes = document.querySelectorAll('.task-item .task-checkbox input[type="checkbox"]:checked')
    const selectedCount = selectedCheckboxes.length

    document.getElementById("selected-count").textContent = selectedCount

    if (selectedCount > 0) {
      bulkActionsContainer.style.display = "flex"
      bulkActionsContainer.style.justifyContent = "space-between"
      bulkActionsContainer.style.alignItems = "center"
    } else {
      bulkActionsContainer.style.display = "none"
    }
  }

  // Bulk action buttons
  bulkActionsContainer.querySelector(".bulk-status-btn").addEventListener("click", () => {
    const selectedTaskIds = Array.from(
      document.querySelectorAll('.task-item .task-checkbox input[type="checkbox"]:checked'),
    ).map((checkbox) => Number.parseInt(checkbox.closest(".task-item").getAttribute("data-task-id")))

    // In a real app, you would show a dropdown to select the status
    // For this demo, we'll just set all selected tasks to "in-progress"
    selectedTaskIds.forEach((taskId) => {
      const task = sampleTasks.find((t) => t.id === taskId)
      if (task) {
        task.status = "in-progress"
      }
    })

    // Refresh views
    renderTaskList()
    renderKanbanBoard()

    // Reset selection
    selectAllCheckbox.checked = false
    updateBulkActions()
  })

  bulkActionsContainer.querySelector(".bulk-assignee-btn").addEventListener("click", () => {
    const selectedTaskIds = Array.from(
      document.querySelectorAll('.task-item .task-checkbox input[type="checkbox"]:checked'),
    ).map((checkbox) => Number.parseInt(checkbox.closest(".task-item").getAttribute("data-task-id")))

    // In a real app, you would show a dropdown to select the assignee
    // For this demo, we'll just assign all selected tasks to John Doe
    selectedTaskIds.forEach((taskId) => {
      const task = sampleTasks.find((t) => t.id === taskId)
      if (task) {
        task.assignee = {
          id: 1,
          name: "John Doe",
          avatar: "assets/user-avatar.jpg",
        }
      }
    })

    // Refresh views
    renderTaskList()
    renderKanbanBoard()

    // Reset selection
    selectAllCheckbox.checked = false
    updateBulkActions()
  })

  bulkActionsContainer.querySelector(".bulk-priority-btn").addEventListener("click", () => {
    const selectedTaskIds = Array.from(
      document.querySelectorAll('.task-item .task-checkbox input[type="checkbox"]:checked'),
    ).map((checkbox) => Number.parseInt(checkbox.closest(".task-item").getAttribute("data-task-id")))

    // In a real app, you would show a dropdown to select the priority
    // For this demo, we'll just set all selected tasks to "high" priority
    selectedTaskIds.forEach((taskId) => {
      const task = sampleTasks.find((t) => t.id === taskId)
      if (task) {
        task.priority = "high"
      }
    })

    // Refresh views
    renderTaskList()
    renderKanbanBoard()

    // Reset selection
    selectAllCheckbox.checked = false
    updateBulkActions()
  })

  bulkActionsContainer.querySelector(".bulk-delete-btn").addEventListener("click", () => {
    const selectedTaskIds = Array.from(
      document.querySelectorAll('.task-item .task-checkbox input[type="checkbox"]:checked'),
    ).map((checkbox) => Number.parseInt(checkbox.closest(".task-item").getAttribute("data-task-id")))

    if (confirm(`Are you sure you want to delete ${selectedTaskIds.length} tasks?`)) {
      // Remove selected tasks
      selectedTaskIds.forEach((taskId) => {
        const taskIndex = sampleTasks.findIndex((t) => t.id === taskId)
        if (taskIndex !== -1) {
          sampleTasks.splice(taskIndex, 1)
        }
      })

      // Refresh views
      renderTaskList()
      renderKanbanBoard()
      renderCalendar()
      renderGanttChart()

      // Reset selection
      selectAllCheckbox.checked = false
      updateBulkActions()
    }
  })
})
