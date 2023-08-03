import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { options } from '../../auth/[...nextauth]/options'

const prisma = new PrismaClient()

export async function GET(req : NextRequest, { params } : { params: { id : string } }) {
    const session = await getServerSession(options).catch(console.log)
    const messages = await prisma.message.findMany({
        where: {
            channelId: params.id
        },
        orderBy: {
            id: 'desc'
        }
    }).catch(console.log)
    return NextResponse.json(messages)
}

export async function POST(req : NextRequest, { params } : { params: { id : string } }) {
    const session = await getServerSession(options).catch(console.log)
    const data = await req.json().catch(console.log)
    const message = prisma.message.create({
        data: {
            channel: {connect: {id: params.id}},
            author: {connect: {id: session?.user?.id || ''}},
            content: data.content
        }
    }).catch(console.log)
    return NextResponse.json(message)
}

export async function PUT(req : NextRequest, { params }: { params: {id : string}}) {
    return NextResponse.json({success: true})
}

export async function DELETE(req : NextRequest, { params } : {params : {id : string}}) {
    const session = await getServerSession(options).catch(console.log)
    const channel = await prisma.chatChannel.findUnique({
        where: {
            id : params.id
        },
        select: {
            owner: true
        }
    }).catch(console.log)

    if (channel?.owner.id == session?.user?.id) {
        const result = await prisma.chatChannel.delete({
            where: {
                id: params.id
            }
        })
        return NextResponse.json(result)
    } else {
        return NextResponse.json({})
    }
}


