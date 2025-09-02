import React, { useState, useCallback, useRef } from "react";
import {
  Camera,
  MapPin,
  Send,
  Upload,
  AlertTriangle,
  Home,
  Building,
  X,
  Phone,
  Clock,
  CheckCircle,
  WifiOff,
  Loader2,
} from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface FloodReportingProps {
  currentLocation: Location | null;
  selectedLanguage?: string;
  onReportSubmitted?: (reportId: string) => void;
  emergencyContacts?: { name: string; number: string }[];
  maxImages?: number;
}

interface ReportData {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: Location | null;
  images: File[];
  timestamp: string;
  status: "draft" | "submitting" | "submitted" | "failed";
}

const FloodReporting: React.FC<FloodReportingProps> = ({
  currentLocation,
  selectedLanguage = "en",
  onReportSubmitted,
  emergencyContacts = [
    { name: "Emergency Services", number: "911" },
    { name: "Flood Control", number: "1-800-FLOOD" },
  ],
  maxImages = 5,
}) => {
  const [reportType, setReportType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedDrafts, setSavedDrafts] = useState<ReportData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    en: {
      title: "Report Flood Situation",
      subtitle:
        "Help your community by reporting flood conditions in real-time",
      reportType: "Report Type",
      floodLevel: "Flood in Street/Road",
      waterLogging: "Water Logging",
      damageProperty: "Property Damage",
      waterQuality: "Water Quality Issue",
      emergencyRescue: "Emergency Rescue Needed",
      infrastructureDamage: "Infrastructure Damage",
      severity: "Severity Level",
      low: "Low - Minor inconvenience",
      medium: "Medium - Moderate impact",
      high: "High - Serious concern",
      critical: "Critical - Life threatening",
      description: "Description",
      descriptionPlaceholder:
        "Describe the situation in detail: water depth, affected areas, time started, etc...",
      addPhotos: "Add Photos",
      submit: "Submit Report",
      location: "Current Location",
      submitting: "Submitting Report...",
      submitted: "Report Submitted Successfully!",
      failed: "Submission Failed",
      retry: "Retry",
      saveDraft: "Save Draft",
      emergencyHelp: "Need Emergency Help?",
      contactEmergency: "Contact Emergency Services",
      offline:
        "You're offline. Reports will be saved and sent when connection is restored.",
      photosUploaded: "photos uploaded",
      removePhoto: "Remove photo",
      maxPhotosReached: "Maximum photos limit reached",
      fillRequired: "Please fill all required fields",
      reportId: "Report ID",
      thankYou: "Thank you for helping your community!",
      estimatedTime: "Estimated response time: 15-30 minutes",
      viewDrafts: "View Saved Drafts",
      hideDrafts: "Hide Drafts",
      deleteDraft: "Delete Draft",
      loadDraft: "Load Draft",
    },
    hi: {
      title: "बाढ़ की स्थिति की रिपोर्ट करें",
      subtitle:
        "बाढ़ की स्थिति की वास्तविक समय में रिपोर्ट करके अपने समुदाय की मदद करें",
      reportType: "रिपोर्ट का प्रकार",
      floodLevel: "सड़क/रास्ते में बाढ़",
      waterLogging: "जल भराव",
      damageProperty: "संपत्ति की क्षति",
      waterQuality: "पानी की गुणवत्ता की समस्या",
      emergencyRescue: "आपातकालीन बचाव की आवश्यकता",
      infrastructureDamage: "बुनियादी ढांचे की क्षति",
      severity: "गंभीरता का स्तर",
      low: "कम - मामूली परेशानी",
      medium: "मध्यम - मध्यम प्रभाव",
      high: "उच्च - गंभीर चिंता",
      critical: "गंभीर - जानलेवा",
      description: "विवरण",
      descriptionPlaceholder:
        "स्थिति का विस्तार से वर्णन करें: पानी की गहराई, प्रभावित क्षेत्र, समय आदि...",
      addPhotos: "फोटो जोड़ें",
      submit: "रिपोर्ट भेजें",
      location: "वर्तमान स्थान",
      submitting: "रिपोर्ट भेज रहे हैं...",
      submitted: "रिपोर्ट सफलतापूर्वक भेजी गई!",
      failed: "भेजना असफल",
      retry: "पुनः प्रयास करें",
      saveDraft: "ड्राफ्ट सेव करें",
      emergencyHelp: "आपातकालीन सहायता चाहिए?",
      contactEmergency: "आपातकालीन सेवाओं से संपर्क करें",
      offline:
        "आप ऑफलाइन हैं। रिपोर्ट सेव की जाएंगी और कनेक्शन बहाल होने पर भेजी जाएंगी।",
      photosUploaded: "फोटो अपलोड की गईं",
      removePhoto: "फोटो हटाएं",
      maxPhotosReached: "अधिकतम फोटो सीमा पहुंच गई",
      fillRequired: "कृपया सभी आवश्यक फ़ील्ड भरें",
      reportId: "रिपोर्ट आईडी",
      thankYou: "आपके समुदाय की मदद के लिए धन्यवाद!",
      estimatedTime: "अनुमानित प्रतिक्रिया समय: 15-30 मिनट",
      viewDrafts: "सेव किए गए ड्राफ्ट देखें",
      hideDrafts: "ड्राफ्ट छुपाएं",
      deleteDraft: "ड्राफ्ट हटाएं",
      loadDraft: "ड्राफ्ट लोड करें",
    },
  };

  const t =
    translations[selectedLanguage as keyof typeof translations] ||
    translations.en;

  const reportTypes = [
    {
      value: "flood_level",
      label: t.floodLevel,
      icon: AlertTriangle,
      priority: "high",
    },
    {
      value: "water_logging",
      label: t.waterLogging,
      icon: MapPin,
      priority: "medium",
    },
    {
      value: "property_damage",
      label: t.damageProperty,
      icon: Home,
      priority: "high",
    },
    {
      value: "infrastructure_damage",
      label: t.infrastructureDamage,
      icon: Building,
      priority: "high",
    },
    {
      value: "water_quality",
      label: t.waterQuality,
      icon: Building,
      priority: "medium",
    },
    {
      value: "emergency_rescue",
      label: t.emergencyRescue,
      icon: AlertTriangle,
      priority: "critical",
    },
  ];

  const severityLevels = [
    {
      value: "low",
      label: t.low,
      color: "bg-green-100 text-green-800 border-green-300",
      icon: "🟢",
    },
    {
      value: "medium",
      label: t.medium,
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: "🟡",
    },
    {
      value: "high",
      label: t.high,
      color: "bg-orange-100 text-orange-800 border-orange-300",
      icon: "🟠",
    },
    {
      value: "critical",
      label: t.critical,
      color: "bg-red-100 text-red-800 border-red-300",
      icon: "🔴",
    },
  ];

  // Online/Offline detection
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const toast = document.createElement("div");
      const colors = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white",
      };

      toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${colors[type]}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    },
    []
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (images.length + files.length > maxImages) {
        showToast(t.maxPhotosReached, "error");
        return;
      }

      setImages((prevImages) => [...prevImages, ...files]);
      showToast(`${files.length} ${t.photosUploaded}`, "success");
    },
    [images.length, maxImages, showToast, t.maxPhotosReached, t.photosUploaded]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const saveDraft = useCallback(() => {
    if (!reportType && !description.trim()) return;

    const draft: ReportData = {
      id: "draft_" + Date.now(),
      type: reportType,
      severity,
      description,
      location: currentLocation,
      images,
      timestamp: new Date().toISOString(),
      status: "draft",
    };

    setSavedDrafts((prev) => [draft, ...prev.slice(0, 4)]); // Keep only 5 recent drafts
    showToast("Draft saved successfully", "success");
  }, [reportType, severity, description, currentLocation, images]);

  const loadDraft = useCallback((draft: ReportData) => {
    setReportType(draft.type);
    setSeverity(draft.severity);
    setDescription(draft.description);
    setImages(draft.images);
    showToast("Draft loaded", "success");
  }, []);

  const deleteDraft = useCallback((draftId: string) => {
    setSavedDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
    showToast("Draft deleted", "success");
  }, []);

  const handleSubmitReport = useCallback(async () => {
    if (!reportType || !severity || !description.trim()) {
      showToast(t.fillRequired, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with realistic delay
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 2000)
      );

      const reportId = "FLD" + Date.now().toString(36).toUpperCase();

      showToast(`${t.submitted} ${t.reportId}: #${reportId}`, "success");

      // Clear form
      setReportType("");
      setSeverity("");
      setDescription("");
      setImages([]);

      // Remove from drafts if it was saved
      setSavedDrafts((prev) =>
        prev.filter(
          (draft) =>
            !(draft.type === reportType && draft.description === description)
        )
      );

      onReportSubmitted?.(reportId);
    } catch (error) {
      showToast(t.failed, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    reportType,
    severity,
    description,
    onReportSubmitted,
    showToast,
    t.submitted,
    t.reportId,
    t.failed,
    t.fillRequired,
  ]);

  const handleEmergencyCall = useCallback((number: string) => {
    window.open(`tel:${number}`, "_self");
  }, []);

  const isFormValid = reportType && severity && description.trim();
  const canSubmit = isFormValid && !isSubmitting && isOnline;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
        {!isOnline && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">{t.offline}</span>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      {(severity === "critical" || reportType === "emergency_rescue") && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {t.emergencyHelp}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleEmergencyCall(contact.number)}
                className="flex items-center justify-between p-3 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 transition-colors"
              >
                <span className="font-medium text-red-800">{contact.name}</span>
                <span className="text-red-600">{contact.number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Display */}
      {currentLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <span className="font-medium text-blue-800">{t.location}: </span>
              <span className="text-blue-700">
                {currentLocation.lat.toFixed(6)},{" "}
                {currentLocation.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Report Type Selection */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-900">
          {t.reportType}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reportTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setReportType(type.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                reportType === type.value
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <type.icon
                  className={`w-5 h-5 ${
                    reportType === type.value
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                <span
                  className={`font-medium ${
                    reportType === type.value
                      ? "text-blue-900"
                      : "text-gray-900"
                  }`}
                >
                  {type.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Severity Level Selection */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-900">
          {t.severity}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {severityLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSeverity(level.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                severity === level.value
                  ? `${level.color} border-current ring-2 ring-current ring-opacity-30`
                  : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{level.icon}</span>
                <div>
                  <div className="font-semibold text-sm">
                    {level.label.split(" - ")[0]}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {level.label.split(" - ")[1]}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-900">
          {t.description}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.descriptionPlaceholder}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-right text-sm text-gray-500">
          {description.length}/500 characters
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          {t.addPhotos}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className={`w-full p-6 border-2 border-dashed rounded-lg transition-colors ${
            images.length >= maxImages
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8" />
            <span className="font-medium">
              {images.length >= maxImages
                ? t.maxPhotosReached
                : "Click to upload photos"}
            </span>
            <span className="text-sm text-gray-500">
              {images.length}/{maxImages} photos uploaded
            </span>
          </div>
        </button>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  title={t.removePhoto}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft Management */}
      {savedDrafts.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setSavedDrafts([])}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {savedDrafts.length > 0 ? t.viewDrafts : t.hideDrafts} (
            {savedDrafts.length})
          </button>

          <div className="grid gap-2">
            {savedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">
                    {reportTypes.find((t) => t.value === draft.type)?.label ||
                      draft.type}
                  </div>
                  <div className="text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(draft.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadDraft(draft)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    {t.loadDraft}
                  </button>
                  <button
                    onClick={() => deleteDraft(draft.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    {t.deleteDraft}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={saveDraft}
          disabled={!reportType && !description.trim()}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {t.saveDraft}
        </button>

        <button
          onClick={handleSubmitReport}
          disabled={!canSubmit}
          className={`flex-1 px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.submitting}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t.submit}
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {isFormValid && (
        <div className="text-center space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
          <p className="text-green-800 font-medium">{t.thankYou}</p>
          <p className="text-sm text-green-600">{t.estimatedTime}</p>
        </div>
      )}
    </div>
  );
};

export default FloodReporting;
