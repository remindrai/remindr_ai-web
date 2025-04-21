document.addEventListener("DOMContentLoaded", () => {
  // Initialize view-specific functionality

  // Declare variables (assuming they are defined elsewhere or will be)
  let Quill
  let sampleTasks
  let renderTaskList
  let renderKanbanBoard
  let renderCalendar
  let renderGanttChart

  // Save task button
  document.getElementById("save-task-btn").addEventListener("click", () => {
    // Get form values
    const title = document.getElementById("task-title").value.trim()
    if (!title) {
      alert("Task title is required")
      return
    }

    // Get rich text editor content
    const quill = Quill.find(document.getElementById("rich-text-editor"))
    const description = quill.root.innerHTML

    // Get other form values
    const status = document.getElementById("task-status").value
    const priority = document.getElementById("task-priority").value
    const assigneeId = document.getElementById("task-assignee").value
    const dueDate = document.getElementById("task-due-date").value

    // Get tags
    const tags = []
    document.querySelectorAll("#tags-container .tag-item").forEach((tagElement) => {
      tags.push(tagElement.textContent.trim())
    })

    // Get subtasks
    const subtasks = []
    document.querySelectorAll("#subtask-list .subtask-item").forEach((subtaskElement) => {
      subtasks.push({
        text: subtaskElement.querySelector(".subtask-text").textContent,
        completed: subtaskElement.querySelector(".subtask-checkbox").checked,
      })
    })

    // Get custom fields
    const customFields = []
    document.querySelectorAll("#custom-fields-container .form-group").forEach((fieldElement) => {
      const label = fieldElement.querySelector("label").textContent
      const input = fieldElement.querySelector("input, select, textarea")
      let value

      if (input.type === "checkbox") {
        value = input.checked
      } else {
        value = input.value
      }

      customFields.push({
        name: label,
        type: input.type,
        value: value,
      })
    })

    // Create new task object
    const newTask = {
      id: Date.now(), // Use timestamp as ID for new tasks
      title,
      description,
      status,
      priority,
      assignee: assigneeId
        ? {
            id: Number.parseInt(assigneeId),
            name: document.getElementById("task-assignee").options[
              document.getElementById("task-assignee").selectedIndex
            ].text,
            avatar: "assets/user-avatar.jpg", // Default avatar
          }
        : null,
      dueDate,
      tags,
      attachments: [], // Would need to handle file uploads in a real app
      subtasks,
      customFields,
      comments: [],
      activity: [{ type: "created", user: "Current User", timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, you would save this to a database
    // For this demo, we'll just add it to our sample tasks
    sampleTasks.push(newTask)

    // Refresh views
    renderTaskList()
    renderKanbanBoard()
    renderCalendar()
    renderGanttChart()

    // Close the modal
    const modal = document.getElementById("task-modal")
    modal.classList.remove("show")
    document.body.style.overflow = ""
  })

  // Save filter button
  document.getElementById("save-filter-confirm-btn").addEventListener("click", () => {
    const filterName = document.getElementById("filter-name").value.trim()
    const filterDescription = document.getElementById("filter-description").value.trim()

    if (!filterName) {
      alert("Filter name is required")
      return
    }

    // In a real app, you would save this filter to user preferences
    // For this demo, we'll just add it to the dropdown
    const savedFiltersDropdown = document.querySelector(".saved-filters .dropdown-menu")
    const filterItem = document.createElement("a")
    filterItem.classList.add("dropdown-item")
    filterItem.innerHTML = `<i class="fas fa-filter"></i> ${filterName}`
    savedFiltersDropdown.appendChild(filterItem)

    // Close the modal
    const modal = document.getElementById("save-filter-modal")
    modal.classList.remove("show")
    document.body.style.overflow = ""
  })

  // Add comment button
  document.getElementById("add-comment-btn").addEventListener("click", () => {
    const commentText = document.getElementById("comment-input").value.trim()
    if (!commentText) return

    const commentsContainer = document.getElementById("comments-list")
    const commentElement = document.createElement("div")
    commentElement.classList.add("comment-item")

    // Format timestamp
    const now = new Date()
    const formattedDate =
      now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    commentElement.innerHTML = `
            <img src="assets/user-avatar.jpg" alt="Current User" class="avatar avatar-sm">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">Current User</span>
                    <span class="comment-time">${formattedDate}</span>
                </div>
                <div class="comment-text">${commentText}</div>
            </div>
        `

    // Remove "No comments yet" message if it exists
    const noCommentsMessage = commentsContainer.querySelector("p")
    if (noCommentsMessage) {
      commentsContainer.removeChild(noCommentsMessage)
    }

    commentsContainer.appendChild(commentElement)
    document.getElementById("comment-input").value = ""

    // In a real app, you would save this comment to the task
  })

  // Status change in task details
  document.getElementById("task-details-status").addEventListener("change", function () {
    const newStatus = this.value
    const taskId = Number.parseInt(document.querySelector(".task-item[data-task-id]").getAttribute("data-task-id"))

    // Update task status
    const task = sampleTasks.find((t) => t.id === taskId)
    if (task) {
      const oldStatus = task.status
      task.status = newStatus

      // Add activity
      task.activity.push({
        type: "status_change",
        user: "Current User",
        from: oldStatus,
        to: newStatus,
        timestamp: new Date().toISOString(),
      })

      // Update activity log
      const activityContainer = document.getElementById("task-details-activity")
      const activityElement = document.createElement("div")
      activityElement.classList.add("activity-item")

      const now = new Date()
      const formattedDate =
        now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="activity-content">
                    Current User changed status from "${oldStatus}" to "${newStatus}"
                    <div class="activity-time">${formattedDate}</div>
                </div>
            `

      activityContainer.prepend(activityElement)

      // Refresh views
      renderTaskList()
      renderKanbanBoard()
    }
  })

  // Assignee change in task details
  document.getElementById("task-details-assignee").addEventListener("change", function () {
    const newAssigneeId = this.value
    const taskId = Number.parseInt(document.querySelector(".task-item[data-task-id]").getAttribute("data-task-id"))

    // Update task assignee
    const task = sampleTasks.find((t) => t.id === taskId)
    if (task) {
      const oldAssignee = task.assignee ? task.assignee.name : "Unassigned"

      if (newAssigneeId) {
        const assigneeOption = this.options[this.selectedIndex]
        task.assignee = {
          id: Number.parseInt(newAssigneeId),
          name: assigneeOption.text,
          avatar: "assets/user-avatar.jpg", // Default avatar
        }
      } else {
        task.assignee = null
      }

      const newAssignee = task.assignee ? task.assignee.name : "Unassigned"

      // Add activity
      task.activity.push({
        type: "assignee_change",
        user: "Current User",
        from: oldAssignee,
        to: newAssignee,
        timestamp: new Date().toISOString(),
      })

      // Update activity log
      const activityContainer = document.getElementById("task-details-activity")
      const activityElement = document.createElement("div")
      activityElement.classList.add("activity-item")

      const now = new Date()
      const formattedDate =
        now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="activity-content">
                    Current User changed assignee from "${oldAssignee}" to "${newAssignee}"
                    <div class="activity-time">${formattedDate}</div>
                </div>
            `

      activityContainer.prepend(activityElement)

      // Refresh views
      renderTaskList()
      renderKanbanBoard()
    }
  })

  // Priority change in task details
  document.getElementById("task-details-priority").addEventListener("change", function () {
    const newPriority = this.value
    const taskId = Number.parseInt(document.querySelector(".task-item[data-task-id]").getAttribute("data-task-id"))

    // Update task priority
    const task = sampleTasks.find((t) => t.id === taskId)
    if (task) {
      const oldPriority = task.priority
      task.priority = newPriority

      // Add activity
      task.activity.push({
        type: "priority_change",
        user: "Current User",
        from: oldPriority,
        to: newPriority,
        timestamp: new Date().toISOString(),
      })

      // Update activity log
      const activityContainer = document.getElementById("task-details-activity")
      const activityElement = document.createElement("div")
      activityElement.classList.add("activity-item")

      const now = new Date()
      const formattedDate =
        now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-flag"></i>
                </div>
                <div class="activity-content">
                    Current User changed priority from "${oldPriority}" to "${newPriority}"
                    <div class="activity-time">${formattedDate}</div>
                </div>
            `

      activityContainer.prepend(activityElement)

      // Refresh views
      renderTaskList()
      renderKanbanBoard()
    }
  })

  // Due date change in task details
  document.getElementById("task-details-due-date").addEventListener("change", function () {
    const newDueDate = this.value
    const taskId = Number.parseInt(document.querySelector(".task-item[data-task-id]").getAttribute("data-task-id"))

    // Update task due date
    const task = sampleTasks.find((t) => t.id === taskId)
    if (task) {
      const oldDueDate = task.dueDate || "No date"
      task.dueDate = newDueDate

      // Add activity
      task.activity.push({
        type: "due_date_change",
        user: "Current User",
        from: oldDueDate,
        to: newDueDate || "No date",
        timestamp: new Date().toISOString(),
      })

      // Update activity log
      const activityContainer = document.getElementById("task-details-activity")
      const activityElement = document.createElement("div")
      activityElement.classList.add("activity-item")

      const now = new Date()
      const formattedDate =
        now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="activity-content">
                    Current User changed due date from "${oldDueDate}" to "${newDueDate || "No date"}"
                    <div class="activity-time">${formattedDate}</div>
                </div>
            `

      activityContainer.prepend(activityElement)

      // Refresh views
      renderTaskList()
      renderKanbanBoard()
      renderCalendar()
      renderGanttChart()
    }
  })
})
