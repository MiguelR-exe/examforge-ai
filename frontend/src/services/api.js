import { API_BASE_URL } from "../utils/constants";
import { storage } from "../utils/storage";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = storage.getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // algunos endpoints (ej. PUT a S3) responden sin body
  }

  if (!response.ok) {
    const message = data?.error || "Algo salió mal, intenta de nuevo.";
    throw new ApiError(message, response.status, data);
  }

  return data;
}

// Sube un archivo binario directo a S3 usando la URL prefirmada.
// No pasa por nuestro API, así que es un fetch aparte sin el wrapper de arriba.
async function uploadToPresignedUrl(uploadUrl, file, userId) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/pdf",
      "x-amz-meta-userid": userId,
    },
    body: file,
  });

  if (!response.ok) {
    throw new ApiError("No se pudo subir el archivo a almacenamiento.", response.status);
  }
  return true;
}

export const api = { request, uploadToPresignedUrl, ApiError };