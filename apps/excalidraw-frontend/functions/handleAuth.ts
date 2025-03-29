import { HTTP_BACKEND } from "@/config";
import axios from "axios";
// import { useRouter } from 'next/navigation';

export async function handleAuth(email: string, password: string, isSignin: boolean, setErr: any, name?: string) {
    // const router = useRouter();
    try {
        const reqBody = isSignin 
            ? {
                username: email,
                password,
            } : {
                name,
                username: email,
                password
            };
        const authUrl = isSignin ? `${HTTP_BACKEND}/signin` : `${HTTP_BACKEND}/signup`;
        const response = await axios.post(authUrl, reqBody); 
        localStorage.setItem("token", `Bearer ${response.data.token}`);
        // router.push('/dashboard');
        return { msg: "", success: true };
    } catch (error: any) {
        console.error("Authentication error:", error);
        setErr(true);
        
        if(error.response.status === 400) {
            console.log("400 error");
            return { msg: error.response?.data?.error.issues[0].message || "Invalid credentials or User not available", success: false };
        }      
        else if (error.response.status !== 200) {
            return { msg: isSignin ? "incorrect credentials entered" : "unique constraint failed", success: false };
        }
        return {msg: "An unexpected error occurred", success: false};
    }
}