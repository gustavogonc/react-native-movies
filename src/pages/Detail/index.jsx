import {
  Container,
  Header,
  HeaderButton,
  Banner,
  Title,
  ButtonLink,
  ContentArea,
  Rate,
  ListGenres,
  Description,
} from "./styles";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import api, { key } from "../../services/api";
import Stars from "react-native-stars";
import { Genres } from "../../components/Genres";
import { ScrollView } from "react-native-gesture-handler";
import { ModalLink } from "../../components/ModalLink";

import { saveMovie, hasMovie, deleteMovie } from "../../utils/storage";
import { ContainerLoading } from "../Home/styles";
export function Detail() {
  const navigation = useNavigation();
  const route = useRoute();

  const [movie, setMovie] = useState({});
  const [openLink, setOpenLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoritedMovie, setFavoritedMovie] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function getMovie() {
      const response = await api
        .get(`/movie/${route.params?.id}`, {
          params: {
            api_key: key,
            language: "pt-BR",
          },
        })
        .catch((error) => {
          console.log("erro ao chamar api ") + error;
        });

      if (isActive) {
        setMovie(response.data);
        const isFavorite = await hasMovie(response.data);
        setFavoritedMovie(isFavorite);
        setLoading(false);
      }
    }

    if (isActive) {
      getMovie();
    }

    return () => {
      isActive = false;
    };
  }, []);

  async function handleFavoriteMovie(movie) {
    if (favoritedMovie) {
      await deleteMovie(movie.id);
      setFavoritedMovie(false);
    } else {
      await saveMovie("@primereact", movie);
      setFavoritedMovie(true);
    }
  }

  return (
    <Container>
      {loading && (
        <ContainerLoading>
          <ActivityIndicator size={48} />
        </ContainerLoading>
      )}
      {!loading && (
        <>
          <Header>
            <HeaderButton
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={28} color={"#fff"} />
            </HeaderButton>
            <HeaderButton onPress={() => handleFavoriteMovie(movie)}>
              {favoritedMovie ? (
                <Ionicons name="bookmark" size={28} color={"#fff"} />
              ) : (
                <Ionicons name="bookmark-outline" size={28} color={"#fff"} />
              )}
            </HeaderButton>
          </Header>

          <Banner
            resizeMethod="resize"
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
            }}
          />

          <ButtonLink onPress={() => setOpenLink(true)}>
            <Feather name="link" size={24} color={"#fff"} />
          </ButtonLink>

          <Title numberOfLines={2}>{movie.title}</Title>

          <ContentArea>
            <Stars
              default={movie.vote_average}
              count={10}
              half={true}
              starSize={20}
              fullStar={<Ionicons name="md-star" size={24} color={"#E7A74e"} />}
              emptyStar={
                <Ionicons name="md-star-outline" size={24} color={"#E7A74e"} />
              }
              halfStar={
                <Ionicons name="md-star-half" size={24} color={"#E7A74e"} />
              }
              disabled={true}
            />
            <Rate>{parseFloat(movie.vote_average).toFixed(2)}/10</Rate>
          </ContentArea>

          <ListGenres
            data={movie.genres}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <Genres data={item.name} />}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Title>Descrição</Title>
            <Description>{movie?.overview}</Description>
          </ScrollView>

          <Modal animationType="slide" transparent={true} visible={openLink}>
            <ModalLink
              link={movie?.homepage}
              title={movie?.title}
              closeModal={() => setOpenLink(false)}
            />
          </Modal>
        </>
      )}
    </Container>
  );
}
