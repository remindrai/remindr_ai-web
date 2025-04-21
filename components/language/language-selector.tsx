"use client"

import { useState, useEffect } from "react"
import { Globe, Search, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { SUPPORTED_LANGUAGES } from "./translation-service"

interface LanguageSelectorProps {
  selectedLanguages: string[]
  onLanguagesChange: (languages: string[]) => void
}

// Generate a random pastel color
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 80%)`
}

// Map language codes to consistent colors
const languageColors: Record<string, string> = {}
SUPPORTED_LANGUAGES.forEach((lang) => {
  languageColors[lang.code] = getRandomColor()
})

export function LanguageSelector({ selectedLanguages, onLanguagesChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSelected, setTempSelected] = useState<string[]>([])

  // Initialize temp selected with current selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTempSelected([...selectedLanguages])
      setSearchQuery("")
    }
  }, [isOpen, selectedLanguages])

  // Filter languages based on search query
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleLanguage = (code: string) => {
    setTempSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const handleSave = () => {
    onLanguagesChange(tempSelected)
    setIsOpen(false)
  }

  const clearAll = () => {
    setTempSelected([])
  }

  const selectAll = () => {
    setTempSelected(SUPPORTED_LANGUAGES.map((lang) => lang.code))
  }

  const removeLanguage = (code: string) => {
    setTempSelected((prev) => prev.filter((c) => c !== code))
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-1">
        <Globe className="h-4 w-4 shrink-0" />
        <span className="ml-1 hidden md:inline-flex truncate max-w-[120px]">
          {selectedLanguages.length > 0
            ? selectedLanguages.length === 1
              ? SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguages[0])?.name
              : `${SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguages[0])?.name} +${selectedLanguages.length - 1}`
            : "Select Languages"}
        </span>
        {selectedLanguages.length > 0 && <Badge className="ml-1 h-5 shrink-0">{selectedLanguages.length}</Badge>}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Languages for Translation</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1 h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Selected languages as tags */}
          {tempSelected.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {tempSelected.map((code) => {
                  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code)
                  if (!lang) return null

                  const bgColor = languageColors[code]
                  const textColor = "black" // Dark text for pastel backgrounds

                  return (
                    <Badge
                      key={code}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: "transparent",
                      }}
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {lang.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(code)}
                        className="h-4 w-4 p-0 ml-1 hover:bg-black/10 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">All Languages</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-2">
            <div className="grid grid-cols-2 gap-2">
              {filteredLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center space-x-2 rounded-md border p-2 cursor-pointer transition-colors ${
                    tempSelected.includes(lang.code) ? "border-primary bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => toggleLanguage(lang.code)}
                >
                  <div
                    className={`h-4 w-4 rounded-sm border flex items-center justify-center ${
                      tempSelected.includes(lang.code)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {tempSelected.includes(lang.code) && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lang.name}</p>
                    <p className="text-xs text-muted-foreground">{lang.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <div className="text-sm text-muted-foreground">{tempSelected.length} languages selected</div>
            <Button onClick={handleSave}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
