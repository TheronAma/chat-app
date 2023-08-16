import { ChatChannel, PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"

async function getChannels() {
    const res = await fetch("http://localhost:3000/api/channel/")
    return res.json()
}

function SidebarItem (
    { channel } : { channel : ChatChannel }
) {
    return <div>
        <a href={"http://localhost:3000/chat/channel/" + channel.id}> {channel.name} </a>
    </div>
}

export default async function Sidebar (
    {} : {}
) { 
    // fetch channels and render them to screen
    const channels : ChatChannel[] = await getChannels()
    .then(result => result.channels)

    return <div className="h-full w-16 m-0 p-0
    flex flex-col flex-initial
    bg-white">
        {channels.map((channel) => {
            return <SidebarItem channel={channel}></SidebarItem>
        })}
    </div>
    
}