import React, { useState, useEffect } from 'react';

function App() {
  // State hooks
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedTime: 1
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedTime: 1
  });
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState('dueDate');
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle input changes for add form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle input changes for edit form
  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  // Handle form submission for adding task
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;
    setTasks([
      ...tasks,
      {
        ...form,
        id: Date.now(),
        done: false
      }
    ]);
    setForm({
      title: '',
      description: '',
      dueDate: '',
      estimatedTime: 1
    });
  }

  // Start editing a task
  function startEdit(task) {
    setEditTaskId(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      estimatedTime: task.estimatedTime
    });
  }

  // Cancel editing
  function cancelEdit() {
    setEditTaskId(null);
  }

  // Save edited task
  function saveEdit(e) {
    e.preventDefault();
    setTasks(tasks.map(task =>
      task.id === editTaskId ? { ...task, ...editForm } : task
    ));
    setEditTaskId(null);
  }

  // Delete a task
  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  // Toggle done status
  function markDone(id) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  }

  // Calculate progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.done).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Filter and sort tasks
  function filteredTasks() {
    let filtered = [...tasks];
    if (filter === 'done') {
      filtered = filtered.filter(task => task.done);
    } else if (filter === 'notdone') {
      filtered = filtered.filter(task => !task.done);
    }
    // Sort tasks
    if (sortKey === 'dueDate') {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortKey === 'estimatedTime') {
      filtered.sort((a, b) => a.estimatedTime - b.estimatedTime);
    } else if (sortKey === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    return filtered;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        padding: '2rem 0'
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: '2rem auto',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(60, 100, 180, 0.10)',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <h1
          style={{
            color: '#2196f3',
            letterSpacing: 1,
            fontWeight: 800,
            fontSize: 36,
            marginBottom: 16,
            textAlign: 'center',
            textShadow: '0 2px 8px #bcd0ee'
          }}
        >
          Smart Study Planner
        </h1>

        {/* Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 4, fontWeight: 600, color: '#333' }}>
            <strong>{completedTasks}</strong> of <strong>{totalTasks}</strong> tasks completed
          </div>
          <div style={{
            background: '#f0f4fa',
            borderRadius: 12,
            height: 24,
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px #dde'
          }}>
            <div style={{
              width: `${progress}%`,
              background: progress === 100
                ? 'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)'
                : 'linear-gradient(90deg,#2196f3 0%,#21cbf3 100%)',
              height: '100%',
              borderRadius: 12,
              transition: 'width 0.4s'
            }} />
          </div>
          <div style={{ textAlign: 'right', fontSize: 14, color: '#555', marginTop: 2 }}>
            {progress}% complete
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              border: '1px solid #bcd0ee',
              borderRadius: 8,
              padding: '8px',
              flex: '1 1 140px',
              fontSize: 15,
              background: '#f7faff'
            }}
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={{
              border: '1px solid #bcd0ee',
              borderRadius: 8,
              padding: '8px',
              flex: '2 1 220px',
              fontSize: 15,
              background: '#f7faff'
            }}
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            style={{
              border: '1px solid #bcd0ee',
              borderRadius: 8,
              padding: '8px',
              flex: '1 1 120px',
              fontSize: 15,
              background: '#f7faff'
            }}
          />
          <input
            type="number"
            name="estimatedTime"
            value={form.estimatedTime}
            min="1"
            onChange={handleChange}
            style={{
              border: '1px solid #bcd0ee',
              borderRadius: 8,
              padding: '8px',
              width: 80,
              fontSize: 15,
              background: '#f7faff'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg,#2196f3 0%,#21cbf3 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(33,150,243,0.10)'
            }}
          >
            Add Task
          </button>
        </form>

        {/* Filter and Sort Controls */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 24 }}>
          <label>
            Filter: 
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{
              marginLeft: 8,
              marginRight: 20,
              borderRadius: 8,
              padding: '6px 10px',
              border: '1px solid #bcd0ee',
              background: '#f7faff'
            }}>
              <option value="all">All</option>
              <option value="done">Completed</option>
              <option value="notdone">Incomplete</option>
            </select>
          </label>

          <label>
            Sort by: 
            <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={{
              marginLeft: 8,
              borderRadius: 8,
              padding: '6px 10px',
              border: '1px solid #bcd0ee',
              background: '#f7faff'
            }}>
              <option value="dueDate">Due Date</option>
              <option value="estimatedTime">Estimated Time</option>
              <option value="title">Title</option>
            </select>
          </label>
        </div>

        {/* Task List */}
        <h2 style={{ color: '#2196f3', marginTop: 24, marginBottom: 12, fontWeight: 700 }}>My Tasks</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTasks().length === 0 && (
            <li style={{ color: '#888', fontStyle: 'italic' }}>No tasks to show.</li>
          )}
          {filteredTasks().map(task => {
            // Overdue logic
            const today = new Date();
            today.setHours(0,0,0,0);
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0,0,0,0);
            const isOverdue = !task.done && dueDate < today;

            return (
              <li
                key={task.id}
                style={{
                  marginBottom: 16,
                  padding: 18,
                  border: isOverdue ? '2px solid #ff4d4f' : '1px solid #e3e7f7',
                  background: isOverdue
                    ? 'linear-gradient(90deg,#ffeaea 0%,#fff5f5 100%)'
                    : task.done
                      ? 'linear-gradient(90deg,#e0ffe0 0%,#f7fff7 100%)'
                      : 'linear-gradient(90deg,#f7faff 0%,#eaf1fb 100%)',
                  borderRadius: 12,
                  boxShadow: hoveredTaskId === task.id
                    ? '0 4px 16px rgba(33,150,243,0.12)'
                    : '0 1px 6px rgba(33,150,243,0.07)',
                  transition: 'box-shadow 0.2s, background 0.2s, border 0.2s'
                }}
                onMouseOver={() => setHoveredTaskId(task.id)}
                onMouseOut={() => setHoveredTaskId(null)}
              >
                {editTaskId === task.id ? (
                  <form onSubmit={saveEdit} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                      style={{
                        border: '1px solid #bcd0ee',
                        borderRadius: 8,
                        padding: '8px',
                        flex: '1 1 120px',
                        fontSize: 15,
                        background: '#f7faff'
                      }}
                    />
                    <input
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      style={{
                        border: '1px solid #bcd0ee',
                        borderRadius: 8,
                        padding: '8px',
                        flex: '2 1 200px',
                        fontSize: 15,
                        background: '#f7faff'
                      }}
                    />
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                      required
                      style={{
                        border: '1px solid #bcd0ee',
                        borderRadius: 8,
                        padding: '8px',
                        flex: '1 1 100px',
                        fontSize: 15,
                        background: '#f7faff'
                      }}
                    />
                    <input
                      type="number"
                      name="estimatedTime"
                      value={editForm.estimatedTime}
                      min="1"
                      onChange={handleEditChange}
                      style={{
                        border: '1px solid #bcd0ee',
                        borderRadius: 8,
                        padding: '8px',
                        width: 70,
                        fontSize: 15,
                        background: '#f7faff'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(90deg,#2196f3 0%,#21cbf3 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >Save</button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      style={{
                        background: '#f7faff',
                        color: '#2196f3',
                        border: '1px solid #bcd0ee',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >Cancel</button>
                  </form>
                ) : (
                  <>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isOverdue ? '#ff4d4f' : '#333' }}>
                      {task.title}
                      <span style={{
                        fontSize: 13,
                        color: isOverdue ? '#ff4d4f' : '#888',
                        marginLeft: 10
                      }}>
                        (Due: {task.dueDate}{isOverdue && " - Overdue!"})
                      </span>
                    </div>
                    <div style={{ margin: '4px 0 6px 0', color: '#666' }}>{task.description}</div>
                    <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                      Estimated Time: {task.estimatedTime} hour(s)
                    </div>
                    <button
                      onClick={() => markDone(task.id)}
                      style={{
                        background: task.done
                          ? 'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)'
                          : 'linear-gradient(90deg,#2196f3 0%,#21cbf3 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                    >
                      {task.done ? 'Mark as Undone' : 'Mark as Done'}
                    </button>
                    <button
                      onClick={() => startEdit(task)}
                      style={{
                        background: '#f7faff',
                        color: '#2196f3',
                        border: '1px solid #bcd0ee',
                        borderRadius: 8,
                        padding: '7px 14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        background: '#fff0f0',
                        color: '#ff4d4f',
                        border: '1px solid #ffb3b3',
                        borderRadius: 8,
                        padding: '7px 14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
