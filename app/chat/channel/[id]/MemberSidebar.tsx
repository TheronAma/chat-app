import { ChatChannel, User } from '@prisma/client'

function MemberListItem(
    { user } : { user : User}
) {
    return <div className='text-lg font-semibold text-zinc-400 hover:bg-gray-400/40'>
        <p>{user.name}</p>
    </div>
}

export default function MemberList(
    {users} : {users : User[]}
) {
    
    return <div className="h-full w-full max-w-xs grow flex flex-initial flex-col flex-nowrap overflow-y-scroll bg-gray-700 gap-y-3 border-l border-gray-200 bg-gray-700 px-6">
        <div className='text-lg font-semibold leading-10 text-zinc-400'>
            Member List
        </div>
        {users.map((user)=>{
            return <MemberListItem user={user}></MemberListItem>
        })}
    </div>
}