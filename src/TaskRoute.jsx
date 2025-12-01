import { useParams } from 'react-router-dom'
import TaskShell from './components/layout/TaskShell'
import { tasks } from './data/task'

const TaskRoute = () => {
  const { taskId } = useParams()
  const numericId = Number(taskId)
  const task = tasks.find((entry) => entry.id === numericId) ?? tasks[0]
  const TaskComponent = task.component

  return (
    <TaskShell task={task} tasks={tasks}>
      <TaskComponent />
    </TaskShell>
  )
}

export default TaskRoute
