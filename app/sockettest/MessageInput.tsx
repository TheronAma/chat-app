import { useRef } from 'react'
const MessageInput = ( {msg, setMsg, sendMessage} : {msg : string, setMsg : (msg: string) => void, sendMessage : (msg: string) => void} ) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    
    return <div>
    <textarea
        ref = {inputRef}
        onChange={(e) => {
            setMsg(e.target.value)
        }}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                sendMessage(msg)
            }
        }}
        onKeyUp={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                if (inputRef.current) {
                    inputRef.current.value = ""
                }
            }
        }}>
    </textarea>
    </div>
}

export default MessageInput