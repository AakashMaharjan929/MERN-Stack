import React, { useEffect, useState } from 'react';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTasks = () => {
    if (!taskInput.trim()) return;

    const newTask = { 
      id: Date.now(),
      text: taskInput,
      completed: false
    }

    setTasks([...tasks, newTask]);
    setTaskInput("");
  }

  const toggleTaskComplete = (id) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  }

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '50px auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333'
    },
    inputDiv: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    input: {
      flex: 1,
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginRight: '10px'
    },
    button: {
      padding: '10px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer'
    },
    buttonDelete: {
      padding: '5px 10px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#dc3545',
      color: '#fff',
      marginLeft: '10px',
      cursor: 'pointer'
    },
    ul: {
      listStyleType: 'none',
      padding: 0
    },
    li: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px',
      backgroundColor: '#fff',
      boxShadow: '0px 2px 5px rgba(0,0,0,0.05)'
    },
    taskText: (completed) => ({
      textDecoration: completed ? 'line-through' : 'none',
      marginLeft: '10px',
      flex: 1
    })
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>To Do List</h1>
      <div style={styles.inputDiv}>
        <input
          style={styles.input}
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder='Enter a new task'
        />
        <button style={styles.button} onClick={addTasks}>Add Task</button>
      </div>
      <ul style={styles.ul}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.li}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskComplete(task.id)}
            />
            <span style={styles.taskText(task.completed)}>{task.text}</span>
            <button style={styles.buttonDelete} onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;
