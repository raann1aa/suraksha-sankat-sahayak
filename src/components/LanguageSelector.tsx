import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Globe,
  Check,
  Star,
  Volume2,
  VolumeX,
  Settings,
  Download,
  Smartphone,
  Users,
  MapPin,
  Clock,
  Headphones,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  showNativeScript?: boolean;
  enableVoiceOutput?: boolean;
  enableAutoDetect?: boolean;
  userLocation?: string;
  className?: string;
}

interface Language {
  code: string;
  name: string;
  native: string;
  script: string;
  direction: "ltr" | "rtl";
  region: string[];
  speakers: number; // in millions
  difficulty: "easy" | "medium" | "hard";
  category: "major" | "regional" | "minority";
  isPopular?: boolean;
  isOfflineAvailable?: boolean;
  voiceSupport?: boolean;
  flag: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  showNativeScript = true,
  enableVoiceOutput = false,
  enableAutoDetect = false,
  userLocation,
  className = "",
}) => {
  const [favoriteLanguages, setFavoriteLanguages] = useState<string[]>([]);
  const [recentLanguages, setRecentLanguages] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoiceOutput);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(enableAutoDetect);

  const languages: Language[] = [
    {
      code: "en",
      name: "English",
      native: "English",
      script: "Latin",
      direction: "ltr",
      region: ["Global"],
      speakers: 1500,
      difficulty: "medium",
      category: "major",
      isPopular: true,
      isOfflineAvailable: true,
      voiceSupport: true,
      flag: "🇺🇸",
    },
    {
      code: "hi",
      name: "Hindi",
      native: "हिंदी",
      script: "Devanagari",
      direction: "ltr",
      region: ["North India", "Central India"],
      speakers: 600,
      difficulty: "medium",
      category: "major",
      isPopular: true,
      isOfflineAvailable: true,
      voiceSupport: true,
      flag: "🇮🇳",
    },
  ];

  // Load user preferences
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteLanguages");
    const savedRecent = localStorage.getItem("recentLanguages");

    if (savedFavorites) {
      setFavoriteLanguages(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentLanguages(JSON.parse(savedRecent));
    }
  }, []);

  // Auto-detect language based on location
  useEffect(() => {
    if (autoDetectEnabled && userLocation && !selectedLanguage) {
      const suggestedLanguage = getSuggestedLanguage(userLocation);
      if (suggestedLanguage) {
        handleLanguageChange(suggestedLanguage);
      }
    }
  }, [autoDetectEnabled, userLocation]);

  const getSuggestedLanguage = (location: string): string | null => {
    const locationLower = location.toLowerCase();
    // Default to Hindi for India, English for others
    return locationLower.includes("india") ? "hi" : "en";
  };

  const handleLanguageChange = (languageCode: string) => {
    onLanguageChange(languageCode);

    // Update recent languages
    const updatedRecent = [
      languageCode,
      ...recentLanguages.filter((code) => code !== languageCode),
    ].slice(0, 5);
    setRecentLanguages(updatedRecent);
    localStorage.setItem("recentLanguages", JSON.stringify(updatedRecent));

    const language = languages.find((lang) => lang.code === languageCode);
    if (language) {
      toast({
        title: "Language Changed",
        description: `Switched to ${language.name} (${language.native})`,
        duration: 2000,
      });

      // Voice announcement if enabled
      if (
        voiceEnabled &&
        language.voiceSupport &&
        "speechSynthesis" in window
      ) {
        const utterance = new SpeechSynthesisUtterance(
          `Language changed to ${language.name}`
        );
        utterance.lang = language.code === "en" ? "en-US" : language.code;
        speechSynthesis.speak(utterance);
      }
    }
  };

  const toggleFavorite = (languageCode: string) => {
    const updatedFavorites = favoriteLanguages.includes(languageCode)
      ? favoriteLanguages.filter((code) => code !== languageCode)
      : [...favoriteLanguages, languageCode];

    setFavoriteLanguages(updatedFavorites);
    localStorage.setItem("favoriteLanguages", JSON.stringify(updatedFavorites));

    toast({
      title: favoriteLanguages.includes(languageCode)
        ? "Removed from Favorites"
        : "Added to Favorites",
      duration: 1500,
    });
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  const downloadLanguagePack = (languageCode: string) => {
    toast({
      title: "Downloading Language Pack",
      description: `Offline support for ${
        languages.find((l) => l.code === languageCode)?.name
      }`,
      duration: 3000,
    });
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Main Language Selector */}
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="min-w-32 h-10 bg-white hover:bg-gray-50 border-2 transition-all duration-200">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            {selectedLang && (
              <span className="text-lg">{selectedLang.flag}</span>
            )}
            <div className="flex flex-col items-start">
              <SelectValue />
              {selectedLang && showNativeScript && (
                <span className="text-xs text-gray-500 font-medium">
                  {selectedLang.native}
                </span>
              )}
            </div>
          </div>
        </SelectTrigger>

        <SelectContent className="bg-white border-2 shadow-xl z-50 max-w-xs">
          {/* Favorites Section */}
          {favoriteLanguages.length > 0 && (
            <div className="p-2">
              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-600">
                  FAVORITES
                </span>
              </div>
              {favoriteLanguages.map((code) => {
                const lang = languages.find((l) => l.code === code);
                return lang ? (
                  <SelectItem
                    key={`fav-${code}`}
                    value={code}
                    className="hover:bg-blue-50"
                  >
                    <LanguageItem language={lang} isFavorite={true} />
                  </SelectItem>
                ) : null;
              })}
              <Separator className="my-2" />
            </div>
          )}

          {/* Recent Languages */}
          {recentLanguages.length > 0 && (
            <div className="p-2">
              <div className="flex items-center space-x-1 mb-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600">
                  RECENT
                </span>
              </div>
              {recentLanguages.slice(0, 2).map((code) => {
                const lang = languages.find((l) => l.code === code);
                return lang ? (
                  <SelectItem
                    key={`recent-${code}`}
                    value={code}
                    className="hover:bg-gray-50"
                  >
                    <LanguageItem language={lang} />
                  </SelectItem>
                ) : null;
              })}
              <Separator className="my-2" />
            </div>
          )}

          {/* All Languages */}
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-semibold text-gray-600">
                  LANGUAGES
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {languages.length}
              </Badge>
            </div>

            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="hover:bg-blue-50 group"
              >
                <LanguageItemWithActions
                  language={lang}
                  isFavorite={favoriteLanguages.includes(lang.code)}
                  onToggleFavorite={() => toggleFavorite(lang.code)}
                  onDownload={() => downloadLanguagePack(lang.code)}
                />
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>

      {/* Language Settings Button */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Language Settings</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Voice Settings */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center space-x-2">
                <Headphones className="w-4 h-4" />
                <span>Voice & Audio</span>
              </Label>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                  <span className="text-sm">Voice announcements</span>
                </div>
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Auto-detect Settings */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Smart Detection</span>
              </Label>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Auto-detect by location</span>
                </div>
                <Switch
                  checked={autoDetectEnabled}
                  onCheckedChange={setAutoDetectEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Usage Statistics</span>
              </Label>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">
                    {favoriteLanguages.length}
                  </div>
                  <div className="text-gray-600">Favorites</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-600">
                    {recentLanguages.length}
                  </div>
                  <div className="text-gray-600">Recent</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Language Info */}
      {selectedLang && (
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
          <Badge variant="outline" className="text-xs">
            {selectedLang.speakers}M speakers
          </Badge>
          {selectedLang.voiceSupport && (
            <Badge variant="outline" className="text-xs text-green-600">
              <Volume2 className="w-3 h-3 mr-1" />
              Voice
            </Badge>
          )}
          {selectedLang.isOfflineAvailable && (
            <Badge variant="outline" className="text-xs text-blue-600">
              <Download className="w-3 h-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Language Item Component for basic display
const LanguageItem: React.FC<{
  language: Language;
  isFavorite?: boolean;
}> = ({ language, isFavorite = false }) => (
  <div className="flex items-center space-x-3 w-full">
    <span className="text-lg">{language.flag}</span>
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <span className="font-medium">{language.native}</span>
        {isFavorite && (
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
        )}
        <Badge variant="secondary" className="text-xs">
          Popular
        </Badge>
      </div>
      <span className="text-xs text-gray-500">
        {language.name} • {language.speakers}M speakers
      </span>
    </div>
  </div>
);

// Language Item with Actions
const LanguageItemWithActions: React.FC<{
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDownload: () => void;
}> = ({ language, isFavorite, onToggleFavorite, onDownload }) => (
  <div className="flex items-center justify-between w-full group">
    <LanguageItem language={language} isFavorite={isFavorite} />
    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="h-6 w-6 p-0"
      >
        <Star
          className={`w-3 h-3 ${
            isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"
          }`}
        />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        className="h-6 w-6 p-0"
      >
        <Download className="w-3 h-3 text-blue-500" />
      </Button>
    </div>
  </div>
);

export default LanguageSelector;
