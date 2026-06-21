export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

export function isPdfFile(file) {
  if (!file) return false;
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function validateRegisterForm({ name, email, password }) {
  const errors = {};
  if (!name?.trim()) errors.name = "El nombre es requerido";
  if (!isValidEmail(email)) errors.email = "Ingresa un correo válido";
  if (!isValidPassword(password)) errors.password = "Mínimo 6 caracteres";
  return errors;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Ingresa un correo válido";
  if (!password) errors.password = "Ingresa tu contraseña";
  return errors;
}