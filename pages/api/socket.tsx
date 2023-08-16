import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiResponseServerIO } from "@/types/nextsocket"
import { Server as SockServer } from "Socket.IO";
import { Server as HTTPServer } from "https";

import { Server } from 'Socket.IO'
import { ChatChannel, User } from '@prisma/client';

const SocketHandler = (req : NextApiRequest, res : NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SockServer(res.socket.server as any, {
        path: "/api/socket_io",
        addTrailingSlash: false
    })
    res.socket.server.io = io
    io.on('connection', (socket) => {
        // socket.emit('message', 'world!')
        socket.on('message', ({ channel , author, content } : 
        { channel : ChatChannel, author : User , content : string}) => {
          io.to(channel.id).emit('message', { author , content })
        }) 

        socket.on('channel', (id : string) => { 
          console.log("received channel: " + id) 
          socket.join(id)
        })
    })
  }
  res.end()
}

export default SocketHandler

export const config = {
    api: {
      bodyParser: false
    }
}