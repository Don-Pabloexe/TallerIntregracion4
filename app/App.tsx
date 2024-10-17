import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/scripts/firebaseConfig'; // Importa tu configuración de Firebase
import { useRouter } from 'expo-router'; // Para la navegación


const orderRoutes = require('./orders'); // Ajusta el nombre del archivo si es necesario
app.use('/api', orderRoutes);

export default function App() {
  const [initializing, setInitializing] = useState(true); // Mostrar un indicador de carga mientras se verifica el estado
  const [user, setUser] = useState(null); // Estado para guardar el usuario autenticado
  const router = useRouter();

  useEffect(() => {
    // Listener para observar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si el usuario está autenticado, redirigir a Home
        setUser(user);
        router.replace('/home'); // Cambia a la pantalla de Home
      } else {
        // Si no está autenticado, redirigir a la pantalla de inicio de sesión
        router.replace('/'); // Redirigir a la pantalla de login
      }
      if (initializing) setInitializing(false); // Finalizar el indicador de carga
    });

    return () => unsubscribe(); // Desmontar el listener cuando se desmonte el componente
  }, [initializing]);

  // Mostrar un indicador de carga mientras se verifica el estado de autenticación
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BFA6" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return null; // No renderizar nada, ya que la redirección se maneja automáticamente
}
