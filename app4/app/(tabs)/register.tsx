import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../scripts/firebaseConfig"; // Asegúrate de la ruta correcta
import { Ionicons } from "@expo/vector-icons"; // Para los iconos de contraseña

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setMessage("Usuario registrado con éxito!");
        console.log("Usuario registrado:", userCredential.user);
        Alert.alert("Éxito", "Usuario registrado con éxito");
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
        Alert.alert("Error", error.message);
        console.error("Error al registrar el usuario:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu Cuenta</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Correo Electronico"
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
