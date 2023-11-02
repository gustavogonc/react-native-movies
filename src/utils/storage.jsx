import AsyncStorage from "@react-native-async-storage/async-storage";

// Buscar os filmes salvos

export async function getMoviesSave(key) {
  const myMovies = await AsyncStorage.getItem(key);

  let moviesSave = JSON.parse(myMovies) || [];

  return moviesSave;
}

//Salvar um novo filme

export async function saveMovie(key, newMovie) {
  let moviesStored = await getMoviesSave(key);

  //Se tiver algum filme com mesmo id ou duplicado retorna true, precisamos ignorar
  const hasMovie = moviesStored.some((item) => item.id === newMovie.id);

  if (hasMovie) {
    return;
  }

  moviesStored.push(newMovie);

  await AsyncStorage.setItem(key, JSON.stringify(moviesStored));
}

// Deletar algum filme especifico
export async function deleteMovie(id) {
  let moviesStored = await getMoviesSave("@primereact");

  const myMovies = moviesStored.filter((item) => {
    return item.id !== id;
  });

  await AsyncStorage.setItem("@primereact", JSON.stringify(myMovies));

  return myMovies;
}

// Filtrar algum filme se já está salvo

export async function hasMovie(movie) {
  let moviesStored = await getMoviesSave("@primereact");

  const hasMovie = moviesStored.find((item) => item.id === movie.id);

  if (hasMovie) {
    return true;
  }

  return false;
}
