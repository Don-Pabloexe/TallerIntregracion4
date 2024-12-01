import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const SuccessScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Pago Exitoso!</Text>
      <Text style={styles.message}>
        Tu pago ha sido procesado correctamente. Muchas gracias por tu compra.
      </Text>

      {/* Botón para regresar a la pantalla principal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/home')} // Cambia '/home' por la ruta principal de tu aplicación
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
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
