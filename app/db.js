
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Configura CORS para permitir peticiones desde tu aplicación React Native
app.use(cors());

// Configura el pool de conexiones a PostgreSQL
const pool = new Pool({
    user: 'postgres',     
    host: 'localhost',       
    database: 'postgres',    
    password: 'seba1234',      
    port: 5432,                
});

// Ruta para obtener datos de una tabla
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tiendas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en la consulta');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
