const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 5001;

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB Atlas!"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Importar el modelo
const Todo = require('./models/Todo');

// Middleware
app.use(cors()); // Permite la comunicación entre cliente y servidor
app.use(express.json()); // Permite que el servidor entienda el formato JSON

// --- Rutas de la API ---

// OBTENER todas las tareas
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// CREAR una nueva tarea
app.post("/api/todos", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text
  });
  await newTodo.save();
  res.json(newTodo);
});

// ACTUALIZAR una tarea (marcar como completada/incompleta)
app.put("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// ELIMINAR una tarea
app.delete("/api/todos/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Tarea eliminada", result });
});

// Servir archivos estáticos de React en producción
if (process.env.NODE_ENV === 'production') {
  // Path código del cliente
  app.use(express.static('./client/build'));

  const path = require('path');
  // Para cualquier otra ruta que no sea de la API, sirve el index.html de React
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});