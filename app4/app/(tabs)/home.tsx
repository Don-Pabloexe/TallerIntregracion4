import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '@/scripts/firebaseConfig'; // Firebase Authentication y Firestore
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Importar signOut
import { doc, getDoc } from 'firebase/firestore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router'; // Para la navegación

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7; // El 70% del ancho de la pantalla

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Usuario'); // Valor predeterminado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const translateX = useSharedValue(-SIDEBAR_WIDTH); // Posición inicial de la barra lateral, oculta fuera de la pantalla

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user.displayName) {
        setUserName(user.displayName);
      } else {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.username || 'Usuario');
        } else {
          console.log('No se encontró el documento del usuario en Firestore');
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase cierra la sesión del usuario
      router.replace('/'); // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      console.log('Error al cerrar sesión:', error.message);
    }
  };

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    translateX.value = withSpring(isSidebarOpen ? -SIDEBAR_WIDTH : 0); // Si está abierta, la cerramos y viceversa
  };

  // Estilo animado para la barra lateral
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Botón para abrir la barra lateral */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>☰ Menú</Text>
      </TouchableOpacity>

      {/* Contenido principal */}
      <Text style={styles.welcomeText}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.instructions}>Estamos contentos de tenerte aquí.</Text>

      {/* Barra lateral deslizable */}
      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menú</Text>

          {/* Flecha para cerrar la barra lateral */}
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
        </View>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 18,
    color: '#666',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00BFA6',
    padding: 10,
    borderRadius: 5,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#2c3e50',
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
