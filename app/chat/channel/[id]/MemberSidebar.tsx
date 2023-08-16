import { ChatChannel, User } from '@prisma/client'

function MemberListItem(
    { user } : { user : User}
) {
    return <div>
        <p>{user.name}</p>
    </div>
}

export default function MemberList(
    {users} : {users : User[]}
) {
    
    return <div className="flex flex-initial flex-col flex-nowrap overflow-y-scroll bg-slate-500">
        {users.map((user)=>{
            return <MemberListItem user={user}></MemberListItem>
        })}
    </div>
}