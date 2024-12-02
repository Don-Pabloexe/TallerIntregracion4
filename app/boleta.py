from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from fpdf import FPDF
import os
import datetime

app = Flask(__name__)
CORS(app)  # Permitir CORS para todas las rutas

# Directorio para almacenar los PDFs
PDF_DIRECTORY = os.path.join(os.getcwd(), "boletas")
os.makedirs(PDF_DIRECTORY, exist_ok=True)  # Crea la carpeta si no existe

class BoletaPDF(FPDF):
    def __init__(self, numero_boleta):
        super().__init__()
        self.numero_boleta = numero_boleta  # Número dinámico de la boleta

    def header(self):
        # Encabezado de la boleta
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'R.U.T.: 76.192.083-9', 0, 1, 'C')
        self.cell(0, 10, 'BOLETA ELECTRÓNICA', 0, 1, 'C')
        self.cell(0, 10, f'N° {self.numero_boleta:03}', 0, 1, 'C')  # Número dinámico con formato 001, 002, etc.
        self.ln(5)

    def footer(self):
        # Pie de página con el QR simulado y texto adicional
        self.set_y(-30)
        self.set_font('Arial', '', 8)
        self.cell(0, 10, 'Timbre Electrónico SII', 0, 1, 'C')
        self.cell(0, 10, 'Resolución 0 de 2024', 0, 1, 'C')
        self.cell(0, 10, 'Verifique documento: ejemplo.com/boletas', 0, 1, 'C')

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    pedido = data.get('pedido')
    productos = data.get('productos')
    datos_personales = data.get('datosPersonales')

    # Validar los datos recibidos
    if not pedido or not productos or not datos_personales:
        return jsonify({'error': 'Faltan datos para generar el PDF'}), 400

    # Verificar archivos existentes para asignar un número único
    numero_boleta = 1
    while os.path.exists(os.path.join(PDF_DIRECTORY, f"boleta_{pedido.get('idUsuario')}_{numero_boleta}.pdf")):
        numero_boleta += 1

    # Crear el PDF
    nombre_archivo = f"boleta_{pedido.get('idUsuario')}_{numero_boleta}.pdf"
    pdf_path = os.path.join(PDF_DIRECTORY, nombre_archivo)

    pdf = BoletaPDF(numero_boleta)
    pdf.add_page()
    pdf.set_font('Arial', '', 10)

    # Información del usuario
    pdf.cell(0, 10, f"Nombre: {datos_personales['nombre']} {datos_personales['apellido']}", 0, 1)
    pdf.cell(0, 10, f"RUT: {datos_personales['rut']}", 0, 1)
    pdf.cell(0, 10, f"Correo: {datos_personales['correo_email']}", 0, 1)
    pdf.cell(0, 10, f"Teléfono: {datos_personales['telefono']}", 0, 1)
    pdf.ln(10)

    # Información del pedido
    pdf.cell(0, 10, f"ID Usuario: {pedido['idUsuario']}", 0, 1)
    pdf.cell(0, 10, f"Tienda: {pedido['tienda']}", 0, 1)
    pdf.cell(0, 10, f"Dirección: {pedido['direccion']}", 0, 1)
    pdf.cell(0, 10, f"Sector: {pedido['sector']}", 0, 1)
    pdf.cell(0, 10, f"Comentario: {pedido['comentario']}", 0, 1)
    pdf.ln(5)

    # Agregar los productos
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(80, 10, 'Producto', 1, 0, 'C')
    pdf.cell(30, 10, 'Precio Unitario', 1, 0, 'C')
    pdf.cell(30, 10, 'Cantidad', 1, 0, 'C')
    pdf.cell(30, 10, 'Tienda', 1, 1, 'C')
    pdf.set_font('Arial', '', 10)

    for producto in productos:
        pdf.cell(80, 10, producto['nombre'], 1, 0)
        pdf.cell(30, 10, f"${producto['precio']:.2f}", 1, 0, 'C')
        pdf.cell(30, 10, '1', 1, 0, 'C')  # Asume cantidad 1 por ahora
        pdf.cell(30, 10, f"Tienda #{producto['tienda']}", 1, 1, 'C')

    # Total del pedido
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(140, 10, 'Total:', 1, 0, 'R')
    pdf.cell(30, 10, f"${pedido['total']:.2f}", 1, 1, 'C')

    # Guardar el archivo PDF
    pdf.output(pdf_path)

    # Devolver el nombre del archivo generado junto con su ruta completa
    return jsonify({'fileName': nombre_archivo, 'filePath': pdf_path}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
