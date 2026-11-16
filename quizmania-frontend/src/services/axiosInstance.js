import axios from "axios"; //Importa a biblioteca axios
import { reactive } from "vue";

const baseURL = "http://localhost:3000"; //URL base de acesso a API

const axiosInstance = axios.create({
  baseURL: baseURL, //Define a URL base de acesso a API
  timeout: 60000, //Define o tempo (em ms) máximo de espera por uma resposta da API (maior por causa do envio de fotos e vídeos)
  headers: { //Define que os cabeçalhos das requisições vão ser enviados em formato JSON
    "Content-Type": "application/json"
  }
});

//Usuário logado (salvo no localStorage para continuar logado ao recarregar a página)
const sessao = reactive({
  usuario: JSON.parse(localStorage.getItem("usuario") || "null"),
  token: localStorage.getItem("token") || ""
});

function entrar(usuario, token) {
  sessao.usuario = usuario;
  sessao.token = token;
  localStorage.setItem("usuario", JSON.stringify(usuario));
  localStorage.setItem("token", token);
}

function atualizarUsuario(usuario) {
  sessao.usuario = usuario;
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

function sair() {
  sessao.usuario = null;
  sessao.token = "";
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
}

//Envia o token do usuário logado em todas as requisições
axiosInstance.interceptors.request.use((config) => {
  if (sessao.token) {
    config.headers.Authorization = `Bearer ${sessao.token}`;
  }
  return config;
});

//Token inválido ou expirado: desloga
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && sessao.token) {
      sair();
    }
    return Promise.reject(error);
  }
);

//Arquivos enviados ficam na API (/uploads/...); links externos ficam como estão
function urlArquivo(caminho) {
  if (!caminho) return "";
  return caminho.startsWith("/uploads/") ? baseURL + caminho : caminho;
}

export { sessao, entrar, atualizarUsuario, sair, urlArquivo };
export default axiosInstance;
