import mammoth from 'mammoth'

// Gemini can read PDFs directly as inline file data, but not .docx — so for
// Word docs we extract plain text ourselves and fold it into the prompt text.
export async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export const SUPPORTED_MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}
