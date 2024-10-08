const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'products_db',
  password: 'matimati',
  port: 5432,
});

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, precio, imagen FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
