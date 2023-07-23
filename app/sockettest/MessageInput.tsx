import { useRef } from 'react'
const MessageInput = ( {msg, setMsg, sendMessage} : {msg : string, setMsg : (msg: string) => void, sendMessage : (msg: string) => void} ) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    
    return <div className = "sticky fixed absolute z-10">
    <textarea className = "object-center object-bottom"
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