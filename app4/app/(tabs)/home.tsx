import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '@/scripts/firebaseConfig'; // Firebase Authentication y Firestore
import { onAuthStateChanged } from 'firebase/auth'; // Para observar el estado de autenticación
import { doc, getDoc } from 'firebase/firestore'; // Para interactuar con Firestore

export default function HomeScreen() {
  const [userName, setUserName] = useState('Usuario'); // Valor predeterminado

  useEffect(() => {
    const fetchUserData = async (user) => {
      // Intentar obtener el nombre desde el displayName de Firebase Authentication
      if (user.displayName) {
        setUserName(user.displayName);
      } else {
        // Si no hay displayName, intentar buscar en Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.username || 'Usuario'); // Usa el campo fullName si está disponible
        } else {
          console.log('No se encontró el documento del usuario en Firestore');
        }
      }
    };

    // Verificar si el usuario está autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si el usuario está autenticado, intentar obtener su información
        fetchUserData(user);
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.instructions}>Estamos contentos de tenerte aquí.</Text>
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
});
