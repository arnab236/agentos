import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const sendQuery = async (question) => {
  const res = await API.post("/solve", { question });
  return res.data;
};