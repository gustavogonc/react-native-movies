import {
  Container,
  NoContent,
  Banner,
  TitleNoContent,
  Title,
  RateContainer,
  Rate,
} from "./styles";

import { Ionicons } from "@expo/vector-icons";
export function SearchItem({ data, navigatePage }) {
  function detailMovie() {
    if (data.release_date === "") {
      alert("Filme ainda não tem data");
      return;
    }
    navigatePage(data);
  }
  return (
    <Container activeOpacity={0.7} onPress={detailMovie}>
      {data?.poster_path ? (
        <Banner
          resiMethod="resize"
          source={{
            uri: `https://image.tmdb.org/t/p/original/${data?.poster_path}`,
          }}
        />
      ) : (
        <NoContent>
          <TitleNoContent>NÃO HÁ IMAGEM DO FILME</TitleNoContent>
        </NoContent>
      )}

      <Title>{data?.title}</Title>

      <RateContainer>
        <Ionicons name="md-star" size={12} color={"#e7e74e"} />
        <Rate>{parseFloat(data?.vote_average).toFixed(2)}/10</Rate>
      </RateContainer>
    </Container>
  );
}
