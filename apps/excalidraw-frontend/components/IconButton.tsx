import { ReactNode } from "react";

export function IconButton({icon, onClick, activated}:{icon: ReactNode, onClick: ()=>void, activated: boolean}){
    return <button className={`m-2 pointer rounded-xl border p-2 bg-black hover:bg-gray-500 ${activated ? "text-blue-400" : "text-white"}`} onClick={onClick}>
        {icon}      
    </button>
}