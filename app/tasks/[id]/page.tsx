import { sampleTasks } from "./data"
import { TaskDetail } from "./task-detail"

export function generateStaticParams() {
  return sampleTasks.map((task) => ({
    id: task.id.toString(),
  }))
}

export default function Page({ params }: { params: { id: string } }) {
  return <TaskDetail params={params} />
}
