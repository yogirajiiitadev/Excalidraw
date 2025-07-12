# Features to be implemented:
1) Create Agent backend (with agent asking 3 counter questions in addition to user prompt).
2) Integrate AI agent backend API in AIChatWindow and render the AIMessage and Human message properly.
3) Capture Avatar of User in backend User table after sign up, Store the User Info in User slice after creating a Redux store.
4) Show all current connected/ active users on rooms card with the help of respective registered avatars.
5) Show all live activity of connected users on the canvas via color separated shapes. With one color assigned to each avatar and show a legend which maps color to Avatar.



# Problems faced
1) During creation of GEN AI node. We hit the gen-ai api once and the gen-ai function is suppose to ask some clarifying questions on the initial prompt. However, for user to answer the clarifying questions there is no other API. It has to hit the same API, makes it difficult to mantain the contect of the conversation.
So on initial prompt, a session ID is associated the bot assigned to user in Map 
<sessionid> -> <bot>. bot is the instance of DrawingBotSession class which holds the context of conversation in its chatHistory variable and has utility methods like askNextClarifyingQuestion() and getFinalDrawing().



{
    "drawing": [
        {
            "type": "rect",
            "x": 50,
            "y": 50,
            "width": 100,
            "height": 50
        },
        {
            "type": "pencil",
            "startX": 150,
            "startY": 75,
            "endX": 250,
            "endY": 75
        },
        {
            "type": "rect",
            "x": 275,
            "y": 50,
            "width": 100,
            "height": 50
        },
        {
            "type": "pencil",
            "startX": 375,
            "startY": 75,
            "endX": 475,
            "endY": 75
        },
        {
            "type": "rect",
            "x": 500,
            "y": 50,
            "width": 100,
            "height": 50
        },
        {
            "type": "text",
            "startX": 60,
            "startY": 80,
            "font": "Arial 12px",
            "color": "#000000",
            "inputText": "Client"
        },
        {
            "type": "text",
            "startX": 285,
            "startY": 80,
            "font": "Arial 12px",
            "color": "#000000",
            "inputText": "Web Server"
        },
        {
            "type": "text",
            "startX": 515,
            "startY": 80,
            "font": "Arial 12px",
            "color": "#000000",
            "inputText": "Database"
        }
    ]
}
