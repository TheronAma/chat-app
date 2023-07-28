import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { options } from '../auth/[...nextauth]/options'

const prisma = new PrismaClient()
 
export async function GET(req : NextRequest) {
    const session = getServerSession(options)
    const { searchParams } = new URL (req.url)

    const id = searchParams.get('id') || ''
    const res = await prisma.message.findMany({
        where: {
            channelId: {
                equals: id
            }
        },
        select: {
            author: {
                select: {
                    name: true
                }
            },
            content: true
        },
        orderBy: {
            id: 'desc'
        }
    })
    
    return NextResponse.json({res})
}

export async function POST(req : NextRequest) {
    const session = await getServerSession(options)
    const data = await req.json()

    console.log(data)
    
    const email = session?.user?.email ? session?.user?.email : ''
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    console.log(user)

    const message : Prisma.MessageCreateInput = {
        content: data.content,
        author: { connect: { id: user?.id }},
        channel: { 
            connectOrCreate: { 
            where: {
                id: data.id 
            },
            create: {
                id: data.id
            }
        }
        }   
    }
    
    const createMessage = await prisma.message.create({
        data: message
    })

    return NextResponse.json({success: true})
}