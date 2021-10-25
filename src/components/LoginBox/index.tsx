import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc'
import { AuthContext } from '../../context/auth';
import { api } from '../../services/api';

import styles from "./styles.module.scss"

export function LoginBox() {
  const { signInUrl } = useContext(AuthContext); // utilizando o contexto de autenticação

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" /> {/*Se torna um svg, logo Github*/}
        Entrar com github
      </a>
    </div>
  )
}