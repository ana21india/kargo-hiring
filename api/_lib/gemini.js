const MODEL = 'gemini-3.6-flash'

// Calls Gemini with a text prompt plus an optional inline file (PDF/image),
// so the model reads the CV directly instead of relying on brittle text
// extraction — it can still quote exact lines back for the rubric.
export async function callGeminiWithFile(apiKey, prompt, file) {
  const parts = []
  if (file?.base64 && file?.mimeType === 'application/pdf') {
    parts.push({ text: prompt })
    parts.push({ inline_data: { mime_type: file.mimeType, data: file.base64 } })
  } else if (file?.text) {
    // Non-PDF (e.g. docx) — fold the already-extracted plain text into the prompt.
    parts.push({ text: `${prompt}\n\n--- CV TEXT ---\n${file.text}\n--- END CV TEXT ---` })
  } else {
    parts.push({ text: prompt })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  const candidate = data.candidates?.[0]
  if (candidate?.finishReason === 'SAFETY') {
    throw new Error('Gemini blocked the response for safety reasons')
  }
  const text = candidate?.content?.parts?.map((p) => p.text || '').join('') || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`Gemini returned no JSON block: ${text.slice(0, 300)}`)
  return JSON.parse(match[0])
}
