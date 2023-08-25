import { ChatChannel, PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"


async function getChannels() {
    const res = await fetch("http://localhost:3000/api/channel/")
    return res.json()
}

function SidebarItem (
    { channel } : { channel : ChatChannel }
) {
    return <div className="text-xl text-zinc-400 hover:bg-gray-400/40 hover:text-zinc-300" >
        <a href={"http://localhost:3000/chat/channel/" + channel.id}>
          <div> 
            {channel.name} 
          </div> 
        </a>
    </div>
}

export default async function Sidebar (
    {} : {}
) { 
    // fetch channels and render them to screen
    const channels : ChatChannel[] = await getChannels()
    .then(result => result.channels)    

    const session = await getServerSession().catch(console.log);

    return <div className="flex h-full w-full max-w-xs grow flex-col gap-y-3 overflow-y-auto border-r border-gray-200 bg-gray-700 px-6">
        <div className ='text-lg font-semibold leading-10 text-zinc-400'>
          // Current Channel
        </div>
        <div className ='text-sm font-semibold leading-10 text-zinc-400'>
          Your chat channels
        </div>
        
        {channels.map((channel) => {
            return <SidebarItem channel={channel}></SidebarItem>
        })}

        <div className="-mx-6 mt-auto flex">
            <img src={session?.user?.image!} alt="profile picture"></img>
        </div>
    </div>
    
}