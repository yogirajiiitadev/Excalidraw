const sessions = new Map(); // sessionId → DrawingBotSession(class instance)

export function createSession(sessionId, botSession) {
  sessions.set(sessionId, botSession);
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
