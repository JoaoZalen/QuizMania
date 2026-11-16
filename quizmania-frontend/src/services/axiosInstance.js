import axios from "axios"; //Importa a biblioteca axios

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", //Define a URL base de acesso a API
  timeout: 15000, //Define o tempo (em ms) máximo de espera por uma resposta da API
  headers: { //Define que os cabeçalhos das requisições vão ser enviados em formato JSON
    "Content-Type": "application/json"
  }
});

export default axiosInstance;
