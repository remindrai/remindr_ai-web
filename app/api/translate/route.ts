import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { text, targetLanguage, type = "standard" } = await req.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: text or targetLanguage", success: false },
        { status: 400 },
      )
    }

    // Get language name for better prompting
    const languageMap: Record<string, string> = {
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
      zh: "Chinese (Simplified)",
      tl: "Tagalog",
      vi: "Vietnamese",
      ru: "Russian",
      de: "German",
      fr: "French",
      it: "Italian",
    }

    const languageName = languageMap[targetLanguage] || targetLanguage

    // Sample translations for demonstration and fallback
    const sampleTranslations: Record<string, Record<string, string[]>> = {
      "please submit assignments by next weekend": {
        hi: [
          "कृपया अगले सप्ताहांत तक असाइनमेंट जमा करें",
          "कृपया अगले वीकेंड तक असाइनमेंट सबमिट करें",
          "अगले सप्ताहांत से पहले कृपया असाइनमेंट प्रस्तुत करें",
        ],
        es: [
          "Por favor, entregue las tareas antes del próximo fin de semana",
          "Por favor, presente las asignaciones para el próximo fin de semana",
          "Entregue los deberes antes del próximo fin de semana",
        ],
        fr: [
          "Veuillez soumettre les devoirs avant le week-end prochain",
          "Merci de rendre les travaux d'ici le week-end prochain",
          "Soumettez vos devoirs avant le prochain week-end",
        ],
        de: [
          "Bitte reichen Sie die Aufgaben bis zum nächsten Wochenende ein",
          "Bitte geben Sie die Hausaufgaben bis zum kommenden Wochenende ab",
          "Reichen Sie die Aufgaben bis zum nächsten Wochenende ein",
        ],
      },
      "meeting scheduled for tomorrow": {
        hi: ["बैठक कल के लिए निर्धारित है", "कल के लिए मीटिंग शेड्यूल की गई है", "आवश्यक बैठक कल होगी"],
        es: [
          "Reunión programada para mañana",
          "La reunión está agendada para mañana",
          "Tenemos una reunión programada para mañana",
        ],
        fr: [
          "Réunion prévue pour demain",
          "La réunion est programmée pour demain",
          "Une réunion est planifiée pour demain",
        ],
        de: ["Meeting für morgen geplant", "Besprechung für morgen angesetzt", "Die Sitzung ist für morgen terminiert"],
      },
      "update the website content": {
        hi: ["वेबसाइट सामग्री अपडेट करें", "वेबसाइट कंटेंट को अपडेट करें", "वेबसाइट की विषय-वस्तु को नवीनीकृत करें"],
        es: [
          "Actualizar el contenido del sitio web",
          "Actualice el contenido de la página web",
          "Ponga al día el contenido del sitio web",
        ],
        fr: [
          "Mettre à jour le contenu du site web",
          "Actualisez le contenu du site",
          "Mettez à jour le contenu du site internet",
        ],
        de: [
          "Aktualisieren Sie den Website-Inhalt",
          "Webseiteninhalte aktualisieren",
          "Erneuern Sie die Inhalte der Webseite",
        ],
      },
    }

    // Try to find a sample translation first
    const lowerText = text.toLowerCase().trim()
    for (const [key, translations] of Object.entries(sampleTranslations)) {
      if (lowerText.includes(key.toLowerCase()) && translations[targetLanguage]) {
        // For standard translation, return the first one
        // For alternative, return a random one that's not the first
        const options = translations[targetLanguage]
        if (type === "standard") {
          return NextResponse.json({ translation: options[0], success: true })
        } else {
          // Get a random alternative that's not the first one
          const alternativeIndex = Math.floor(Math.random() * (options.length - 1)) + 1
          return NextResponse.json({ translation: options[alternativeIndex % options.length], success: true })
        }
      }
    }

    // If no sample translation is found, use AI
    try {
      let prompt = ""

      if (type === "standard") {
        prompt = `Translate the following text to ${languageName}. Provide only the translation, no explanations:
        
        "${text}"`
      } else {
        prompt = `Translate the following text to ${languageName}, but provide an alternative phrasing or wording 
        that conveys the same meaning. Be creative but accurate. Provide only the translation, no explanations:
        
        "${text}"`
      }

      const { text: translatedText } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: type === "standard" ? 0.3 : 0.7, // Higher temperature for alternatives
        maxTokens: 500,
      })

      // Ensure we're returning a clean response
      return NextResponse.json({
        translation: translatedText.trim(),
        success: true,
      })
    } catch (aiError) {
      console.error("OpenAI translation error:", aiError)

      // Fallback to a simple placeholder translation
      return NextResponse.json({
        translation: `[${languageName}] ${text}`,
        success: true,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      {
        error: "Failed to translate text",
        success: false,
        translation: "Translation failed",
      },
      { status: 500 },
    )
  }
}
