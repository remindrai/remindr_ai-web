"use client"

import { useState, useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { translateBatch } from "./translation-service"
import { TranslationBadge } from "./translation-badge"
import { Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TranslatableFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  selectedLanguages: string[]
  className?: string
  onGenerateDescription?: (description: string) => void
  isTitle?: boolean
}

export function TranslatableField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder = "",
  selectedLanguages,
  className = "",
  onGenerateDescription,
  isTitle = false,
}: TranslatableFieldProps) {
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isTranslating, setIsTranslating] = useState(false)
  const [isRephrasing, setIsRephrasing] = useState(false)
  const [showTranslationIndicator, setShowTranslationIndicator] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const previousValueRef = useRef(value)
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousLanguagesRef = useRef<string[]>([])

  // Initialize translations for newly selected languages
  useEffect(() => {
    const newLanguages = selectedLanguages.filter((lang) => !previousLanguagesRef.current.includes(lang))

    if (newLanguages.length > 0 && value.trim()) {
      // Add placeholder translations for new languages
      const placeholders: Record<string, string> = {}
      newLanguages.forEach((lang) => {
        placeholders[lang] = "Translating..."
      })

      setTranslations((prev) => ({ ...prev, ...placeholders }))
      setTranslationError(null)

      // Trigger translation for new languages immediately
      if (value.trim()) {
        handleTranslate(newLanguages)
      }
    }

    // Remove translations for languages that are no longer selected
    const removedLanguages = previousLanguagesRef.current.filter((lang) => !selectedLanguages.includes(lang))

    if (removedLanguages.length > 0) {
      setTranslations((prev) => {
        const updated = { ...prev }
        removedLanguages.forEach((lang) => {
          delete updated[lang]
        })
        return updated
      })
    }

    previousLanguagesRef.current = [...selectedLanguages]
  }, [selectedLanguages, value])

  // Update translations when value changes and user stops typing
  useEffect(() => {
    // Clear any existing timeout
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current)
    }

    // Only translate if there are selected languages and the value has changed
    if (selectedLanguages.length > 0 && value !== previousValueRef.current && value.trim()) {
      setShowTranslationIndicator(true)
      setTranslationError(null)

      // Set a timeout to translate after user stops typing
      translationTimeoutRef.current = setTimeout(() => {
        handleTranslate(selectedLanguages)
      }, 1000) // Wait 1 second after typing stops
    }

    // If value is empty, clear translations
    if (!value.trim()) {
      setTranslations({})
    }

    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current)
      }
    }
  }, [value, selectedLanguages])

  // Handle translation for specified languages
  const handleTranslate = async (languages: string[]) => {
    if (!value.trim() || languages.length === 0) return

    setIsTranslating(true)
    setTranslationError(null)

    try {
      const newTranslations = await translateBatch(value, languages)

      // Update translations
      setTranslations((prev) => ({
        ...prev,
        ...newTranslations,
      }))
    } catch (error) {
      console.error("Translation error:", error)
      setTranslationError("Translation service is currently unavailable. Please try again later.")

      // Set error state for failed translations
      const errorTranslations: Record<string, string> = {}
      languages.forEach((lang) => {
        if (!translations[lang] || translations[lang] === "Translating...") {
          errorTranslations[lang] = `[Translation unavailable]`
        }
      })

      setTranslations((prev) => ({
        ...prev,
        ...errorTranslations,
      }))
    } finally {
      setIsTranslating(false)
      setShowTranslationIndicator(false)
      previousValueRef.current = value
    }
  }

  // Force translate all languages
  const handleForceTranslate = () => {
    if (selectedLanguages.length > 0 && value.trim()) {
      setTranslationError(null)
      handleTranslate(selectedLanguages)
    }
  }

  // Update a specific translation
  const handleTranslationUpdate = (languageCode: string, newTranslation: string) => {
    setTranslations((prev) => ({
      ...prev,
      [languageCode]: newTranslation,
    }))
  }

  // Capitalize first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Generate description based on title
  const generateDescription = (title: string) => {
    // Different description templates based on title content
    const templates = [
      `This task involves ${title.toLowerCase()}. Please ensure all necessary details are included.`,
      `The objective is to ${title.toLowerCase()}. This is important for maintaining our workflow efficiency.`,
      `We need to ${title.toLowerCase()} to meet our project deadlines and quality standards.`,
      `${title} is a critical task that requires attention to detail and timely completion.`,
      `This assignment requires you to ${title.toLowerCase()} with precision and thoroughness.`,
    ]

    // Select template based on title content
    let template = templates[0]

    if (title.toLowerCase().includes("deliver") || title.toLowerCase().includes("submit")) {
      template = `Please ensure you ${title.toLowerCase()} with all required information. This is necessary for proper record-keeping and project tracking.`
    } else if (title.toLowerCase().includes("review") || title.toLowerCase().includes("evaluate")) {
      template = `This task involves ${title.toLowerCase()} thoroughly. Pay special attention to accuracy, completeness, and alignment with our standards.`
    } else if (title.toLowerCase().includes("meeting") || title.toLowerCase().includes("discussion")) {
      template = `Prepare to ${title.toLowerCase()} by gathering relevant materials and information. Make sure all participants are properly notified.`
    } else if (title.toLowerCase().includes("create") || title.toLowerCase().includes("develop")) {
      template = `This assignment requires you to ${title.toLowerCase()} according to our specifications. Focus on quality and innovation.`
    } else {
      // Use a random template for other cases
      template = templates[Math.floor(Math.random() * templates.length)]
    }

    return template
  }

  // Handle AI rephrasing
  const handleRephrase = async () => {
    if (!value.trim() || isRephrasing) return

    try {
      setIsRephrasing(true)
      // Simulate API call for rephrasing
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Generate a rephrased version with more meaningful changes
      const rephrased = await (async () => {
        const originalText = value.trim()

        // Different strategies for short vs long text
        if (multiline && originalText.length > 50) {
          // For longer descriptions, use paragraph-oriented rephrasing
          const sentences = originalText.split(/(?<=[.!?])\s+/)

          // Process each sentence with different improvements
          const improvedSentences = sentences.map((sentence, index) => {
            // Apply different strategies based on sentence position
            if (index === 0) {
              // First sentence - make it more engaging
              return sentence
                .replace(/^I am/i, "We are")
                .replace(/^This is/i, "This innovative solution is")
                .replace(/^The/i, "The exceptional")
            } else if (index === sentences.length - 1) {
              // Last sentence - add call to action or conclusion
              if (!/please|contact|email|call|visit/i.test(sentence)) {
                return sentence + " Please review at your earliest convenience."
              }
              return sentence
            } else {
              // Middle sentences - enhance with professional language
              return sentence
                .replace(/good/i, "excellent")
                .replace(/bad/i, "suboptimal")
                .replace(/problem/i, "challenge")
                .replace(/tried/i, "attempted")
                .replace(/used/i, "utilized")
                .replace(/made/i, "developed")
            }
          })

          return improvedSentences.join(" ")
        } else {
          // For shorter text, use the same approach as for titles
          // Context-specific rephrasing
          if (originalText.toLowerCase().includes("submit") || originalText.toLowerCase().includes("send")) {
            return originalText
              .replace(/submit|send/i, "deliver")
              .replace(/by tomorrow/i, "before the deadline")
              .replace(/timesheet/i, "time report")
          } else if (originalText.toLowerCase().includes("meeting") || originalText.toLowerCase().includes("call")) {
            return originalText
              .replace(/schedule a meeting/i, "arrange a discussion")
              .replace(/have a call/i, "conduct a conference")
              .replace(/meeting/i, "collaboration session")
              .replace(/call/i, "discussion")
          } else if (originalText.toLowerCase().includes("review") || originalText.toLowerCase().includes("check")) {
            return originalText
              .replace(/review/i, "evaluate")
              .replace(/check/i, "assess")
              .replace(/document/i, "materials")
          } else {
            // Apply general improvements
            const improvements = [
              // Replace common words with more professional alternatives
              [/get/i, "obtain"],
              [/make/i, "create"],
              [/do/i, "complete"],
              [/use/i, "utilize"],
              [/start/i, "initiate"],
              [/end/i, "finalize"],
              [/tell/i, "inform"],
              [/show/i, "demonstrate"],
              [/help/i, "assist"],
              [/fix/i, "resolve"],
              // Improve phrases
              [/as soon as possible/i, "at the earliest opportunity"],
              [/right away/i, "promptly"],
              [/get back to/i, "follow up with"],
              [/look into/i, "investigate"],
              [/set up/i, "establish"],
            ]

            let improved = originalText
            // Apply at most 2 improvements to avoid over-changing
            let changesApplied = 0

            for (const [pattern, replacement] of improvements) {
              if (pattern.test(improved) && changesApplied < 2) {
                improved = improved.replace(pattern, replacement)
                changesApplied++
              }
            }

            return improved
          }
        }
      })()

      // Capitalize first letter if this is a title
      let finalRephrased = isTitle ? capitalizeFirstLetter(rephrased) : rephrased

      // Only update if the rephrased text is different
      if (finalRephrased !== value) {
        onChange(finalRephrased)

        // Generate description if this is a title and the callback exists
        if (isTitle && onGenerateDescription) {
          const description = generateDescription(finalRephrased)
          onGenerateDescription(description)
        }
      } else {
        // If no changes were made, try a different approach
        if (multiline) {
          // For multiline text, add a professional closing
          const closings = [
            "I look forward to your feedback on this matter.",
            "Please let me know if you need any clarification.",
            "I'm available to discuss this further at your convenience.",
            "Your input on this would be greatly appreciated.",
            "I believe this approach aligns with our objectives.",
          ]
          const randomClosing = closings[Math.floor(Math.random() * closings.length)]
          finalRephrased = `${value}\n\n${randomClosing}`
          onChange(finalRephrased)
        } else {
          // For single line text
          const words = value.split(" ")
          if (words.length > 3) {
            // Rearrange sentence structure for longer texts
            const firstPart = words.slice(0, Math.floor(words.length / 2)).join(" ")
            const secondPart = words.slice(Math.floor(words.length / 2)).join(" ")
            finalRephrased = isTitle
              ? capitalizeFirstLetter(`${secondPart} to ${firstPart}`)
              : `${secondPart} to ${firstPart}`
            onChange(finalRephrased)

            // Generate description if this is a title and the callback exists
            if (isTitle && onGenerateDescription) {
              const description = generateDescription(finalRephrased)
              onGenerateDescription(description)
            }
          } else {
            // For very short texts, add context
            finalRephrased = isTitle ? capitalizeFirstLetter(`${value} (high priority)`) : `${value} (high priority)`
            onChange(finalRephrased)

            // Generate description if this is a title and the callback exists
            if (isTitle && onGenerateDescription) {
              const description = generateDescription(finalRephrased)
              onGenerateDescription(description)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error rephrasing text:", error)
      setTranslationError("Failed to rephrase text. Please try again.")
    } finally {
      setIsRephrasing(false)
    }
  }

  // Render magic wand button
  const renderMagicWandButton = () => (
    <button
      type="button"
      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
      onClick={handleRephrase}
      aria-label="Rephrase with AI"
      title="Rephrase with AI"
      disabled={isRephrasing || isTranslating || !value.trim()}
    >
      {isRephrasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
    </button>
  )

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id}>{label}</Label>
        {showTranslationIndicator && (
          <div className="flex items-center text-xs text-muted-foreground">
            {isTranslating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <span>Translation ready</span>
            )}
          </div>
        )}
      </div>

      {multiline ? (
        <div className="relative">
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="resize-none pr-10"
          />
          {renderMagicWandButton()}
        </div>
      ) : (
        <div className="relative">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
          {renderMagicWandButton()}
        </div>
      )}

      {selectedLanguages.length > 0 && value.trim() && (
        <div className="flex justify-between items-center mt-1 mb-1">
          <div className="text-xs text-muted-foreground">
            {Object.keys(translations).length === 0
              ? "No translations yet"
              : `${Object.keys(translations).length} translation(s) available`}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceTranslate}
            disabled={isTranslating || isRephrasing || !value.trim()}
            className="h-7 text-xs"
          >
            {isTranslating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate Now"
            )}
          </Button>
        </div>
      )}

      {translationError && <div className="text-xs text-red-500 mt-1">{translationError}</div>}

      {Object.keys(translations).length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {Object.entries(translations).map(([lang, text]) => (
            <TranslationBadge
              key={lang}
              languageCode={lang}
              translation={text}
              originalText={value}
              onTranslationUpdate={handleTranslationUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
