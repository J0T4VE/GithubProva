import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RepositoriosScreen from "./src/screens/RepositoriosScreen";
import IssuesScreen from "./src/screens/IssuesScreen";
import NovaIssueScreen from "./src/screens/NovaIssueScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Repositórios" component={RepositoriosScreen} />
        <Stack.Screen name="Issues" component={IssuesScreen} />
        <Stack.Screen name="Nova Issue" component={NovaIssueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
