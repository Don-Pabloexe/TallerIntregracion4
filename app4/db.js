const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const cors = require('cors');

const app = express();
const port = 5000;

// Configura CORS para permitir peticiones desde tu aplicación React Native
app.use(cors());
app.use(express.json());

// Configura el pool de conexiones a PostgreSQL
const pool = new Pool({
  user: 'postgres',     // Usuario de PostgreSQL
  host: 'localhost',    // Servidor de PostgreSQL
  database: 'postgres', // Nombre de la base de datos
  password: 'seba1234', // Contraseña de PostgreSQL
  port: 5432,           // Puerto de PostgreSQL
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (fullName, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [fullname, username, email, hashedPassword];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Correo y contraseña son obligatorios');
  }

  try {
    // Verificar si el usuario existe
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).send('Usuario no encontrado');
    }

    const user = userResult.rows[0];

    // Comparar la contraseña
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send('Contraseña incorrecta');
    }

    // Iniciar sesión exitoso
    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta para restablecer contraseña (simulado)
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('El correo es obligatorio');
  }

  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).send('Usuario no encontrado');
    }

    // Simula el envío de un correo electrónico para restablecer la contraseña
    res.status(200).send(`Correo enviado a ${email} con instrucciones para restablecer la contraseña`);
  } catch (err) {
    console.error('Error al restablecer la contraseña:', err);
    res.status(500).send('Error al restablecer la contraseña');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
