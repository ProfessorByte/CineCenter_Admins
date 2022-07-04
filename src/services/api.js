import axios from "axios";

export const key = process.env.REACT_APP_TMDB_APIKEY;

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default api;
