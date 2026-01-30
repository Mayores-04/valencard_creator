const uploads: Map<string, string[]> = new Map();
const deleted: Map<string, Set<string>> = new Map();

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
  deleted.delete(sessionId);
}

export function markDeleted(sessionId: string, url: string) {
  const set = deleted.get(sessionId) || new Set<string>();
  set.add(url);
  deleted.set(sessionId, set);
}

export function getDeleted(sessionId: string) {
  return deleted.get(sessionId) || new Set<string>();
}

export default { addUpload, getUploads, clearUploads, markDeleted, getDeleted };
