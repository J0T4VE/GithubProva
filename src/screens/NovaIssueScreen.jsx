import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { createIssue } from "../api/githubApi";

export default function NovaIssueScreen({ route, navigation }) {
  const { repositorio, token } = route.params;
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleCriarIssue = async () => {
    if (!titulo) {
      Alert.alert("Erro", "O título é obrigatório!");
      return;
    }

    try {
      await createIssue(token, repositorio.owner.login, repositorio.name, {
        title: titulo,
        body: descricao,
      });
      Alert.alert("Sucesso", "A issue foi criada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao criar issue:", error);
      Alert.alert("Erro", "Não foi possível criar a issue.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Nova Issue</Text>
      <TextInput
        style={styles.input}
        placeholder="Título da Issue"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição da Issue (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Button title="Criar Issue" onPress={handleCriarIssue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
