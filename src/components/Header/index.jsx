import { View, Text } from "react-native";
import { Container, MenuButton, Title } from "./styles";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function Header({ title }) {
  const navigation = useNavigation();
  return (
    <Container>
      <MenuButton onPress={() => navigation.openDrawer()}>
        <Feather name="menu" size={36} color="#FFF" />
      </MenuButton>
      <Title>{title}</Title>
    </Container>
  );
}
