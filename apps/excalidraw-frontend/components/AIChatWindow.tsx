"use-client";
import {useState, useEffect, SetStateAction} from "react";
import { IconButton } from "./IconButton";
import { ArrowUpRightFromCircle } from "lucide-react";
import { postPromptToGenAIBackend } from "@/functions/postPromtToGenAIBackend";
type chat = {
    role: "user" | "ai",
    content: string
}



export function AIChatWindow(
    { onClose, aiSessionId, setAiSessionId }: { onClose: () => void, aiSessionId: string, setAiSessionId: any }) {
    const [messages, setMessages] = useState<chat[]>([
        {
            role: "ai",
            content: "Please enter the instruction to create the required drawing."
        }
    ]);

    const [inputValue, setInputValue] = useState("");
    
    return (
        <div style={{
            position: "fixed",
            bottom: 80,
            right: 30,
            width: 370,
            height: 520,
            background: "rgba(0, 191, 255, 0.4)",
            borderRadius: "18px",
            boxShadow: "18px 18px 28px rgba(0, 191, 255, 0.4), 0 12px 32px 0 rgba(0, 191, 255, 0.4)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1.5px solid #e0f7fa",
            transition: "box-shadow 0.3s cubic-bezier(.4,2,.6,1), transform 0.3s cubic-bezier(.4,2,.6,1)",
            animation: "fadeInUp 0.5s cubic-bezier(.4,2,.6,1)"
        }}
        className="ai-chat-window"
        >
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .ai-chat-window:focus-within {
                    box-shadow: 0 12px 40px 0 rgba(0,191,255,0.25), 0 2px 24px 0 rgba(0,191,255,0.18);
                    transform: scale(1.02);
                }
                .ai-chat-window input:focus {
                    outline: none;
                    border-color: #00bfff;
                    box-shadow: 0 0 0 2px #b3ecff;
                }
                .ai-chat-window::-webkit-scrollbar {
                    width: 8px;
                }
                .ai-chat-window::-webkit-scrollbar-thumb {
                    background: #e0f7fa;
                    border-radius: 4px;
                }
            `}</style>
            <div style={{
                background: "linear-gradient(90deg, rgba(0, 191, 255, 0.4) 0%, rgba(0, 0, 0, 10) 100%)",
                padding: "16px 18px 16px 20px",
                color: "white",
                fontWeight: 700,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 18,
                letterSpacing: 0.5,
                boxShadow: "0 2px 8px 0 rgba(30,144,255,0.10)",
                borderTopLeftRadius: "18px",
                borderTopRightRadius: "18px",
                userSelect: "none"
            }}>
                <span>AI Assistant</span>
                <button onClick={onClose} style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    color: "white",
                    fontSize: 22,
                    fontWeight: 700,
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    transition: "background 0.2s"
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#00bfff')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >×</button>
            </div>
            <div style={{ flex: 1, flexDirection: "column", padding: 20, overflowY: "auto", background: "rgba(245,250,255,0.95)" }}>
                <div>
                    {messages.map((message, index) => (
                        <div key={index} style={{
                            marginBottom: 12,
                            display: "flex",
                            flexDirection: message.role === "user" ? "row-reverse" : "row",
                            alignItems: "flex-start"
                        }}>
                            <div style={{
                                maxWidth: "70%",
                                padding: 10,
                                borderRadius: 12,
                                background: message.role === "user" ? "#00bfff" : "rgba(0, 220, 255, 0.4)",
                                color: message.role === "user" ? "#fff" : "#000",
                                fontWeight: 500,
                                boxShadow: "0 2px 8px rgba(0, 191, 255, 0.2)",
                                wordBreak: "break-word"
                            }}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 16,
                borderTop: "2px inset rgba(0, 191, 255, 0.4)",
                background: "rgba(255,255,255,0.98)"
            }}>
                <input
                    type="text"
                    placeholder="Type your prompt..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    style={{
                        color: "#000",
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "2.5px solid rgba(0, 191, 255, 0.4)",
                        fontSize: 15,
                        transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                />
                <IconButton
                    icon={<ArrowUpRightFromCircle />}
                    onClick={async () => {
                        if (inputValue.trim() !== "") {
                            setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
                        }
                        const isInitialPrompt = (messages.length <= 2) ? true : false;
                        const prompt = inputValue;
                        setInputValue("");
                        const aiResponse = await postPromptToGenAIBackend(prompt, isInitialPrompt, aiSessionId, setAiSessionId)
                        setMessages((prev) => [
                            ...prev, {
                                role: "ai",
                                content: aiResponse
                            }
                        ]);
                    }}
                    activated={!!inputValue.trim()}
                />
            </div>
        </div>
    );
}