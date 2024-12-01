import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Picker } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axiosConfig';

const PaymentScreen = () => {
  const [monto, setMonto] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('01');
  const [expiryYear, setExpiryYear] = useState('2024');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const navigation = useNavigation();

  // Listener para recargar datos al enfocar la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true); // Muestra un indicador de carga mientras se obtienen los datos
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setError('No se pudo identificar al usuario.');
          setMonto(null);
          setIsLoading(false);
          return;
        }

        // Realiza la consulta al backend para obtener el monto más reciente
        const response = await axios.get(`http://localhost:5000/pedido/monto_reciente/${userId}`);
        if (!response.data || response.data.monto === undefined) {
          setError('No se pudo cargar el monto.');
          setMonto(null);
        } else {
          setMonto(response.data.monto); // Guarda el monto en el estado
          setError(''); // Limpia cualquier error previo
        }
      } catch (err) {
        console.error('Error al obtener el monto reciente:', err);
        setError('Hubo un problema al cargar el monto.');
      } finally {
        setIsLoading(false); // Finaliza el indicador de carga
      }
    });

    return unsubscribe; // Limpia el listener al desmontar el componente
  }, [navigation]);

  const handlePayment = async () => {
    if (!cardNumber || !cardName || !cvv || !expiryMonth || !expiryYear) {
      Alert.alert('Error', 'Por favor completa todos los campos del formulario.');
      return;
    }
  
    setIsProcessing(true); // Muestra un indicador de procesamiento
  
    try {
      // Enviar los datos al backend para procesar el pago
      const response = await axios.post('http://localhost:5000/pagar', {
        monto,
        tarjeta: {
          numero: cardNumber,
          nombre: cardName,
          fecha_expiracion: `${expiryMonth}/${expiryYear}`,
          cvv,
        },
      });
  
      // Verifica la respuesta del backend
      if (response.status === 200 && response.data.estado === 'aprobado') {
        Alert.alert('Éxito', response.data.mensaje); // Muestra el mensaje del backend
        router.push('/SuccessScreen'); // Redirige a una pantalla de éxito si es necesario
      } else {
        Alert.alert('Error', 'Hubo un problema al procesar el pago. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      Alert.alert('Error', 'Hubo un problema al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsProcessing(false); // Oculta el indicador de procesamiento
    }
  };
  

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monto a pagar: ${monto}</Text>

      {/* Formulario de datos de la tarjeta */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del Titular"
        value={cardName}
        onChangeText={setCardName}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="Número de Tarjeta"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
          maxLength={16}
        />
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
          maxLength={3}
          secureTextEntry
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.pickerContainer, styles.rowItem]}>
          <Picker
            selectedValue={expiryMonth}
            onValueChange={(itemValue) => setExpiryMonth(itemValue)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item key={i} label={`${i + 1 < 10 ? '0' : ''}${i + 1}`} value={`${i + 1 < 10 ? '0' : ''}${i + 1}`} />
            ))}
          </Picker>
        </View>

        <View style={[styles.pickerContainer, styles.rowItem]}>
          <Picker
            selectedValue={expiryYear}
            onValueChange={(itemValue) => setExpiryYear(itemValue)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <Picker.Item key={i} label={`${2024 + i}`} value={`${2024 + i}`} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? 'Procesando...' : 'Pagar'}
        </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
  },
  payButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default PaymentScreen;
