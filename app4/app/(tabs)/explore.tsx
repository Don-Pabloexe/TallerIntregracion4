import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements'; // Nueva importación de CheckBox
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importar el método de autenticación
import { auth } from '@/scripts/firebaseConfig'; // Importar la configuración de Firebase

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function ExploreScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      // Intentar iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Mostrar un mensaje de éxito en consola
      console.log(`Inicio de sesión exitoso: ${user.email}`);

      // Mostrar una alerta que indica que la sesión se inició correctamente
      Alert.alert('Inicio de sesión exitoso', `Bienvenido, ${user.email}`);

      // Aquí podrías agregar lógica adicional, como redireccionar al usuario
    } catch (error) {
      // Manejar errores de inicio de sesión
      if (error instanceof Error) {
        console.log('Error de inicio de sesión:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.log('Error inesperado durante el inicio de sesión.');
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')} // Placeholder para el logo
          style={styles.logo}
        />
      }>

      <ThemedView style={styles.centeredContainer}>
        <View style={styles.formBox}>
          <ThemedText type="title" style={styles.titleText}>Inicio de Sesión</ThemedText>

          {/* Campo de Correo */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#A6A6A6" />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo de Contraseña */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#A6A6A6" />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Checkbox para "Recordar mi contraseña" */}
          <View style={styles.rememberMeContainer}>
            <CheckBox
              title="Recordar mi contraseña"
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxLabel}
              checkedColor="#00BFA6"  // Color personalizado para cuando está marcado
              uncheckedColor="#A6A6A6"  // Color para cuando no está marcado
            />
          </View>

          {/* Botón de Acceder */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Acceder</ThemedText>
          </TouchableOpacity>

          {/* Enlace para "¿Olvidaste tu contraseña?" */}
          <TouchableOpacity>
            <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Enlace para "Crea una cuenta" */}
        <View style={styles.signupContainer}>
          <ThemedText type="default">¿No tienes una cuenta? </ThemedText>
          <TouchableOpacity>
            <ThemedText type="defaultSemiBold" style={styles.signupLink}>Crea una cuenta</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  titleText: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  rememberMeContainer: {
    marginBottom: 15,
    width: '100%',
  },  
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#A6A6A6',
  },
  loginButton: {
    backgroundColor: '#00BFA6',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#A6A6A6',
    fontSize: 14,
    marginTop: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#00BFA6',
    fontWeight: 'bold',
  },
});
