// Lógica e responsabilidade de controlar a autenticação da aplicação;
// Provem informações necessárias para cada elemento em diferentes níveis;
// Compartilhamento de infos.
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode; // qualquer coisa aceitável pelo react
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null); ``
  const [isLoading, setIsLoading] = useState(false);


  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=4b31598c34ca1ab68f85`;

  async function signIn(githubCode: string) {
    setIsLoading(true)
    const response = await api.post<AuthResponse>('authenticate', { // irá retornar dados e token do usuário
      code: githubCode
    })

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token); // armazenando token no localStorage

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
    setIsLoading(false);
  }

  async function signOut() {
    setIsLoading(true)
    setUser(null);
    localStorage.removeItem('@dowhile:token')
    setIsLoading(false);
  }

  // Preciso enviar o token junto com a requisição (no cabeçalho);
  // Manter o usuário logado após refresh.
  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      // Toda requisiçao daqui pra frente vá automaticamente com o token de autenticação no cabeçalho
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      // Salvar dados dentro da requisição
      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }
  }, [])

  // pegar código de login para passar pro back-end
  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=') // verificando se a url possui o parametro

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')  // divide minha url em duas strings

      window.history.pushState({}, '', urlWithoutCode) // remover o código da url

      signIn(githubCode) // enviando código ao back-end
    }
  }, [])

  // Retorna um componente que vem de dentro do contexto.
  // Provider permite que todos os componentes que estejam dentro dele tenham acesso à info do contexto.
  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut, isLoading }}>
      {props.children}
    </AuthContext.Provider>
  )
}