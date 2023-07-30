import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { options } from '../auth/[...nextauth]/options'

const prisma = new PrismaClient()

export async function GET(req : NextRequest) {
    const session = await getServerSession()
    const email = session?.user?.email ? session?.user?.email : ''
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    const { searchParams } = new URL (req.url)

    const result = email == '' ? await prisma.chatChannel.findMany() : 
    await prisma.chatChannel.findMany({
        include: {
            users: true
        },
        where: {
            users: {
                some: {
                    id: user?.id
                }
            }
        }
    })

    return NextResponse.json({ channels : result })
}

export async function POST(req : NextRequest) {
    const session = await getServerSession()
    const email = session?.user?.email ? session?.user?.email : ''

    const result = 
    await prisma.chatChannel.create({
        data: {
            users: {
                connect: {email: email}
            }
        }
    })

    return NextResponse.json({ channels : result })
}

