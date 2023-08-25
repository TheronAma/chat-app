import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { PrismaClient, Prisma, User, ChatChannel } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { options } from '../auth/[...nextauth]/options'

const prisma = new PrismaClient()

export async function GET(req : NextRequest) {
    const session = await getServerSession(options).catch(err => console.log(err))
    .catch((err) => {
        console.log(err)
    })

    const res : ChatChannel[] = await prisma.chatChannel.findMany({
    }).catch((err) => {
        console.log(err)
        return []
    })

    return NextResponse.json({ channels : res })
}

export async function POST(req : NextRequest) {
    const session = await getServerSession(options).catch(err => console.log(err))
    // expect data to be - 
    const data = await req.json().catch(err => console.log(err))
    const userIds = data.userIds
    const image = data.image

    console.log(session?.user)

    if (!session?.user) {
        return NextResponse.json({success: false, channel: {}})
    }

    if (session.user?.id) {
        console.log([{id : session?.user.id}, ...(userIds.map((userId : string) => {return {id: userId}}))])
        const result = 
        await prisma.chatChannel.create({
            data: {
                users: {
                    connect: [{id : session?.user.id}, ...(userIds.map((userId : string) => {return {id: userId}}))]
                },
                name: data.name,
                image: data.image,
                owner: {
                    connect: {id: session.user.id}
                }
            }
        }).catch(err => {
            console.log(err)
        })
        return NextResponse.json({ success: true, channel: result})
    }
    return NextResponse.json({success: false, channel: {}})
}
