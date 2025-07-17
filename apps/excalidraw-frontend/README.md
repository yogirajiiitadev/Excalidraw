# Features to be implemented:
- [x] Create Agent backend (with agent asking 3 counter questions in addition to user prompt).
- [x] Integrate AI agent backend API in AIChatWindow and render the AIMessage and Human message properly.
- [ ] Enable OAuth/NextAuth using Signin with Google and make the routes protected.
- [ ] Capture Avatar of User in backend User table after sign up, Store the User Info in User slice after creating a Redux store.
- [ ] Show all current connected/ active users on rooms card with the help of respective registered avatars.
- [ ] Show all live activity of connected users on the canvas via color separated shapes. With one color assigned to each avatar and show a legend which maps color to Avatar.
- [ ] Instead of adding drawing on top of existing drawing. Remove the initial human generated shapes and only add new AI generated shapes on canvas.
- [ ] Give the option to the user to pass on the current drawing as the context to the ChatBot conversation and build the drawing on top of that.
- [ ] Update the loader component to something more fancy. Also, update the loader in chatbot while the further message is being fetched and drawing is being generated.
- [ ] Create a 'Delete' shape. This draws a dotted quadrilateral. Checks and enlists all the existing shapes that fall in this internal area of quadrilateral. Finally removes all of them. Need to add a new endpoint in web-socket backend to delete the shape.
- [ ] Enhance the UI and make color theme consistent in Canvas and Landing page. Make the canvas Downloadable in JPEG format and provide the user the option to download.



# Problems faced
1) During creation of GEN AI node. We hit the gen-ai api once and the gen-ai function is suppose to ask some clarifying questions on the initial prompt. However, for user to answer the clarifying questions there is no other API. It has to hit the same API, makes it difficult to mantain the contect of the conversation.
So on initial prompt, a session ID is associated the bot assigned to user in Map 
<sessionid> -> <bot>. bot is the instance of DrawingBotSession class which holds the context of conversation in its chatHistory variable and has utility methods like askNextClarifyingQuestion() and getFinalDrawing().