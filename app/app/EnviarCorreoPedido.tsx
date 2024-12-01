
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';

const EnviarCorreo = () => {
  const [mensaje, setMensaje] = useState('');

  const enviarCorreo = async () => {
    console.log('Enviando correo...'); // Agrega este log para verificar si se está llamando a la función
    try {
      const response = await fetch('http://localhost:5000/enviar-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Respuesta recibida', response); // Agrega este log para ver la respuesta de la API
  
      if (response.ok) {
        const data = await response.json();
        setMensaje('Correo enviado correctamente');
      } else {
        const data = await response.json();
        setMensaje(data.error || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error al conectarse con el servidor', error); // Agrega este log para capturar cualquier error
      setMensaje('Error al conectarse con el servidor');
    }
  };

  return (
    <View>
      <Button title="Enviar correo de prueba" onPress = {enviarCorreo} />
      <Text>{mensaje}</Text>
    </View>
  );
};

export default EnviarCorreo;
