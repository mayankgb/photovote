import { AppBar } from "../_components/Appbar";
import { Sidebar } from "../_components/SideBar";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return(
        <div className="flex min-h-screen w-full">
            <Sidebar/>
            <div className="w-full">
                <AppBar/>
            {children}
            </div>
        </div>
    )
}