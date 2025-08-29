const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB!"))
.catch((err) => console.error("Error al conectar a MongoDB:", err));

// Importar el modelo
const Todo = require('./models/Todo');

// Middleware
app.use(cors());
app.use(express.json());

// --- Rutas de la API ---

// OBTENER todas las tareas
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// CREAR una nueva tarea
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tarea" });
  }
});

// ACTUALIZAR una tarea
app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
});

// ELIMINAR una tarea
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea eliminada", result });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
});

// Servir archivos estáticos de React en producción
if (process.env.NODE_ENV === 'production') {
  // Sirve archivos estáticos del build de React
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Maneja todas las demás rutas devolviendo el index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});