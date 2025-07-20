import { ReactNode } from "react";

export function IconButton({icon, onClick, activated, disabled}:{icon: ReactNode, onClick: ()=>void, activated: boolean, disabled?: boolean}){
    return <button className={`m-2 cursor-pointer rounded-xl border p-2 bg-black hover:bg-gray-500 ${activated ? "text-blue-400" : "text-white"} `} onClick={onClick} disabled={disabled}>
        {icon}      
    </button>
}