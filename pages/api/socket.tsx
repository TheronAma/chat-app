import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiResponseServerIO } from "@/types/nextsocket"
import { Server as SockServer } from "Socket.IO";
import { Server as HTTPServer } from "https";

import { Server } from 'Socket.IO'

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
  }
  res.end()
}

export default SocketHandler

export const config = {
    api: {
      bodyParser: false
    }
}