// Sample Categories Data (in a real app, this would come from an API)
const sampleCategories = [
  { id: 1, name: "Work", description: "Work-related tasks and projects" },
  { id: 2, name: "Personal", description: "Personal tasks and errands" },
  { id: 3, name: "School", description: "All school configuration starts from here" },
  { id: 4, name: "Health", description: "Health and fitness related tasks" },
  { id: 5, name: "Finance", description: "Financial tasks and goals" },
]

export function generateStaticParams() {
  return sampleCategories.map((category) => ({
    id: category.id.toString(),
  }))
}

export { sampleCategories } 