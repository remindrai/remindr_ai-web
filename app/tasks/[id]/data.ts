// Sample Tasks Data (in a real app, this would come from an API)
export const sampleTasks = [
  {
    id: 1,
    name: "Complete Project Proposal",
    description: "Draft and finalize the project proposal for the new client initiative. Include timeline, resource requirements, and budget estimates.",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-04-15",
    assignee: {
      id: 1,
      name: "John Doe"
    },
    tags: ["proposal", "client", "planning"]
  },
  {
    id: 2,
    name: "Review Q1 Reports",
    description: "Analyze and review Q1 performance reports. Prepare summary of key findings and recommendations for the management team.",
    status: "todo",
    priority: "medium",
    dueDate: "2024-04-10",
    assignee: {
      id: 2,
      name: "Jane Smith"
    },
    tags: ["reports", "quarterly", "analysis"]
  },
  {
    id: 3,
    name: "Team Training Session",
    description: "Organize and conduct training session on new project management tools for the development team.",
    status: "done",
    priority: "low",
    dueDate: "2024-03-30",
    assignee: {
      id: 3,
      name: "Mike Johnson"
    },
    tags: ["training", "team", "development"]
  }
] 