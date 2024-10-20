import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated'; // Animaciones
import axios from 'axios'; // Usaremos axios para hacer peticiones HTTP
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useRouter } from 'expo-router'; // Si sigues usando expo-router
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { CommonActions } from '@react-navigation/native';
// Importa las pantallas que se utilizarán en el stack
import {BrandScreen} from './(tabs)/BrandScreen';

const Stack = createStackNavigator(); // Crea el Stack Navigator

export default function IndexScreen() {
  const router = useRouter(); // Si sigues usando expo-router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Estado para mostrar el modal de carga

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    setIsLoggingIn(true);

    try {
      // Petición al backend para iniciar sesión
      const response = await axios.post('http://192.168.229.9:5000/login', {
        email, // Correo ingresado
        password // Contraseña ingresada
      });

      const { user } = response.data;

      // Mostrar una alerta que indica que la sesión se inició correctamente
      Alert.alert('Inicio de sesión exitoso', `Bienvenido, ${user.nombre}`);

      // Después de un pequeño retraso, redirigir al Home
      setTimeout(() => {
        setIsLoggingIn(false); // Ocultar el modal de carga
        router.push('/home'); // Si aún usas expo-router
      }, 1000);
    } catch (error) {
      // Manejar errores de inicio de sesión
      setIsLoggingIn(false); // Ocultar el modal de carga en caso de error

      if (error.response) {
        // Error desde el servidor
        console.log('Error de inicio de sesión:', error.response.data);
        Alert.alert('Error', error.response.data);
      } else {
        // Error inesperado
        console.log('Error inesperado durante el inicio de sesión.');
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    }
  };

  return (
    
      <Stack.Navigator initialRouteName="Login">
        {/* Pantalla de inicio de sesión */}
        <Stack.Screen
  name="Login"
  options={{ headerShown: false }} // Ocultar encabezado en login
>
  {(props) => (
    <LoginComponent
      {...props}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      isLoggingIn={isLoggingIn}
      router={router}
    />
  )}
</Stack.Screen>
        
        {/* Pantallas adicionales */}
        <Stack.Screen name="BrandProducts" component={BrandScreen} />
      </Stack.Navigator>
    
  );
}

// Aquí está la lógica de tu pantalla de inicio de sesión
function LoginComponent({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  rememberMe,
  setRememberMe,
  isLoggingIn,
  router
}) {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.logo} />}
    >
      <ThemedView style={styles.centeredContainer}>
        <Animated.View
          entering={SlideInLeft.duration(500)}
          exiting={SlideOutRight.duration(500)}
          style={styles.formBox}
        >
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
              checkedColor="#00BFA6"
              uncheckedColor="#A6A6A6"
            />
          </View>

          {/* Botón de Acceder */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Acceder</ThemedText>
          </TouchableOpacity>

          {/* Enlace para "¿Olvidaste tu contraseña?" */}
          <TouchableOpacity onPress={() => router.push('/recuperar')}>
            <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* Enlace para "Crea una cuenta" */}
        <View style={styles.signupContainer}>
          <ThemedText type="default">¿No tienes una cuenta? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <ThemedText type="defaultSemiBold" style={styles.signupLink}>Crea una cuenta</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Modal de carga */}
        <Modal transparent={true} visible={isLoggingIn} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ActivityIndicator size="large" color="#00BFA6" />
              <ThemedText style={styles.loadingText}>Iniciando sesión...</ThemedText>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    marginTop: 15,
  },
  signupLink: {
    color: '#00BFA6',
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#00BFA6',
  },
});
