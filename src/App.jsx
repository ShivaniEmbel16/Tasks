import { Navigate, Route, Routes } from 'react-router-dom'
import TaskRoute from './TaskRoute'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/task/1" replace />} />
      <Route path="/task/:taskId" element={<TaskRoute />} />
      <Route path="*" element={<Navigate to="/task/1" replace />} />
    </Routes>
  )
}

export default App
