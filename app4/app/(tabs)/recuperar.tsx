import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para el ícono del candado
import { sendPasswordResetEmail } from 'firebase/auth'; // Función de Firebase
import { auth } from '../../scripts/firebaseConfig'; // Asegúrate de que la ruta sea correcta

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Éxito', 'Correo de restablecimiento de contraseña enviado con éxito');
      })
      .catch((error) => {
        Alert.alert('Error', `No se pudo enviar el correo: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>

      <Ionicons name="lock-closed-outline" size={80} color="#00BFA6" style={styles.icon} />

      <Text style={styles.subtitle}>Dificultades al iniciar tu cuenta?</Text>
      <Text style={styles.description}>
        Introduce tu email y te enviaremos un correo electrónico con las instrucciones para cambiar tu contraseña
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Restablecer</Text>
      </TouchableOpacity>

      {/* Este botón ya no usa navegación */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>Volver a inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFA6',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    borderColor: '#00BFA6',
    borderWidth: 1,
  },
  resetButton: {
    backgroundColor: '#00BFA6',
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#00BFA6',
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
