import Sidebar from "./Sidebar";

export default function ChatLayout(
    { children } : { children : React.ReactNode }
) {
    return <main className="h-screen flex justify-start">
        <Sidebar />
        {children}
        
    </main>
}