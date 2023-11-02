import axios from "axios";

export const key = "a3ed114114b3bbec0b9b6854f480f89b";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default api;
