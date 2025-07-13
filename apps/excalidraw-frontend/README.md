# Features to be implemented:
1) Create Agent backend (with agent asking 3 counter questions in addition to user prompt).
2) Integrate AI agent backend API in AIChatWindow and render the AIMessage and Human message properly.
3) Capture Avatar of User in backend User table after sign up, Store the User Info in User slice after creating a Redux store.
4) Show all current connected/ active users on rooms card with the help of respective registered avatars.
5) Show all live activity of connected users on the canvas via color separated shapes. With one color assigned to each avatar and show a legend which maps color to Avatar.
6) Instead of adding drawing on top of existing drawing. Remove the initial human generated shapes and only add new AI generated shapes on canvas.
7) Give the option to the user to pass on the current drawing as the context to the ChatBot conversation and build the drawing on top of that.
8) Update the loader component to something more fancy. Also, update the loader in chatbot while the further message is being fetched and drawing is being generated.



# Problems faced
1) During creation of GEN AI node. We hit the gen-ai api once and the gen-ai function is suppose to ask some clarifying questions on the initial prompt. However, for user to answer the clarifying questions there is no other API. It has to hit the same API, makes it difficult to mantain the contect of the conversation.
So on initial prompt, a session ID is associated the bot assigned to user in Map 
<sessionid> -> <bot>. bot is the instance of DrawingBotSession class which holds the context of conversation in its chatHistory variable and has utility methods like askNextClarifyingQuestion() and getFinalDrawing().