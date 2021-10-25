// configuração do serviço que vai conectar com o Back-end;
// Transacionar as mensagens entre Front-end, web e Back-end;
// Utilizamos Axios, cliente de requiseições HTTP;
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000'
})