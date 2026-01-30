const uploads: Map<string, string[]> = new Map();

export function addUpload(sessionId: string, url: string) {
  const list = uploads.get(sessionId) || [];
  list.push(url);
  uploads.set(sessionId, list);
}

export function getUploads(sessionId: string) {
  return uploads.get(sessionId) || [];
}

export function clearUploads(sessionId: string) {
  uploads.delete(sessionId);
}

export default { addUpload, getUploads, clearUploads };
