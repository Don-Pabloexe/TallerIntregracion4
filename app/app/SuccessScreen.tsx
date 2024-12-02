import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SuccessScreen = () => {
  const router = useRouter();
  const [isBoletaGenerated, setIsBoletaGenerated] = useState(false); // Verificar si la boleta se generó
  const [isEmailSent, setIsEmailSent] = useState(false); // Verificar si el correo fue enviado

  useEffect(() => {
    const processSuccessFlow = async () => {
      try {
        const pedidoData = await AsyncStorage.getItem('pedido');
        if (!pedidoData) {
          Alert.alert('Error', 'No se encontraron datos del pedido.');
          return;
        }
    
        const { pedido, productos, datosPersonales } = JSON.parse(pedidoData);
    
        // Llama al backend para generar el PDF
        const response = await axios.post('http://192.168.101.6:5001/generate-pdf', {
          pedido,
          productos,
          datosPersonales,
        });
    
        // Verifica la ruta del archivo recibido
        const { fileName, filePath } = response.data;
        console.log('Archivo generado:', fileName);
        console.log('Ruta completa del archivo:', filePath);
    
        // Opcional: Usa esta ruta para enviar el correo
        await sendEmailWithPDF(datosPersonales.correo_email, fileName);
    
        Alert.alert('Éxito', 'PDF generado y correo enviado correctamente.');
      } catch (error) {
        console.error('Error en el flujo de éxito:', error);
        Alert.alert('Error', 'Hubo un problema durante el proceso.');
      }
    };
    
  
    processSuccessFlow();
  }, []);
  

  const sendEmailWithPDF = async (emailReceptor, fileName) => {
    try {
      console.log('Enviando correo con los datos:', { emailReceptor, fileName }); // Log para verificar
  
      const response = await axios.post('http://192.168.101.6:5000/enviar-correo', {
        emailReceptor,
        nombreArchivo: fileName, // Asegúrate de enviar correctamente el nombre del archivo
      });
  
      if (response.status === 200) {
        Alert.alert('Correo Enviado', 'Tu boleta ha sido enviada a tu correo.');
      } else {
        Alert.alert('Error', 'No se pudo enviar el correo.');
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      Alert.alert('Error', 'No se pudo enviar el correo.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Pago Exitoso!</Text>
      <Text style={styles.message}>
        Tu pago ha sido procesado correctamente. Muchas gracias por tu compra.
      </Text>

      {/* Botón para regresar al inicio */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
            router.push('/HistorialPedidoScreen'); // Redirige al historial o inicio
        }}
      >
        <Text style={styles.buttonText}>Ir a pedidos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00C1A5',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#00C1A5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
