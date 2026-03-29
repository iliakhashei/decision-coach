export type AuthUser = {
  user_id: number;
  name: string;
  email: string;
};

const USER_KEY = "decision_coach_user";

export function saveUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getUserId(): number | null {
  const user = getUser();
  return user ? user.user_id : null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}