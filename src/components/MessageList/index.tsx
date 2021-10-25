import { api } from '../../services/api'
import io from 'socket.io-client'
import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'

import { MESSAGES_EXAMPLE } from '../../utils/messagesSimulation'

import { useEffect, useState } from 'react'

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

//fila de mensagens (quantidade alta)
const messagesQueue: Message[] = MESSAGES_EXAMPLE;

const socket = io('http://localhost:4000')

// Refresh automático de mensagem
socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0], // mensagem mais antiga
          prevState[0], // mensagem que ja estava
          prevState[1], // nova mensagem
        ].filter(Boolean)) // remove falsy

        messagesQueue.shift(); // remove item mais antigo da lista de mensagem (para nao bugar)
      }
    }, 3000)
  }, [])

  useEffect(() => {
    // chamada para API
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImg}>
                  <img src={message.user.avatar_url} alt={message.user.name} /> {/* Envolto por uma div por conta da borda no design */}
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          )
        })}
      </ul>

    </div>
  )
}