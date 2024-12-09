import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getUserInfo } from "../api/githubApi";

export default function LoginScreen({ navigation }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!token) {
      Alert.alert("Erro", "Por favor, insira o token do GitHub.");
      return;
    }

    setLoading(true);

    try {
      const userInfo = await getUserInfo(token);
      console.log("Usuário autenticado:", userInfo);
      setLoading(false);
      navigation.navigate("Repositórios", { token });
    } catch (error) {
      setLoading(false);
      Alert.alert("Erro", "Token inválido. Por favor, tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Token do GitHub"
        value={token}
        onChangeText={setToken}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Acessar" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
