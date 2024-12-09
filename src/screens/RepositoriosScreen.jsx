import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getUserRepos } from "../api/githubApi";

export default function RepositoriosScreen({ route, navigation }) {
  const { token } = route.params;
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    carregarRepositorios();
  }, [page]);

  const carregarRepositorios = async () => {
    try {
      setLoading(true);
      const novosRepos = await getUserRepos(token, page);

      if (novosRepos.length === 0 && page === 1) {
        Alert.alert("Atenção", "Nenhum repositório encontrado para este usuário.");
      }

      setRepositorios((prev) => (page === 1 ? novosRepos : [...prev, ...novosRepos]));
    } catch (error) {
      console.error("Erro ao carregar repositórios:", error);
      Alert.alert("Erro", "Não foi possível carregar os repositórios.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await carregarRepositorios();
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ margin: 10 }} />;
  };

  const handleRepositorioClick = (repositorio) => {
    navigation.navigate("Issues", { repositorio, token });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Repositórios</Text>
      {loading && repositorios.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={repositorios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleRepositorioClick(item)}
            >
              <Text style={styles.nome}>{item.name}</Text>
              <Text style={styles.descricao}>{item.description || "Sem descrição"}</Text>
            </TouchableOpacity>
          )}
          onEndReached={() => setPage((prev) => prev + 1)}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
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
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  descricao: {
    fontSize: 14,
    color: "#555",
  },
});
