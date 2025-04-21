"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCw, Volume2, Copy, Check, Mic, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getLanguageName, generateAlternativeTranslation } from "./translation-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TranslationBadgeProps {
  languageCode: string
  translation: string
  originalText: string
  onTranslationUpdate: (languageCode: string, newTranslation: string) => void
}

export function TranslationBadge({
  languageCode,
  translation,
  originalText,
  onTranslationUpdate,
}: TranslationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedTranslation, setEditedTranslation] = useState(translation || "")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confidence, setConfidence] = useState(85)
  const [activeTab, setActiveTab] = useState("edit")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState("")
  const [alternativeTranslations, setAlternativeTranslations] = useState<string[]>([])
  const [currentAlternativeIndex, setCurrentAlternativeIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  const languageName = getLanguageName(languageCode)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setEditedTranslation(translation || "")
      setCopied(false)
      setAlternativeTranslations([])
      setCurrentAlternativeIndex(0)
    }
  }, [isOpen, translation])

  // Auto-focus and select text when dialog opens
  useEffect(() => {
    if (isOpen && textareaRef.current && activeTab === "edit") {
      setTimeout(() => {
        textareaRef.current?.focus()
        textareaRef.current?.select()
      }, 100)
    }
  }, [isOpen, activeTab])

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const handleSave = () => {
    onTranslationUpdate(languageCode, editedTranslation)
    setIsOpen(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Show progress animation
      const interval = setInterval(() => {
        setConfidence((prev) => {
          const newValue = prev + Math.floor(Math.random() * 5)
          return newValue > 95 ? 95 : newValue
        })
      }, 200)

      // Generate an alternative translation
      const newTranslation = await generateAlternativeTranslation(originalText, languageCode)

      // Add to alternatives list if not already there
      if (!alternativeTranslations.includes(newTranslation)) {
        setAlternativeTranslations((prev) => [...prev, newTranslation])
        setCurrentAlternativeIndex(alternativeTranslations.length)
      }

      setEditedTranslation(newTranslation)

      // Complete progress animation
      clearInterval(interval)
      setConfidence(100)

      // Reset confidence after a delay
      setTimeout(() => setConfidence(85), 1000)
    } catch (error) {
      console.error("Error refreshing translation:", error)
      // If translation fails, show an error message
      setEditedTranslation(`Error: Could not generate alternative translation. Please try again.`)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedTranslation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(editedTranslation)
    utterance.lang = languageCode
    window.speechSynthesis.speak(utterance)
  }

  const startVoiceRecognition = () => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setRecordingStatus("Speech recognition not supported in this browser")
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    // Configure recognition
    recognitionRef.current.lang = languageCode
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setIsRecording(true)
      setRecordingStatus("Listening...")
    }

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setEditedTranslation(transcript)
      setRecordingStatus(`Recorded: "${transcript}"`)
    }

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setRecordingStatus(`Error: ${event.error}`)
      setIsRecording(false)
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
      setTimeout(() => setRecordingStatus(""), 3000)
    }

    // Start recognition
    recognitionRef.current.start()
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  // Get a consistent color for this language code
  const getLanguageColor = () => {
    let hash = 0
    for (let i = 0; i < languageCode.length; i++) {
      hash = languageCode.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 80%)`
  }

  const bgColor = getLanguageColor()
  const textColor = "black" // Dark text for pastel backgrounds

  // Check if translation is empty or just contains the language code
  const isEmptyOrPlaceholder =
    !translation || translation.trim() === "" || translation.trim() === `[${languageCode}] ${originalText}`

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: "transparent",
              }}
              className="cursor-pointer hover:opacity-90 transition-opacity duration-200 mr-1 mb-1"
              onClick={() => setIsOpen(true)}
            >
              {languageName}
              {isEmptyOrPlaceholder && "*"}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            {isEmptyOrPlaceholder ? (
              <p>Click to translate to {languageName}</p>
            ) : (
              <p className="break-words">
                {languageName}: {translation}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Edit {languageName} Translation
              <Badge
                style={{ backgroundColor: bgColor, color: textColor, borderColor: "transparent" }}
                className="ml-2"
              >
                {languageName}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-4">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={editedTranslation}
                  onChange={(e) => setEditedTranslation(e.target.value)}
                  rows={6}
                  className="resize-none pr-10 font-medium text-lg"
                  placeholder={isEmptyOrPlaceholder ? "Click 'Regenerate Translation' to translate" : ""}
                />
                <div className="absolute right-2 top-2 flex flex-col gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSpeak}
                    className="h-8 w-8"
                    title="Listen to translation (text-to-speech)"
                    disabled={isEmptyOrPlaceholder}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {recordingStatus && (
                <Alert className="mt-2">
                  <AlertDescription>{recordingStatus}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
                  className="flex items-center gap-1"
                  title={isRecording ? "Stop recording" : "Speak in the target language to transcribe"}
                >
                  {isRecording ? (
                    <>
                      <X className="h-3 w-3" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3" />
                      <span>Voice Input</span>
                    </>
                  )}
                </Button>

                {isRecording && (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Recording...</span>
                  </div>
                )}

                {alternativeTranslations.length > 1 && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    Alternative {currentAlternativeIndex + 1} of {alternativeTranslations.length}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="compare" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Original</p>
                  <div className="border rounded-md p-3 bg-muted/50">{originalText}</div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Translation</p>
                  <div className="border rounded-md p-3">
                    {isEmptyOrPlaceholder ? (
                      <span className="text-muted-foreground italic">
                        No translation yet. Click "Regenerate Translation" to translate.
                      </span>
                    ) : (
                      editedTranslation
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Translation Confidence</span>
                  <span>{isEmptyOrPlaceholder ? "0" : confidence}%</span>
                </div>
                <Progress value={isEmptyOrPlaceholder ? 0 : confidence} className="h-2" />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1"
              title="Generate an alternative translation using AI"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Regenerate Translation</span>
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
