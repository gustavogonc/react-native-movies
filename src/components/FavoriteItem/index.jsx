import {
  Container,
  Title,
  RateContainer,
  Rate,
  ActionContainer,
  DetailButton,
  DeleteButton,
} from "./styles";

import { Ionicons } from "@expo/vector-icons";

export function FavoriteItem({ data, deleteMovie, navigatePage }) {
  return (
    <Container>
      <Title size={22}>{data?.title}</Title>

      <RateContainer>
        <Ionicons name="md-star" size={12} color={"#e7a74e"} />
        <Rate>{parseFloat(data?.vote_average).toFixed(2)}/10</Rate>
      </RateContainer>
      <ActionContainer>
        <DetailButton onPress={() => navigatePage(data)}>
          <Title size={14}>Ver Detalhes</Title>
        </DetailButton>
        <DeleteButton onPress={() => deleteMovie(data.id)}>
          <Title size={14}>
            <Ionicons name="trash" size={24} color="#fff" />
          </Title>
        </DeleteButton>
      </ActionContainer>
    </Container>
  );
}
