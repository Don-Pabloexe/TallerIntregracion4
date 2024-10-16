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
  const { nombre, apellido, email, password, telefono, rut } = req.body;

  if (!nombre || !apellido || !email || !password || !rut) {
    return res.status(400).send('Todos los campos obligatorios deben ser proporcionados');
  }

  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la consulta SQL para que se ajuste a la nueva base de datos
    const query = `
      INSERT INTO Usuario (Nombre, Apellido, Correo_Email, Contrasena, Telefono, Rut)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
    const values = [nombre, apellido, email, hashedPassword, telefono || null, rut];

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
    const userQuery = 'SELECT * FROM Usuario WHERE Correo_Email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).send('Usuario no encontrado');
    }

    const user = userResult.rows[0];

    // Comparar la contraseña
    const isPasswordMatch = await bcrypt.compare(password, user.contrasena); // Actualizado: `contrasena`
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

//Funcionalidades Ryson
// Obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_producto AS id, nombre_producto AS nombre, precio, imagen, id_tienda FROM producto');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});


// Ruta para obtener todas las marcas (tiendas)
app.get('/marcas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tienda AS id, nombre, imagen FROM tienda');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching marcas:', error);
    res.status(500).json({ error: 'Error fetching marcas' });
  }
});


// Ruta para obtener productos de una marca específica
app.get('/marcas/:brandId/products', async (req, res) => {
  const { brandId } = req.params;
  
  try {
    const result = await pool.query('SELECT id_producto AS id, nombre_producto AS nombre, precio, imagen FROM producto WHERE id_tienda = $1', [brandId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching brand products:', error);
    res.status(500).json({ error: 'Error fetching brand products' });
  }
});

// Ruta para procesar el pago
app.post('/procesarPago', async (req, res) => {
  const { idPedido, metodoPago } = req.body;

  try {
    // Simulamos un pago exitoso. Aquí podrías integrar un servicio de pago real como Stripe, PayPal, etc.
    const estadoPago = 'completado';

    // Actualizamos el pedido para cambiar el estado del pago a 'completado'
    await pool.query(
      'UPDATE pedidos SET estado_pago = $1 WHERE id_pedido = $2',
      [estadoPago, idPedido]
    );

    // Responder con éxito
    res.status(200).json({ message: 'Pago procesado exitosamente', id_pedido: idPedido, estado_pago: estadoPago });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

// Confirmar pedido y registrar en la base de datos
// Confirmar pedido y registrar en la base de datos
app.post('/confirmarPedido', async (req, res) => {
  const { total, idUsuario, tienda, direccion } = req.body;  // Solo recibimos el total y otros datos necesarios

  try {
    // Validar que todos los datos requeridos están presentes
    if (!total || !idUsuario || !tienda || !direccion) {
      return res.status(400).json({ error: 'Faltan datos en la solicitud.' });
    }

    // Insertar el pedido en la tabla 'pedido' con el total y demás datos
    const result = await pool.query(
      `INSERT INTO pedido (fecha_pedido, precio_total, iva, direccion, id_usuario, id_tienda)
       VALUES (NOW(), $1, $2, $3, $4, $5) RETURNING id_pedido`,
      [total, total * 0.19, direccion, idUsuario, tienda] // IVA del 19%
    );

    const pedidoId = result.rows[0].id_pedido;

    // Devolver el ID del pedido confirmado
    res.status(200).json({ message: 'Pedido confirmado', pedidoId });
  } catch (error) {
    console.error('Error al confirmar el pedido:', error);
    res.status(500).json({ error: 'Error al confirmar el pedido' });
  }
});










app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
