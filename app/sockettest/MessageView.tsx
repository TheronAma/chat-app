
const MessageView = ({ msgs } : { msgs : string[]}) => {
    return <div className = "h-screen flex-col-reverse" style = {{display:'flex',overflowY:'auto'}}>
        <ul>
        {msgs.map((msg : string) => {
            return <><li>
                {msg}
                </li></>
        })}
        </ul>
    </div>
}

export default MessageView