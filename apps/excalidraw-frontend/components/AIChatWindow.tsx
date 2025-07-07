"use-client";

export function AIChatWindow({ onClose }: { onClose: () => void }) {
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
            <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "rgba(245,250,255,0.95)" }}>
                <p style={{ color: "#5a7fa8", fontWeight: 500, marginBottom: 12 }}>How can I help you with your drawing?</p>
            </div>
            <div style={{ padding: 16, borderTop: "2px inset rgba(0, 191, 255, 0.4)", background: "rgba(255,255,255,0.98)" }}>
                <input
                    type="text"
                    placeholder="Type your prompt..."
                    color="rgba(0, 191, 255, 0.4)"
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "2.5px solid rgba(0, 191, 255, 0.4)",
                        fontSize: 15,
                        transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                />
            </div>
        </div>
    );
}