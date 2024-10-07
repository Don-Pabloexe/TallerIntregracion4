import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '@/scripts/firebaseConfig'; // Asegúrate de que las rutas de importación son correctas
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7; // El 70% del ancho de la pantalla

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Usuario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const translateX = useSharedValue(-SIDEBAR_WIDTH);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserName(currentUser.displayName || 'Usuario');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        const q = query(
          collection(db, "products"),
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedProducts);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debouncing the search
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggleFavorite = async (productId) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      const userData = (await getDoc(userRef)).data();
      if (userData.favorites && userData.favorites.includes(productId)) {
        await updateDoc(userRef, {
          favorites: arrayRemove(productId)
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(productId)
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    translateX.value = withSpring(isSidebarOpen ? -SIDEBAR_WIDTH : 0);
  };

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.log('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>☰ Menú</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#00BFA6" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text style={styles.productName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                <Ionicons name={user && user.favorites && user.favorites.includes(item.id) ? 'heart' : 'heart-outline'} size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No se encontraron productos.</Text>
          }
        />
      )}
      <Text style={styles.welcomeText}>¡Bienvenido, {userName}!</Text>
      <Text style={styles.instructions}>Estamos contentos de tenerte aquí.</Text>
      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menú</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
        </View>
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
  searchInput: {
    height: 40,
    width: '90%',
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#DDD',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#AAA',
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
