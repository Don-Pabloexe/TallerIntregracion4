const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { sendEmail } = require('./mailer');  // Importar el módulo de correo

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'main',
  password: 'seba1234',
  port: 5432,
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, telefono, rut } = req.body;

  if (!nombre || !apellido || !email || !password || !rut) {
    return res.status(400).send('Todos los campos obligatorios deben ser proporcionados');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const userQuery = 'SELECT * FROM Usuario WHERE Correo_Email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).send('Usuario no encontrado');
    }

    const user = userResult.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordMatch) {
      return res.status(400).send('Contraseña incorrecta');
    }

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
    const userQuery = 'SELECT * FROM Usuario WHERE Correo_Email = $1';
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

// Obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_producto AS id, nombre_producto AS nombre, precio, id_tienda FROM producto');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para obtener todas las marcas (tiendas)
app.get('/marcas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tienda AS id, nombre FROM tienda');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ error: 'Error al obtener marcas' });
  }
});

// Ruta para obtener productos de una marca específica
app.get('/marcas/:brandId/products', async (req, res) => {
  const { brandId } = req.params;

  try {
    const result = await pool.query('SELECT id_producto AS id, nombre_producto AS nombre, precio, imagen FROM producto WHERE id_tienda = $1', [brandId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos de la marca:', error);
    res.status(500).json({ error: 'Error al obtener productos de la marca' });
  }
});

// Ruta para procesar el pago
app.post('/procesarPago', async (req, res) => {
  const { idPedido, metodoPago } = req.body;

  try {
    const estadoPago = 'completado';

    await pool.query(
      'UPDATE pedidos SET estado_pago = $1 WHERE id_pedido = $2',
      [estadoPago, idPedido]
    );

    res.status(200).json({ message: 'Pago procesado exitosamente', id_pedido: idPedido, estado_pago: estadoPago });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

// Obtener el historial de pedidos
app.get('/historialPedido', async (req, res) => {
  const { id_usuario } = req.query;

  if (!id_usuario) {
    return res.status(400).json({ error: 'El id_usuario es obligatorio' });
  }

  try {
    const result = await pool.query(
      'SELECT fecha_pedido, precio_total, direccion, sector, comentarios FROM pedido WHERE id_usuario = $1',
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener el historial de pedidos:', error);
    res.status(500).json({ error: 'Error al obtener el historial de pedidos' });
  }
});

// Confirmar pedido y enviar correo de confirmación
app.post('/confirmarPedido', async (req, res) => {
  const { total, idUsuario, tienda, direccion, sector, comentario, email } = req.body;  // Añade 'email'

  try {
    if (!total || !idUsuario || !tienda || !direccion || !sector || !comentario || !email) {
      return res.status(400).json({ error: 'Faltan datos en la solicitud.' });
    }

    const result = await pool.query(
      `INSERT INTO pedido (fecha_pedido, precio_total, iva, direccion, id_usuario, id_tienda, sector, comentarios)
       VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7) RETURNING id_pedido`,
      [total, total * 0.19, direccion, idUsuario, tienda, sector, comentario]
    );

    const pedidoId = result.rows[0].id_pedido;

    // Configurar opciones del correo
    const mailOptions = {
      from: 'tuemail@gmail.com',  // Cambia por tu correo de Gmail
      to: email,  // Correo del usuario
      subject: 'Confirmación de Pedido',
      html: `
        <h1>Tu pedido ha sido confirmado</h1>
        <p><strong>ID del pedido:</strong> ${pedidoId}</p>
        <p><strong>Total:</strong> $${total}</p>
        <p><strong>Dirección de Envío:</strong> ${direccion}</p>
        <p><strong>Comentarios:</strong> ${comentario}</p>
      `
    };

    // Enviar el correo usando sendEmail
    sendEmail(mailOptions)
      .then(info => {
        console.log('Correo enviado: ' + info.response);
        res.status(200).json({ message: 'Pedido confirmado y correo enviado', pedidoId: pedidoId });
      })
      .catch(error => {
        console.log('Error al enviar el correo:', error);
        res.status(500).send('Pedido confirmado pero error al enviar el correo.');
      });

  } catch (error) {
    console.error('Error al confirmar el pedido:', error);
    res.status(500).json({ error: 'Error al confirmar el pedido' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
