import ChatView from "./ChatView"

export default async function ChatChannel(
    { params } : { params : { id : string } }
) {
    const channel = await fetch(`http://localhost:3000/api/channel/${params.id}`, { cache: 'no-store' }).then((res) => res.json())
    const users = channel.users
    const messages = channel.messages

    return <div className="flex flex-auto justify-start">
        <ChatView channel={channel} messages={messages}></ChatView>
    </div>
}