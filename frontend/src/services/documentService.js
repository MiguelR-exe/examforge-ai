import { api } from "./api";

export const documentService = {
  // 1. Pide la URL prefirmada a nuestro backend
  getUploadUrl: ({ fileName, contentType, userId }) =>
    api.request("/documents/upload-url", {
      method: "POST",
      body: { fileName, contentType, userId },
    }),

  // 2. Sube el archivo real directo a S3 con esa URL
  uploadFile: (uploadUrl, file, userId) => api.uploadToPresignedUrl(uploadUrl, file, userId),

  // Flujo completo: pedir URL + subir el archivo
  uploadDocument: async ({ file, userId, onProgress }) => {
    onProgress?.("requesting-url");
    const { uploadUrl } = await documentService.getUploadUrl({
      fileName: file.name,
      contentType: file.type || "application/pdf",
      userId,
    });

    onProgress?.("uploading");
    await documentService.uploadFile(uploadUrl, file, userId);

    onProgress?.("processing");
    // El procesamiento (S3 -> EventBridge -> SQS -> Lambda -> Groq) es asíncrono,
    // así que aquí solo confirmamos que la subida ocurrió. El resultado se
    // refleja después en /dashboard cuando DocumentProcessor termine.
    return true;
  },
};
