'use client'
import { useEffect } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'
import MessageView from './MessageView'
import MessageInput from './MessageInput'

let socket : any

const Home = () => {
    useEffect(() => {socketInitializer()}, [])

    const [messages, setMessages] = useState<string[]>([])
    const [msg, setMsg] = useState<string>("")


    const sendMessage = (m : string) : void => {
        socket.emit('message', m)
    } 
  
    const socketInitializer = async () => {
      await fetch('/api/socket')
      socket = io(undefined as any, {
        path: '/api/socket_io',
      })
  
      socket.on('connect', () => {
        console.log('connected successfully!')
      })

      socket.on('message', (msg : string) => {
        setMessages(prevMessages => {
            const res = prevMessages.concat(msg)
            return res})
        console.log("received msg: " + msg)
      })
    }
  
    return (<main style = {{overflow:'hidden',position:'relative'}}>
        <div>
          <MessageView msgs={messages}></MessageView>
          <MessageInput msg={msg} setMsg={setMsg} sendMessage={sendMessage}></MessageInput>
        </div>
    </main>)
  }
  
  export default Home;