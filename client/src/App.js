import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// La URL del backend.
// const API_URL = '';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/todos';
function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Carga de datos iniciales.
  useEffect(() => {
    fetchTodos();
  }, []);

  // Función para obtener todas las tareas del servidor
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  // Función para manejar el envío del formulario y crear una nueva tarea
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!newTodo.trim()) return; // No agregar tareas vacías

    try {
      const response = await axios.post(API_URL, { text: newTodo });
      setTodos([...todos, response.data]); // Agrega la nueva tarea a la lista
      setNewTodo(''); // Limpia el input
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };
  
  // Función para marcar una tarea como completada o incompleta
  const handleToggle = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  // Función para eliminar una tarea
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id)); // Filtra la tarea eliminada
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Mi Lista de Tareas (MERN)</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Añadir una nueva tarea..."
        />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggle(todo._id)}>
              {todo.text}
            </span>
            <button onClick={() => handleDelete(todo._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;