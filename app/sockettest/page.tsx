'use client'
import { useEffect } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'
import MessageView from './MessageView'
import MessageInput from './MessageInput'

let socket : any

const Home = () => {
    const [messages, setMessages] = useState<string[]>([])
    const [msg, setMsg] = useState<string>("")

    useEffect(() => {socketInitializer()}, [])

    useEffect(() => {
      console.log("second useEffect()")
      fetch('http://localhost:3000/api/chat?id=1')
        .then((response) => response.json())
        .then((data) => {
          let newMsgs = []
          console.log(data)
          const res = data.res
          console.log(res) 
          for (let elem of res) {
            const author = elem.author.name
            const content = elem.content
            newMsgs.push(author + ": " + content)
          }
          console.log(newMsgs)
          setMessages(newMsgs)
        })
    }, [])

    


    const sendMessage = (m : string) : void => {
        fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            content: m,
            id: '1',
          }),
          headers: {
            "content-type": "application/json"
          },
        })
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