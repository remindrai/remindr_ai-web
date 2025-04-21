// Sample task data
const sampleTasks = [
  {
    id: 1,
    title: "Redesign homepage",
    description: "<p>Create a new design for the homepage with improved user experience and modern aesthetics.</p>",
    status: "in-progress",
    priority: "high",
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "assets/user-avatar.jpg",
    },
    dueDate: "2025-05-15",
    tags: ["Design", "UI/UX"],
    attachments: [
      { name: "design-mockup.png", type: "image" },
      { name: "requirements.pdf", type: "pdf" },
    ],
    subtasks: [
      { id: 1, text: "Create wireframes", completed: true },
      { id: 2, text: "Design hero section", completed: true },
      { id: 3, text: "Design product showcase", completed: false },
      { id: 4, text: "Mobile responsive design", completed: false },
    ],
    customFields: [
      { name: "Estimated Hours", type: "number", value: 24 },
      { name: "Design Tool", type: "text", value: "Figma" },
    ],
    comments: [
      {
        id: 1,
        author: { id: 2, name: "Jane Smith", avatar: "assets/avatar-2.jpg" },
        text: "I think we should use a darker color palette for the hero section.",
        timestamp: "2025-04-18T14:30:00",
        mentions: [],
      },
      {
        id: 2,
        author: { id: 1, name: "John Doe", avatar: "assets/user-avatar.jpg" },
        text: "Good point, I'll update the design tomorrow.",
        timestamp: "2025-04-18T15:45:00",
        mentions: [2],
      },
    ],
    activity: [
      { type: "created", user: "John Doe", timestamp: "2025-04-15T09:00:00" },
      { type: "status_change", user: "John Doe", from: "todo", to: "in-progress", timestamp: "2025-04-16T10:30:00" },
      { type: "subtask_completed", user: "John Doe", subtask: "Create wireframes", timestamp: "2025-04-17T11:15:00" },
    ],
    createdAt: "2025-04-15T09:00:00",
    updatedAt: "2025-04-18T15:45:00",
  },
  {
    id: 2,
    title: "Implement authentication system",
    description: "<p>Set up user authentication with login, registration, and password reset functionality.</p>",
    status: "todo",
    priority: "high",
    assignee: {
      id: 3,
      name: "Mike Johnson",
      avatar: "assets/avatar-3.jpg",
    },
    dueDate: "2025-05-10",
    tags: ["Backend", "Security"],
    attachments: [],
    subtasks: [
      { id: 5, text: "Set up user model", completed: false },
      { id: 6, text: "Implement login API", completed: false },
      { id: 7, text: "Implement registration API", completed: false },
      { id: 8, text: "Add password reset functionality", completed: false },
    ],
    customFields: [{ name: "Estimated Hours", type: "number", value: 16 }],
    comments: [],
    activity: [
      { type: "created", user: "Jane Smith", timestamp: "2025-04-17T14:00:00" },
      { type: "assignee_change", user: "Jane Smith", from: null, to: "Mike Johnson", timestamp: "2025-04-17T14:05:00" },
    ],
    createdAt: "2025-04-17T14:00:00",
    updatedAt: "2025-04-17T14:05:00",
  },
  {
    id: 3,
    title: "Create API documentation",
    description: "<p>Document all API endpoints with examples and response schemas.</p>",
    status: "review",
    priority: "medium",
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "assets/avatar-2.jpg",
    },
    dueDate: "2025-04-30",
    tags: ["Documentation", "API"],
    attachments: [{ name: "api-spec.md", type: "file" }],
    subtasks: [
      { id: 9, text: "Document authentication endpoints", completed: true },
      { id: 10, text: "Document user endpoints", completed: true },
      { id: 11, text: "Document product endpoints", completed: true },
      { id: 12, text: "Add request/response examples", completed: false },
    ],
    customFields: [],
    comments: [
      {
        id: 3,
        author: { id: 3, name: "Mike Johnson", avatar: "assets/avatar-3.jpg" },
        text: "Could you add more examples for the product creation endpoint?",
        timestamp: "2025-04-19T11:20:00",
        mentions: [],
      },
    ],
    activity: [
      { type: "created", user: "Jane Smith", timestamp: "2025-04-16T10:00:00" },
      { type: "status_change", user: "Jane Smith", from: "todo", to: "in-progress", timestamp: "2025-04-16T10:05:00" },
      {
        type: "status_change",
        user: "Jane Smith",
        from: "in-progress",
        to: "review",
        timestamp: "2025-04-19T09:30:00",
      },
    ],
    createdAt: "2025-04-16T10:00:00",
    updatedAt: "2025-04-19T11:20:00",
  },
  {
    id: 4,
    title: "Fix payment processing bug",
    description: "<p>Investigate and fix the issue with payment processing on the checkout page.</p>",
    status: "done",
    priority: "high",
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "assets/user-avatar.jpg",
    },
    dueDate: "2025-04-20",
    tags: ["Bug", "Critical"],
    attachments: [
      { name: "error-log.txt", type: "file" },
      { name: "bugfix.patch", type: "file" },
    ],
    subtasks: [
      { id: 13, text: "Reproduce the issue", completed: true },
      { id: 14, text: "Identify root cause", completed: true },
      { id: 15, text: "Implement fix", completed: true },
      { id: 16, text: "Test fix", completed: true },
    ],
    customFields: [
      { name: "Bug ID", type: "text", value: "BUG-1234" },
      { name: "Affected Systems", type: "text", value: "Checkout, Payment" },
    ],
    comments: [
      {
        id: 4,
        author: { id: 1, name: "John Doe", avatar: "assets/user-avatar.jpg" },
        text: "The issue was caused by an incorrect API key in the production environment.",
        timestamp: "2025-04-18T16:30:00",
        mentions: [],
      },
      {
        id: 5,
        author: { id: 2, name: "Jane Smith", avatar: "assets/avatar-2.jpg" },
        text: "Great job fixing this so quickly!",
        timestamp: "2025-04-18T17:00:00",
        mentions: [1],
      },
    ],
    activity: [
      { type: "created", user: "Mike Johnson", timestamp: "2025-04-17T09:00:00" },
      { type: "priority_change", user: "Mike Johnson", from: "medium", to: "high", timestamp: "2025-04-17T09:05:00" },
      { type: "assignee_change", user: "Mike Johnson", from: null, to: "John Doe", timestamp: "2025-04-17T09:10:00" },
      { type: "status_change", user: "John Doe", from: "todo", to: "in-progress", timestamp: "2025-04-17T10:00:00" },
      { type: "status_change", user: "John Doe", from: "in-progress", to: "done", timestamp: "2025-04-18T16:00:00" },
    ],
    createdAt: "2025-04-17T09:00:00",
    updatedAt: "2025-04-18T17:00:00",
  },
  {
    id: 5,
    title: "Optimize database queries",
    description: "<p>Improve performance by optimizing slow database queries.</p>",
    status: "in-progress",
    priority: "medium",
    assignee: {
      id: 3,
      name: "Mike Johnson",
      avatar: "assets/avatar-3.jpg",
    },
    dueDate: "2025-05-05",
    tags: ["Performance", "Database"],
    attachments: [],
    subtasks: [
      { id: 17, text: "Identify slow queries", completed: true },
      { id: 18, text: "Add indexes", completed: false },
      { id: 19, text: "Rewrite complex queries", completed: false },
      { id: 20, text: "Benchmark improvements", completed: false },
    ],
    customFields: [{ name: "Estimated Performance Gain", type: "text", value: "30-40%" }],
    comments: [],
    activity: [
      { type: "created", user: "Mike Johnson", timestamp: "2025-04-18T13:00:00" },
      {
        type: "status_change",
        user: "Mike Johnson",
        from: "todo",
        to: "in-progress",
        timestamp: "2025-04-18T13:30:00",
      },
    ],
    createdAt: "2025-04-18T13:00:00",
    updatedAt: "2025-04-18T13:30:00",
  },
]

// Initialize task data
function initializeTaskData() {
  // Populate task list
  renderTaskList()

  // Populate kanban board
  renderKanbanBoard()

  // Populate calendar
  renderCalendar()

  // Populate Gantt chart
  renderGanttChart()

  // Add event listeners for task interactions
  setupTaskInteractions()
}

// Render task list
function renderTaskList() {
  const taskListElement = document.getElementById("task-list")
  taskListElement.innerHTML = ""

  sampleTasks.forEach((task) => {
    const taskElement = document.createElement("div")
    taskElement.classList.add("task-item")
    taskElement.setAttribute("data-task-id", task.id)

    // Format due date
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"

    // Determine status class
    const statusClass = `status-${task.status.replace(/\s+/g, "-")}`

    // Determine priority class
    const priorityClass = `priority-${task.priority}`

    // Create task HTML
    taskElement.innerHTML = `
            <div class="task-column task-checkbox">
                <input type="checkbox" ${task.status === "done" ? "checked" : ""}>
            </div>
            <div class="task-column task-name">${task.title}</div>
            <div class="task-column task-status">
                <span class="task-status-badge ${statusClass}">
                    ${task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                </span>
            </div>
            <div class="task-column task-priority">
                <i class="fas fa-flag ${priorityClass}"></i>
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
            <div class="task-column task-assignee">
                ${
                  task.assignee
                    ? `
                    <div class="task-assignee-info">
                        <img src="${task.assignee.avatar}" alt="${task.assignee.name}" class="avatar avatar-sm">
                        <span>${task.assignee.name}</span>
                    </div>
                `
                    : "Unassigned"
                }
            </div>
            <div class="task-column task-due-date">${dueDate}</div>
            <div class="task-column task-actions">
                <button class="task-action-btn view-task-btn" title="View Task">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="task-action-btn edit-task-btn" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `

    taskListElement.appendChild(taskElement)
  })
}

// Render kanban board
function renderKanbanBoard() {
  const kanbanBoardElement = document.getElementById("kanban-board")
  kanbanBoardElement.innerHTML = ""

  // Define columns
  const columns = [
    { id: "todo", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "review", name: "Review" },
    { id: "done", name: "Done" },
  ]

  // Create columns
  columns.forEach((column) => {
    const columnTasks = sampleTasks.filter((task) => task.status === column.id)

    const columnElement = document.createElement("div")
    columnElement.classList.add("kanban-column")
    columnElement.setAttribute("data-column-id", column.id)

    columnElement.innerHTML = `
            <div class="kanban-column-header">
                <span>${column.name}</span>
                <span class="kanban-column-count">${columnTasks.length}</span>
            </div>
            <div class="kanban-cards" id="kanban-${column.id}"></div>
        `

    kanbanBoardElement.appendChild(columnElement)

    // Add tasks to column
    const cardsContainer = columnElement.querySelector(`.kanban-cards`)

    columnTasks.forEach((task) => {
      const cardElement = document.createElement("div")
      cardElement.classList.add("kanban-card")
      cardElement.setAttribute("data-task-id", task.id)

      // Format due date
      const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"

      // Determine priority class
      const priorityClass = `priority-${task.priority}`

      // Create card HTML
      cardElement.innerHTML = `
                <div class="kanban-card-title">${task.title}</div>
                <div class="kanban-card-meta">
                    ${
                      task.subtasks.length > 0
                        ? `
                        <div class="kanban-card-subtasks">
                            <i class="fas fa-tasks"></i>
                            ${task.subtasks.filter((st) => st.completed).length}/${task.subtasks.length}
                        </div>
                    `
                        : ""
                    }
                    ${
                      task.dueDate
                        ? `
                        <div class="kanban-card-due-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${dueDate}
                        </div>
                    `
                        : ""
                    }
                </div>
                <div class="kanban-card-footer">
                    <div class="kanban-card-tags">
                        ${task.tags
                          .slice(0, 2)
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                        ${task.tags.length > 2 ? `<span class="tag">+${task.tags.length - 2}</span>` : ""}
                    </div>
                    <div class="kanban-card-assignee">
                        ${
                          task.assignee
                            ? `
                            <img src="${task.assignee.avatar}" alt="${task.assignee.name}" class="avatar avatar-sm" title="${task.assignee.name}">
                        `
                            : ""
                        }
                    </div>
                </div>
            `

      cardsContainer.appendChild(cardElement)
    })
  })
}

// Render calendar
function renderCalendar() {
  const calendarGridElement = document.getElementById("calendar-grid")
  calendarGridElement.innerHTML = ""

  // Get current date
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get previous month's days to display
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  // Create calendar days
  let dayCount = 1
  let nextMonthDay = 1

  // Create 6 rows (max possible for a month)
  for (let i = 0; i < 42; i++) {
    const dayElement = document.createElement("div")
    dayElement.classList.add("calendar-day")

    // Previous month days
    if (i < firstDay) {
      dayElement.classList.add("other-month")
      const prevMonthDate = daysInPrevMonth - (firstDay - i - 1)
      dayElement.innerHTML = `
                <div class="calendar-day-header">
                    <span class="calendar-day-number">${prevMonthDate}</span>
                </div>
                <div class="calendar-events"></div>
            `
    }
    // Current month days
    else if (dayCount <= daysInMonth) {
      // Check if it's today
      if (
        dayCount === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear()
      ) {
        dayElement.classList.add("today")
      }

      dayElement.innerHTML = `
                <div class="calendar-day-header">
                    <span class="calendar-day-number">${dayCount}</span>
                </div>
                <div class="calendar-events"></div>
            `

      // Add tasks for this day
      const dayDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayCount).padStart(2, "0")}`
      const dayTasks = sampleTasks.filter((task) => task.dueDate === dayDate)

      const eventsContainer = dayElement.querySelector(".calendar-events")

      dayTasks.forEach((task) => {
        // Determine priority class
        const priorityClass = `priority-${task.priority}`

        const eventElement = document.createElement("div")
        eventElement.classList.add("calendar-event")
        eventElement.classList.add(priorityClass)
        eventElement.setAttribute("data-task-id", task.id)
        eventElement.textContent = task.title

        eventsContainer.appendChild(eventElement)
      })

      dayCount++
    }
    // Next month days
    else {
      dayElement.classList.add("other-month")
      dayElement.innerHTML = `
                <div class="calendar-day-header">
                    <span class="calendar-day-number">${nextMonthDay}</span>
                </div>
                <div class="calendar-events"></div>
            `
      nextMonthDay++
    }

    calendarGridElement.appendChild(dayElement)

    // Stop after 6 weeks
    if (i === 41) break
  }
}

// Render Gantt chart
function renderGanttChart() {
  const ganttBodyElement = document.getElementById("gantt-body")
  const ganttTimelineElement = document.querySelector(".gantt-timeline")

  // Clear previous content
  ganttBodyElement.innerHTML = ""
  ganttTimelineElement.innerHTML = ""

  // Get date range for the chart (2 weeks)
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 13) // 2 weeks

  // Create timeline headers
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayElement = document.createElement("div")
    dayElement.classList.add("gantt-day")
    dayElement.textContent = d.getDate()
    ganttTimelineElement.appendChild(dayElement)
  }

  // Create task rows
  sampleTasks.forEach((task) => {
    const rowElement = document.createElement("div")
    rowElement.classList.add("gantt-row")

    // Task info
    rowElement.innerHTML = `
            <div class="gantt-row-info">
                <span>${task.title}</span>
            </div>
            <div class="gantt-row-timeline"></div>
        `

    ganttBodyElement.appendChild(rowElement)

    // Add task bar if due date exists
    if (task.dueDate) {
      const timelineElement = rowElement.querySelector(".gantt-row-timeline")
      const taskDueDate = new Date(task.dueDate)

      // Only show if due date is within our range
      if (taskDueDate >= startDate && taskDueDate <= endDate) {
        // Calculate position (days from start)
        const daysFromStart = Math.floor((taskDueDate - startDate) / (1000 * 60 * 60 * 24))
        const taskStartDay = Math.max(0, daysFromStart - 3) // Assume task takes ~3 days

        const taskBarElement = document.createElement("div")
        taskBarElement.classList.add("gantt-task-bar")
        taskBarElement.setAttribute("data-task-id", task.id)
        taskBarElement.style.left = `${taskStartDay * 40}px` // 40px per day
        taskBarElement.style.width = `${Math.min(3, daysFromStart) * 40}px` // Max 3 days or until due date

        taskBarElement.textContent = task.title

        timelineElement.appendChild(taskBarElement)
      }
    }
  })
}

// Setup task interactions
function setupTaskInteractions() {
  // View task details
  document.addEventListener("click", (e) => {
    const viewTaskBtn = e.target.closest(".view-task-btn")
    if (viewTaskBtn) {
      const taskItem = viewTaskBtn.closest("[data-task-id]")
      const taskId = Number.parseInt(taskItem.getAttribute("data-task-id"))
      openTaskDetails(taskId)
    }

    const kanbanCard = e.target.closest(".kanban-card")
    if (kanbanCard) {
      const taskId = Number.parseInt(kanbanCard.getAttribute("data-task-id"))
      openTaskDetails(taskId)
    }

    const calendarEvent = e.target.closest(".calendar-event")
    if (calendarEvent) {
      const taskId = Number.parseInt(calendarEvent.getAttribute("data-task-id"))
      openTaskDetails(taskId)
    }

    const ganttTaskBar = e.target.closest(".gantt-task-bar")
    if (ganttTaskBar) {
      const taskId = Number.parseInt(ganttTaskBar.getAttribute("data-task-id"))
      openTaskDetails(taskId)
    }
  })

  // Edit task
  document.addEventListener("click", (e) => {
    const editTaskBtn = e.target.closest(".edit-task-btn")
    if (editTaskBtn) {
      const taskItem = editTaskBtn.closest("[data-task-id]")
      const taskId = Number.parseInt(taskItem.getAttribute("data-task-id"))
      openTaskEdit(taskId)
    }
  })
}

// Open task details modal
function openTaskDetails(taskId) {
  const task = sampleTasks.find((t) => t.id === taskId)
  if (!task) return

  // Set task details
  document.getElementById("task-details-title").textContent = task.title
  document.getElementById("task-details-description").innerHTML = task.description

  // Set status
  const statusSelect = document.getElementById("task-details-status")
  statusSelect.value = task.status

  // Set assignee
  const assigneeSelect = document.getElementById("task-details-assignee")
  assigneeSelect.value = task.assignee ? task.assignee.id : ""

  // Set due date
  const dueDateInput = document.getElementById("task-details-due-date")
  dueDateInput.value = task.dueDate || ""

  // Set priority
  const prioritySelect = document.getElementById("task-details-priority")
  prioritySelect.value = task.priority

  // Set tags
  const tagsContainer = document.getElementById("task-details-tags")
  tagsContainer.innerHTML = ""
  task.tags.forEach((tag) => {
    const tagElement = document.createElement("span")
    tagElement.classList.add("tag")
    tagElement.textContent = tag
    tagsContainer.appendChild(tagElement)
  })

  // Set subtasks
  const subtasksContainer = document.getElementById("task-details-subtasks")
  subtasksContainer.innerHTML = ""
  task.subtasks.forEach((subtask) => {
    const subtaskElement = document.createElement("div")
    subtaskElement.classList.add("task-details-subtask")
    subtaskElement.innerHTML = `
            <input type="checkbox" ${subtask.completed ? "checked" : ""} disabled>
            <span>${subtask.text}</span>
        `
    subtasksContainer.appendChild(subtaskElement)
  })

  // Set attachments
  const attachmentsContainer = document.getElementById("task-details-attachments")
  attachmentsContainer.innerHTML = ""
  if (task.attachments.length === 0) {
    attachmentsContainer.innerHTML = "<p>No attachments</p>"
  } else {
    task.attachments.forEach((attachment) => {
      const attachmentElement = document.createElement("div")
      attachmentElement.classList.add("task-details-attachment")

      // Determine icon based on file type
      let icon = "file"
      if (attachment.type === "image") icon = "image"
      else if (attachment.type === "video") icon = "video"
      else if (attachment.type === "pdf") icon = "file-pdf"

      attachmentElement.innerHTML = `
                <i class="fas fa-${icon}"></i>
                <span>${attachment.name}</span>
            `
      attachmentsContainer.appendChild(attachmentElement)
    })
  }

  // Set custom fields
  const customFieldsContainer = document.getElementById("task-details-custom-fields")
  customFieldsContainer.innerHTML = ""
  if (task.customFields.length === 0) {
    customFieldsContainer.innerHTML = "<p>No custom fields</p>"
  } else {
    task.customFields.forEach((field) => {
      const fieldElement = document.createElement("div")
      fieldElement.classList.add("custom-field-item")
      fieldElement.innerHTML = `
                <div class="custom-field-label">${field.name}</div>
                <div class="custom-field-value">${field.value}</div>
            `
      customFieldsContainer.appendChild(fieldElement)
    })
  }

  // Set comments
  const commentsContainer = document.getElementById("comments-list")
  commentsContainer.innerHTML = ""
  if (task.comments.length === 0) {
    commentsContainer.innerHTML = "<p>No comments yet</p>"
  } else {
    task.comments.forEach((comment) => {
      const commentElement = document.createElement("div")
      commentElement.classList.add("comment-item")

      // Format timestamp
      const commentDate = new Date(comment.timestamp)
      const formattedDate =
        commentDate.toLocaleDateString() +
        " " +
        commentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      commentElement.innerHTML = `
                <img src="${comment.author.avatar}" alt="${comment.author.name}" class="avatar avatar-sm">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author.name}</span>
                        <span class="comment-time">${formattedDate}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `
      commentsContainer.appendChild(commentElement)
    })
  }

  // Set activity
  const activityContainer = document.getElementById("task-details-activity")
  activityContainer.innerHTML = ""
  task.activity.forEach((activity) => {
    const activityElement = document.createElement("div")
    activityElement.classList.add("activity-item")

    // Format timestamp
    const activityDate = new Date(activity.timestamp)
    const formattedDate =
      activityDate.toLocaleDateString() +
      " " +
      activityDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Determine icon and message based on activity type
    let icon = "info-circle"
    let message = ""

    switch (activity.type) {
      case "created":
        icon = "plus-circle"
        message = `${activity.user} created this task`
        break
      case "status_change":
        icon = "exchange-alt"
        message = `${activity.user} changed status from "${activity.from}" to "${activity.to}"`
        break
      case "priority_change":
        icon = "flag"
        message = `${activity.user} changed priority from "${activity.from}" to "${activity.to}"`
        break
      case "assignee_change":
        icon = "user"
        message = `${activity.user} assigned to ${activity.to || "no one"}`
        break
      case "subtask_completed":
        icon = "check"
        message = `${activity.user} completed subtask "${activity.subtask}"`
        break
      default:
        message = `${activity.user} updated the task`
    }

    activityElement.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="activity-content">
                ${message}
                <div class="activity-time">${formattedDate}</div>
            </div>
        `
    activityContainer.appendChild(activityElement)
  })

  // Open the modal
  const modal = document.getElementById("task-details-modal")
  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

// Open task edit modal
let Quill // Declare Quill here

function openTaskEdit(taskId) {
  const task = sampleTasks.find((t) => t.id === taskId)
  if (!task) return

  // Set modal title
  document.getElementById("modal-title").textContent = "Edit Task"

  // Set form values
  document.getElementById("task-title").value = task.title

  // Set rich text editor content
  const quill = Quill.find(document.getElementById("rich-text-editor"))
  quill.root.innerHTML = task.description

  // Set status
  document.getElementById("task-status").value = task.status

  // Set priority
  document.getElementById("task-priority").value = task.priority

  // Set assignee
  document.getElementById("task-assignee").value = task.assignee ? task.assignee.id : ""

  // Set due date
  document.getElementById("task-due-date").value = task.dueDate || ""

  // Set tags
  const tagsContainer = document.getElementById("tags-container")
  tagsContainer.innerHTML = ""
  task.tags.forEach((tag) => {
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

  // Set attachments
  const attachmentsPreview = document.getElementById("attachments-preview")
  attachmentsPreview.innerHTML = ""
  task.attachments.forEach((attachment) => {
    const attachmentElement = document.createElement("div")
    attachmentElement.classList.add("attachment-item")

    // Determine icon based on file type
    let icon = "file"
    if (attachment.type === "image") icon = "image"
    else if (attachment.type === "video") icon = "video"
    else if (attachment.type === "pdf") icon = "file-pdf"

    attachmentElement.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${attachment.name}</span>
            <button type="button" class="attachment-remove">
                <i class="fas fa-times"></i>
            </button>
        `

    attachmentsPreview.appendChild(attachmentElement)

    // Add event listener to remove attachment
    attachmentElement.querySelector(".attachment-remove").addEventListener("click", () => {
      attachmentsPreview.removeChild(attachmentElement)
    })
  })

  // Set subtasks
  const subtaskList = document.getElementById("subtask-list")
  subtaskList.innerHTML = ""
  task.subtasks.forEach((subtask) => {
    const subtaskElement = document.createElement("div")
    subtaskElement.classList.add("subtask-item")
    subtaskElement.innerHTML = `
            <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? "checked" : ""}>
            <span class="subtask-text">${subtask.text}</span>
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
  task.customFields.forEach((field) => {
    const fieldElement = document.createElement("div")
    fieldElement.classList.add("form-group")

    let fieldHtml = `<label for="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}">${field.name}</label>`

    switch (field.type) {
      case "text":
        fieldHtml += `<input type="text" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}" value="${field.value}">`
        break
      case "number":
        fieldHtml += `<input type="number" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}" value="${field.value}">`
        break
      case "date":
        fieldHtml += `<input type="date" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}" value="${field.value}">`
        break
      case "checkbox":
        fieldHtml += `<div class="checkbox-group"><label><input type="checkbox" id="custom-${field.name.toLowerCase().replace(/\s+/g, "-")}" ${field.value ? "checked" : ""}> ${field.name}</label></div>`
        break
    }

    fieldElement.innerHTML = fieldHtml
    customFieldsContainer.appendChild(fieldElement)
  })

  // Open the modal
  const modal = document.getElementById("task-modal")
  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}
