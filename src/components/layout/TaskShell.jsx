import { Link } from "react-router-dom";

export default function TaskShell({ task, tasks, children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>

        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id}>
              <Link
                to={`/task/${t.id}`}
                className={`block px-3 py-2 rounded-lg ${
                  task.id === t.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {children}
        </div>
      </main>
    </div>
  );
}



// ✅ 4. TaskShell.jsx — Page Layout + Sidebar Navigation
// <aside> ... tasks list … </aside>

// ✔ Sidebar

// Shows all tasks from the tasks array

// Highlights the selected one

// Clicking a task changes the URL → /task/3

// ✔ Main Content Area
// <main>
//   <h1>{task.title}</h1>
//   <div>{children}</div>   // children = actual task component like <Task1/>
// </main>


// So TaskShell provides:

// Left Menu (links)

// Right Side (task content)