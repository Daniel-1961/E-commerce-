// src/utils/validators.js
export const isValidEmail = (s) => /\S+@\S+\.\S+/.test(s);

export function validateRegister({ name, email, password }) {
  if (!name || !name.trim()) return "Name is required";
  if (!isValidEmail(email)) return "Enter a valid email";
  if (!password || password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateLogin({ email, password }) {
  if (!isValidEmail(email)) return "Enter a valid email";
  if (!password || password.length === 0) return "Password is required";
  return null;
}
