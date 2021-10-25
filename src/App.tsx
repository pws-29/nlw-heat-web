import styles from "./App.module.scss"
import { MessageList } from "./components/MessageList"
import { LoginBox } from "./components/LoginBox"
import { SendMessageForm } from "./components/SendMessageForm"

import Spinner from "react-activity/dist/Spinner";
import "react-activity/dist/Spinner.css";

import { useContext } from "react"
import { AuthContext } from "./context/auth"

export function App() {
  const { user, isLoading } = useContext(AuthContext)

  return (
    <>

      {isLoading &&
        <div className={styles.modal}>
          <div className={styles.activity}>
            <Spinner color="blue" size={32} />
          </div>
        </div>}

      <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
        <MessageList />
        {!!user ? <SendMessageForm /> : <LoginBox />}
      </main>


    </>
  )
}

