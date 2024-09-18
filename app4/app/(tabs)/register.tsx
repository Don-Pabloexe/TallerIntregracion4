import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../scripts/firebaseConfig"; // Importar Firestore también
import { doc, setDoc } from "firebase/firestore"; // Para guardar datos en Firestore
import { Ionicons } from "@expo/vector-icons"; // Para los iconos de contraseña

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [rut, setRut] = useState(""); // Nuevo campo de RUT
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        username: username,
        email: email,
        rut: rut // Guardar el RUT también
      });

      setMessage("Usuario registrado con éxito!");
      console.log("Usuario registrado:", userCredential.user);
      Alert.alert("Éxito", "Usuario registrado con éxito");
    } catch (error) {
      if (error instanceof Error) {
        // Ahora puedes acceder de manera segura a error.message
        setMessage(`Error: ${error.message}`);
        Alert.alert("Error", error.message);
        console.error("Error al registrar el usuario:", error);
      } else {
        // Si el error no es una instancia de Error, maneja el caso de forma genérica
        setMessage("Ocurrió un error inesperado");
        Alert.alert("Error", "Ocurrió un error inesperado");
        console.error("Error desconocido:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu Cuenta</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nombre Completo"
        style={styles.input}
      />

      {/* Campo de RUT con formato predefinido */}
      <TextInput
        value={rut}
        onChangeText={setRut}
        placeholder="Ej: 21112344-4" // Formato predefinido
        style={styles.input}
      />

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Nombre de Usuario"
        style={styles.input}
      />

      {/* Campo de Contraseña con ícono para mostrar/ocultar */}
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          style={styles.inputPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Campo de Confirmar Contraseña con ícono para mostrar/ocultar */}
      <View style={styles.passwordContainer}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repetir Contraseña"
          secureTextEntry={!showConfirmPassword}
          style={styles.inputPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Botón para Registrar */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Crear Cuenta</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#00BFA6",
  },
  input: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    borderColor: "#00BFA6",
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    borderColor: "#00BFA6",
    borderWidth: 1,
  },
  inputPassword: {
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: "#00BFA6",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    color: "red",
  },
});

export default RegisterScreen;
