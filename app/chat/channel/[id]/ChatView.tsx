'use client'
import { ChatChannel, Message, User } from "@prisma/client";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { SyntheticEvent, useEffect, useState } from "react";
import io from 'socket.io-client';
import React from "react";
import styles from "./styles.module.css";

function ChatMessage(
    { message } : { message : (Message & { author : User })}
) {
    /*
        TODO: include image
        reformat messages and text
        simple font changes
        rescaling size?
    */
    
    const pfp = ((message.author.image != null) ? (message.author.image) : "./fist.png")

    return <div style = {{padding:"1vh"}} className = {`flex ${styles.messageStyle}`}>
                <img style = {{marginRight:"1vh",width:"30px",height:"30px"}}className = "rounded-full" src = {pfp}/> 
                <div> 
                    <div style = {{maxWidth:"50%"}}> <b>{message.author.name}: </b></div>
                    <div style = {{maxWidth:"90%",overflowWrap: "break-word"}}> <p> {message.content} </p> </div>
                </div>   
            </div>
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

    return <div className="flex flex-auto flex-col justify-start" style = {{background:"#282C34", color:"white"}}>
        <div className="flex flex-auto flex-col-reverse overflow-y-scroll">
            {chatMessages.map((message) => {
                return <ChatMessage message={message}></ChatMessage>
            })}
        </div>
        <div style = {{display:"flex",background:"#252931"}} className = "h-64">
            <div style = {{flexGrow:"1"}} className = {`flex flex-initial ${styles.textComponent}`}>
                <textarea placeholder = "Message" style = {{backgroundColor:"#282C34", width:"100%",height: "6vh" ,fontSize: "1em", justifyContent: "center"}} className = {`${styles.textArea}`} 
                value={currentMessage}
                onChange={(e) => {
                    setCurrentMessage(e.target.value)
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendChatMessage(currentMessage)
                        setCurrentMessage('')
                    }
                }}></textarea>
                
                <div></div>
            </div>
            <div style = {{display:"flex"}} className = {`${styles.textComponent}`}>
                    <img src = "./fist.png" style = {{width:"50px",height:"50px"}} 
                    onClick={() => {
                        sendChatMessage(currentMessage)
                        setCurrentMessage('')
                    }}/>
            </div>
        </div>
    </div>
}