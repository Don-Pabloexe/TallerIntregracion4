
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Client } = require('pg');

const app = express();
const port = 5000;

// Configura CORS para permitir peticiones desde tu aplicación React Native
app.use(cors());
app.use(express.json());

// Configura el pool de conexiones a PostgreSQL
const pool = new Pool({
  user: 'postgres',     // Usuario de PostgreSQL
  host: 'localhost',    // Servidor de PostgreSQL
  database: 'main', // Nombre de la base de datos
  password: 'seba1234', // Contraseña de PostgreSQL
  port: 5432,           // Puerto de PostgreSQL
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que desees
  auth: {
    user: '', // Correo del usuario que va a enviar los correos
    pass: '', // Contraseña
  },
});

app.post('/enviar-correo', async (req, res) => {
  console.log('Recibiendo solicitud de correo...');
  try {
    const mailOptions = {
      from: 'horacioquiroga752@gmail.com', // Email del emisor
      to: 'manredfan10@gmail.com', // Email del receptor
      subject: 'Probando el servicio de correos', // Titular del correo
      text: 'Poto', // Contenido del correo
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        // Responde con JSON en caso de error
        return res.status(500).json({ error: 'Error al enviar el correo' });
      }
      console.log('Correo enviado correctamente', info);
      // Responde con JSON en caso de éxito
      return res.status(200).json({ message: 'Correo enviado correctamente' });
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    // Responde con JSON en caso de error
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
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
    const result = await pool.query('SELECT id_producto AS id, nombre_producto AS nombre, precio, id_tienda FROM producto');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Ruta para obtener todas las marcas (tiendas)
app.get('/marcas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tienda AS id, nombre FROM tienda');
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
    const result = await pool.query(
      'SELECT id_producto AS id, nombre_producto AS nombre, precio, imagen FROM producto WHERE id_tienda = $1',
      [brandId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching brand products:', error);
    res.status(500).json({ error: 'Error fetching brand products' });
  }
});

// Ruta para obtener todos los pedidos
app.get('/historialPedido', async (req, res) => {
  const { id_usuario } = req.query; // Obtiene el id_usuario de la consulta

  if (!id_usuario) {
    return res.status(400).json({ error: 'El id_usuario es obligatorio' });
  }

  try {
    const result = await pool.query(
      'SELECT id_pedido, fecha_pedido, precio_total, direccion, sector, comentarios, estado FROM pedido WHERE id_usuario = $1',
      [id_usuario]
    );
    res.json(result.rows);
  
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

app.get('/DatosEntregaPedido', async (req, res) => {
  const { id_pedido } = req.query; // Asegúrate de que este parámetro sea correcto

  if (!id_pedido) {
    return res.status(400).json({ error: 'El id_pedido es obligatorio' });
  }

  try {
    const result = await pool.query(
      'SELECT id_pedido, fecha_pedido, precio_total, direccion, sector, comentarios, estado, nombre_receptor, hora_pedido, rut_receptor FROM pedido WHERE id_pedido = $1',
      [id_pedido]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener detalles de pedido:', error);
    res.status(500).json({ error: 'Error al obtener detalles de pedido' });
  }
});

// Confirmar pedido y registrar en la base de datos
app.post('/confirmarPedido', async (req, res) => {
  const { total, idUsuario, tienda, direccion, sector, comentario, hora } = req.body; // Agrega sector y comentario

  try {
    // Validar que todos los datos requeridos están presentes
    if (!total || !idUsuario || !tienda || !direccion || !sector || !comentario) {
      return res.status(400).json({ error: 'Faltan datos en la solicitud.' });
    }

    // Insertar el pedido en la tabla 'pedido'
    const result = await pool.query(
      `INSERT INTO pedido (fecha_pedido, precio_total, iva, direccion, id_usuario, id_tienda, sector, comentarios, estado, hora_pedido)
       VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id_pedido`,
      [total, total * 0.19, direccion, idUsuario, tienda, sector, comentario, 0] // Añade sector, comentario y estado aquí
    );

    const pedidoId = result.rows[0].id_pedido;

    // Devolver el ID del pedido confirmado
    res.status(200).json({ message: 'Pedido confirmado', pedidoId });
  } catch (error) {
    console.error('Error al confirmar el pedido:', error);
    res.status(500).json({ error: 'Error al confirmar el pedido' });
  }
});

// Ruta para obtener marcas (tiendas)
app.get('/marcas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marcas');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las marcas');
  }
});

// Ruta para obtener productos de una tienda específica
app.get('/store/:id_tienda/products', async (req, res) => {
  const { id_tienda } = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id_tienda = $1', [id_tienda]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos de la tienda');
  }
});

// Ruta para obtener detalles de una tienda
app.get('/store/:id_tienda', async (req, res) => {
  const { id_tienda } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tiendas WHERE id = $1', [id_tienda]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los detalles de la tienda');
  }
});

// Ruta para obtener los detalles de una tienda
app.get('/tiendaDatos', async (req, res) => {
  const { id_tienda } = req.query;  // Obtiene el id_tienda de la consulta

  if (!id_tienda) {
    return res.status(400).json({ error: 'El id_tienda es obligatorio' });
  }

  try {
    const result = await pool.query(
      'SELECT nombre, ubicacion, t_categoria, telefono, imagen FROM tienda WHERE id_tienda = $1',
      [id_tienda]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró la tienda' });
    }
    
    res.json(result.rows[0]);  // Envía los detalles de la tienda
    
  } catch (error) {
    console.error('Error al obtener los detalles de la tienda:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de la tienda' });
  }
});

// Ruta para obtener los detalles del producto
app.get('/productoDatos', async (req, res) => {
  const { id_producto } = req.query;  // Obtiene el producto de la consulta

  if (!id_producto) {
    return res.status(400).json({ error: 'El id_producto es obligatorio' });
  }

  try {
    const result = await pool.query(
      'SELECT nombre_producto, descripcion, precio, categoria, dimensiones, existencias, iva, peso, imagen, id_tienda FROM producto WHERE id_producto = $1',
      [id_producto]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró la tienda' });
    }
    
    res.json(result.rows[0]);  // Envía los detalles de la tienda
    
  } catch (error) {
    console.error('Error al obtener los detalles del producto:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del producto' });
  }
});

app.get('/productosBusqueda', async (req, res) => {
  const { search } = req.query;  // Captura el parámetro de búsqueda
  try {
    let query = 'SELECT * FROM producto';
    let queryParams = [];

    if (search) {
      
      query += ' WHERE nombre_producto ILIKE $1 OR descripcion ILIKE $1';
      queryParams.push(`%${search}%`);
    }

    query += ' ORDER BY id_producto ASC'; 

    const result = await pool.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).send('No se encontraron productos');
    }

    res.json(result.rows); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
