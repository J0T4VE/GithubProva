import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { getRepoIssues, updateIssueState } from "../api/githubApi";

export default function IssuesScreen({ route, navigation }) {
  const { repositorio, token } = route.params;
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarIssues();
  }, []);

  const carregarIssues = async () => {
    try {
      setLoading(true);
      const issuesData = await getRepoIssues(
        token,
        repositorio.owner.login,
        repositorio.name
      );
      setIssues(issuesData);
    } catch (error) {
      console.error("Erro ao carregar issues:", error);
      Alert.alert("Erro", "Não foi possível carregar as issues do repositório.");
    } finally {
      setLoading(false);
    }
  };

  const alterarEstadoIssue = async (id, estadoAtual) => {
    try {
      const novoEstado = estadoAtual === "open" ? "closed" : "open";
      await updateIssueState(token, repositorio.owner.login, repositorio.name, id, novoEstado);
      Alert.alert("Sucesso", `A issue foi marcada como ${novoEstado}.`);
      carregarIssues();
    } catch (error) {
      console.error("Erro ao atualizar estado da issue:", error);
      Alert.alert("Erro", "Não foi possível alterar o estado da issue.");
    }
  };

  const renderRightActions = (issue) => (
    <View style={styles.actionContainer}>
      <Text
        style={styles.actionText}
        onPress={() => alterarEstadoIssue(issue.number, issue.state)}
      >
        {issue.state === "open" ? "Fechar" : "Reabrir"}
      </Text>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarIssues();
    setRefreshing(false);
  };

  const handleNovaIssue = () => {
    navigation.navigate("Nova Issue", { repositorio, token });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Issues - {repositorio.name}</Text>
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={styles.item}>
              <Text style={styles.nome}>{item.title}</Text>
              <Text style={styles.descricao}>{item.body || "Sem descrição"}</Text>
              <Text style={styles.estado}>
                Estado: {item.state === "open" ? "Aberta" : "Fechada"}
              </Text>
            </View>
          </Swipeable>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <TouchableOpacity style={styles.botaoFlutuante} onPress={handleNovaIssue}>
        <Text style={styles.textoBotaoFlutuante}>+</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  descricao: {
    fontSize: 14,
    color: "#555",
  },
  estado: {
    fontSize: 14,
    color: "#888",
  },
  botaoFlutuante: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  textoBotaoFlutuante: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
