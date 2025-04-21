// List of supported languages with their codes
export const SUPPORTED_LANGUAGES = [
  // Indian languages
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "ta", name: "Tamil" },
  { code: "ur", name: "Urdu" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "as", name: "Assamese" },
  { code: "or", name: "Odia" },
  { code: "sa", name: "Sanskrit" },
  { code: "sd", name: "Sindhi" },
  { code: "ks", name: "Kashmiri" },
  { code: "ne", name: "Nepali" },
  { code: "si", name: "Sinhala" },
  { code: "doi", name: "Dogri" },
  { code: "kok", name: "Konkani" },
  { code: "mai", name: "Maithili" },
  { code: "mni", name: "Manipuri" },
  { code: "sat", name: "Santali" },
  { code: "bho", name: "Bhojpuri" },

  // Additional international languages
  { code: "es", name: "Spanish" },
  { code: "zh", name: "Chinese" },
  { code: "tl", name: "Tagalog" },
  { code: "vi", name: "Vietnamese" },
  { code: "ru", name: "Russian" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "it", name: "Italian" },
]

// For backward compatibility
export const INDIAN_LANGUAGES = SUPPORTED_LANGUAGES

// Map of language codes to their full names
const LANGUAGE_NAMES = {
  // Indian languages
  hi: "Hindi",
  bn: "Bengali",
  te: "Telugu",
  mr: "Marathi",
  ta: "Tamil",
  ur: "Urdu",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  as: "Assamese",
  or: "Odia",
  sa: "Sanskrit",
  sd: "Sindhi",
  ks: "Kashmiri",
  ne: "Nepali",
  si: "Sinhala",
  doi: "Dogri",
  kok: "Konkani",
  mai: "Maithili",
  mni: "Manipuri",
  sat: "Santali",
  bho: "Bhojpuri",

  // Additional international languages
  es: "Spanish",
  zh: "Chinese",
  tl: "Tagalog",
  vi: "Vietnamese",
  ru: "Russian",
  de: "German",
  fr: "French",
  it: "Italian",
}

// Get language name from code
export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || code
}

// Update the translateText function with better error handling
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        type: "standard",
      }),
    })

    const data = await response.json()

    // Check if the API returned a successful response
    if (data.success === false) {
      throw new Error(data.error || "Translation failed")
    }

    // Return the translation, even if it's a fallback
    return data.translation
  } catch (error) {
    console.error("Translation error:", error)
    // Return a fallback translation instead of throwing
    return `[${getLanguageName(targetLanguage)}] ${text.substring(0, 30)}...`
  }
}

// Generate an alternative translation
export async function generateAlternativeTranslation(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        type: "alternative",
      }),
    })

    const data = await response.json()

    if (data.success === false) {
      throw new Error(data.error || "Alternative translation failed")
    }

    return data.translation
  } catch (error) {
    console.error("Alternative translation error:", error)
    return `[${getLanguageName(targetLanguage)}] ${text.substring(0, 30)}...`
  }
}

// Update the translateBatch function with better error handling
export async function translateBatch(text: string, targetLanguages: string[]): Promise<Record<string, string>> {
  const translations: Record<string, string> = {}

  try {
    // Process translations in batches to avoid overwhelming the API
    const batchSize = 3
    for (let i = 0; i < targetLanguages.length; i += batchSize) {
      const batch = targetLanguages.slice(i, i + batchSize)

      // Process each language in the current batch
      const batchPromises = batch.map(async (lang) => {
        try {
          translations[lang] = await translateText(text, lang)
        } catch (error) {
          console.error(`Translation error for ${lang}:`, error)
          translations[lang] = `[${getLanguageName(lang)}] ${text.substring(0, 30)}...`
        }
      })

      await Promise.all(batchPromises)

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < targetLanguages.length) {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }

    return translations
  } catch (error) {
    console.error("Batch translation error:", error)

    // Ensure we return something for each requested language
    targetLanguages.forEach((lang) => {
      if (!translations[lang]) {
        translations[lang] = `[${getLanguageName(lang)}] ${text.substring(0, 30)}...`
      }
    })

    return translations
  }
}
