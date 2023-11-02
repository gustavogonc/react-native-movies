import {
  Container,
  SearchContainer,
  SearchButton,
  Input,
  Title,
  BannerButton,
  Banner,
  SliderMovie,
  ContainerLoading,
} from "./styles";
import { Header } from "../../components/Header";
import { Feather } from "@expo/vector-icons";
import { ScrollView, ActivityIndicator } from "react-native";
import { SliderItem } from "../../components/SliderItem";
import { useState, useEffect } from "react";
import api, { key } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { getListMovies, randomBanner } from "../../utils/movie";

export function Home() {
  const [nowMovies, setNowMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerMovie, setBannerMovie] = useState({});

  const [input, setInput] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    let isActive = true;

    const ac = new AbortController();

    async function getMovies() {
      const [nowData, popularData, topData] = await Promise.all([
        api.get("/movie/now_playing", {
          params: {
            api_key: key,
            language: "pt-BR",
            page: 1,
          },
        }),
        api.get("/movie/popular", {
          params: {
            api_key: key,
            language: "pt-BR",
            page: 1,
          },
        }),
        api.get("/movie/top_rated", {
          params: {
            api_key: key,
            language: "pt-BR",
            page: 1,
          },
        }),
      ]);

      if (isActive) {
        const nowList = getListMovies(10, nowData.data.results);
        const popularList = getListMovies(5, popularData.data.results);
        const topList = getListMovies(5, topData.data.results);

        setBannerMovie(
          nowData.data.results[randomBanner(nowData.data.results)]
        );
        setNowMovies(nowList);
        setPopularMovies(popularList);
        setTopMovies(topList);
        setLoading(false);
      }
    }

    getMovies();

    return () => {
      isActive = false;
      ac.abort();
    };
  }, []);

  function navigateDetailsPage(item) {
    navigation.navigate("Detail", { id: item.id });
  }

  function handleSearchMovie() {
    if (input === "") {
      return;
    }
    navigation.navigate("Search", { name: input });
    setInput("");
  }

  if (loading) {
    return (
      <ContainerLoading>
        <ActivityIndicator size={48} />
      </ContainerLoading>
    );
  }
  return (
    <Container>
      <Header title="React Prime" />
      <SearchContainer>
        <Input
          placeholder="Ex Vingadores"
          placeholderTextColor={"#ddd"}
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <SearchButton onPress={handleSearchMovie}>
          <Feather name="search" size={30} color="#fff" />
        </SearchButton>
      </SearchContainer>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Em cartaz</Title>

        <BannerButton
          activeOpacity={0.9}
          onPress={() => navigateDetailsPage(bannerMovie)}
        >
          <Banner
            resizeMethod="resize"
            source={{
              uri: `https://image.tmdb.org/t/p/original/${bannerMovie.backdrop_path}`,
            }}
          />
        </BannerButton>

        <SliderMovie
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={nowMovies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SliderItem
              data={item}
              navigatePage={() => navigateDetailsPage(item)}
            />
          )}
        />

        <Title>Populares</Title>

        <SliderMovie
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={popularMovies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SliderItem
              data={item}
              navigatePage={() => navigateDetailsPage(item)}
            />
          )}
        />

        <Title>Mais votados</Title>

        <SliderMovie
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={topMovies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <SliderItem
              data={item}
              navigatePage={() => navigateDetailsPage(item)}
            />
          )}
        />
      </ScrollView>
    </Container>
  );
}
