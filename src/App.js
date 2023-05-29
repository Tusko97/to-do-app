import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from './images/todoapp.jpg';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (title, projectId) => {
    try {
      const response = await axios.post('http://localhost:3001/tasks', {
        title,
        completed: false,
        projectId
      });
      const newTask = {
        id: response.data.id,
        title,
        completed: false,
        projectId
      };
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  

  const updateTask = async (id, completed) => {
    try {
      const response = await axios.patch(`http://localhost:3001/tasks/${id}`, {
        completed
      });
      const updatedTask = {
        ...response.data,
        projectId: tasks.find(task => task.id === id).projectId
      };
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return updatedTask;
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <h1>Todo App</h1>
      <h1>Todo App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.elements.title.value;
          const projectId = parseInt(e.target.elements.projectId.value);
          if (title && projectId) {
            addTask(title, projectId);
            e.target.reset();
          }
        }}
      >
        <input type="text" name="title" placeholder="Add task" />
        <select name="projectId">
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => updateTask(task.id, e.target.checked)}
            />
            <span className={task.completed ? 'completed' : ''}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

