const MessageView = ({ msgs } : { msgs : string[]}) => {

    return <div>
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