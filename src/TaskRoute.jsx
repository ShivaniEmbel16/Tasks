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


// ✅ 3. TaskRoute.jsx — Loads the Correct Task Component
// const { taskId } = useParams()
// const numericId = Number(taskId)
// const task = tasks.find((entry) => entry.id === numericId) ?? tasks[0]
// const TaskComponent = task.component

// ✔ Explanation:

// Reads the taskId from URL (like "1" or "2")

// Converts it to a number

// Searches inside tasks list

// Finds the task object
// Example:

// { id: 2, title: "Dropdown", component: Task2 }


// Picks the correct React component → Task2

// Then it renders:

// <TaskShell task={task} tasks={tasks}>
//   <TaskComponent />
// </TaskShell>

// ✔ Meaning:

// Wraps task inside layout + sidebar (TaskShell)

// Shows the actual task UI inside that layout
