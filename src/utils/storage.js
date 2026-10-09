const STORAGE_KEY = "preptrack.questions.v1";
const MACHINE_KEY = "preptrack.machine-coding.v1";

export function loadQuestions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQuestions(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error("Unable to save questions to LocalStorage:", error);
  }
}

export function loadMachineStatus() {
  try {
    return localStorage.getItem(MACHINE_KEY) || "Not Started";
  } catch {
    return "Not Started";
  }
}

export function saveMachineStatus(status) {
  try {
    localStorage.setItem(MACHINE_KEY, status);
  } catch (error) {
    console.error("Unable to save machine-coding status:", error);
  }
}
