
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function IndexScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      const { user } = response.data;

      // Guardar el ID del usuario en AsyncStorage
      await AsyncStorage.setItem('userId', user.id_usuario.toString());
      console.log('ID de usuario guardado:', user.id_usuario); // Verificación del guardado

      Alert.alert('Inicio de sesión exitoso', `Bienvenido, ${user.nombre}`);

      setTimeout(() => {
        setIsLoggingIn(false);
        router.push('/home');
      }, 1000);
    
    } catch (error) {
      setIsLoggingIn(false);

      if (error.response) {
        console.log('Error de inicio de sesión:', error.response.data);
        Alert.alert('Error', error.response.data);
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
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.logo}
        />
      }
    >
      <ThemedView style={styles.centeredContainer}>
        <Animated.View
          entering={SlideInLeft.duration(500)}
          exiting={SlideOutRight.duration(500)}
          style={styles.formBox}
        >
          <ThemedText type="title" style={styles.titleText}>
            Inicio de Sesión
          </ThemedText>

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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Acceder</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/recuperar')}>
            <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.signupContainer}>
          <ThemedText type="default">¿No tienes una cuenta? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <ThemedText type="defaultSemiBold" style={styles.signupLink}>Crea una cuenta</ThemedText>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#00BFA6',
    fontWeight: 'bold',
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
    fontSize: 18,
    color: '#00BFA6',
  },
});
