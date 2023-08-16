'use client'
import { ChatChannel, Message, User } from "@prisma/client";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { SyntheticEvent, useEffect, useState } from "react";
import io from 'socket.io-client'
function ChatMessage(
    { message } : { message : (Message & { author : User })}
) {
    return <div><b>{message.author.name}: </b>{message.content}</div>
}

// This component represents the outermost layer of chatting in a channel,
// It contains two main children - the channel messages and chat input

let socket : any

let session : Session | null

export default function ChatView(
    { channel, messages } : { channel : ChatChannel, messages : (Message & { author : User })[] }
) {
    const [chatMessages, setChatMessages] = useState<(Message & { author : User})[]>([])
    const [currentMessage, setCurrentMessage] = useState<string>('')


    useEffect(() => {socketInitializer()}, [])
    useEffect(() => {retrieveSession()}, [])

    const retrieveSession = async () => {
        session = await getSession()
    }

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io(undefined as any, {
          path: '/api/socket_io',
        })
    
        socket.on('connect', () => {
          console.log('connected successfully!')
          socket.emit('channel', channel.id)
        })

        socket.on('message', (message : { author : User, content : string }) => {
          console.log(JSON.stringify(chatMessages))
          handleReceivedMessage(message)
        })
      }

    useEffect(() => {
        console.log(messages)
        let newChatMessages = []
        for (let i = 0; i < messages.length; i++) {
            let temp = messages[i] as (Message & { author : User})
            newChatMessages.push(temp)
        }
        console.log(newChatMessages)
        setChatMessages(newChatMessages)
    }, [])

    async function sendChatMessage(messageContent : string) {
        const socketBody = {
            channel : channel,
            author : session?.user,
            content : messageContent
        }

        const reqBody = {
            content : messageContent
        }

        socket.emit("message", socketBody)
        await fetch(`http://localhost:3000/api/channel/${channel.id}`, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => res.json()).then(console.log)
    }
    
    function handleFormSubmit(event: SyntheticEvent) {
        event.preventDefault()
        sendChatMessage('sending msg test...')
    }

    function handleReceivedMessage(message : { author : User, content : string } ) {
        setChatMessages((prevChatMessages) => {
            const res = [{
                id: -1,
                author: message.author,
                content: message.content,
                channelId: channel.id,
                authorId: message.author.id
            }, ...prevChatMessages]
            return res
        })
    }

    return <div className="flex flex-auto flex-col justify-start">
        <div className="flex flex-auto flex-col-reverse overflow-y-scroll">
            {chatMessages.map((message) => {
                return <ChatMessage message={message}></ChatMessage>
            })}
        </div>
        <div className="flex flex-initial h-32">
            <textarea 
            value={currentMessage}
            onChange={(e) => {
                setCurrentMessage(e.target.value)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    sendChatMessage(currentMessage)
                    setCurrentMessage("")
                }
            }}></textarea>
        </div>
    </div>
}