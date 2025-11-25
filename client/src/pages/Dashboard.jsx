import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5700/api/tasks';

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setEditingTask(null);
    setError('');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    try {
      if (editingTask) {
        await axios.put(
          `${API_URL}/${editingTask._id}`,
          { title, description },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        await axios.post(
          API_URL,
          { title, description },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }
      fetchTasks();
      clearForm();
    } catch (err) {
      setError('Failed to save the task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to delete the task.');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCompletion = async (task) => {
    try {
      await axios.put(
        `${API_URL}/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchTasks();
    } catch (err) {
      setError('Failed to update the task status.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingTask ? 'Edit Task' : 'Add a New Task'}
          </h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            {error && (
              <p className="text-red-500 font-semibold bg-red-900/50 p-3 rounded-lg">
                {error}
              </p>
            )}
            <input
              type="text"
              placeholder="What's the task title?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition"
            />
            <textarea
              placeholder="Add a description... (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition"
              rows="3"
            />
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
              {editingTask && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full py-3 font-bold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              You have no tasks yet. Add one above!
            </p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${
                    task.completed
                      ? 'bg-gray-800/50'
                      : 'bg-gray-800 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompletion(task)}
                      className="h-6 w-6 rounded-full bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500/50"
                    />
                    <div className="ml-4">
                      <span
                        className={`font-bold ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="text-sm text-gray-400">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
