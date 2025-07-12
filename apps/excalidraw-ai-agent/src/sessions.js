const sessions = new Map(); // sessionId → DrawingBotSession(class instance)

export function createSession(sessionId, botSession) {
  sessions.set(sessionId, botSession);
  console.log("Sessions after createSession: ", sessions);
}

export function getSession(sessionId) {
  console.log("Sessions after getSessions: ", sessions);
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
  console.log("Sessions after deleteSession: ", sessions);
}
