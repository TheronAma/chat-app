import { useRef } from 'react'
const MessageInput = ( {msg, setMsg, sendMessage} : {msg : string, setMsg : (msg: string) => void, sendMessage : (msg: string) => void} ) => {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    
    return <div>
    <textarea
        onChange={(e) => {
            setMsg(e.target.value)
        }}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                sendMessage(msg)
                if (inputRef.current) {
                    inputRef.current.value = ""
                }
            }
        }}>
    </textarea>
    </div>
}

export default MessageInput