// Enhanced Alert System - Complete Implementation
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
} from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Share,
  X,
  Info,
  ChevronDown,
  WifiOff,
  Settings,
  Filter,
  Bell,
  BellOff,
  Star,
  Archive,
  Trash2,
  Download,
  RefreshCw,
  Volume2,
  VolumeX,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Navigation,
  Search,
  Calendar,
  BarChart3,
  Heart,
  MessageSquare,
  Upload,
  Save,
  RotateCcw,
  Sliders,
  Globe,
  Home,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import clsx from "clsx";
import DOMPurify from "dompurify";

dayjs.extend(relativeTime);

// Types and Interfaces
interface Location {
  lat: number;
  lng: number;
}

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location: {
    name: string;
    coordinates: Location;
  };
  timestamp: string;
  type: string;
  distance?: number;
  isRead?: boolean;
  actionRequired?: boolean;
  estimatedDuration?: string;
  tags?: string[];
  source?: string;
  affectedAreas?: string[];
  responseTime?: string;
  priority?: number;
  category?:
    | "weather"
    | "traffic"
    | "emergency"
    | "health"
    | "security"
    | "utility"
    | "community";
  relatedAlerts?: number[];
  instructions?: string[];
  contactInfo?: {
    emergency?: string;
    support?: string;
    website?: string;
  };
  updates?: {
    timestamp: string;
    message: string;
    severity?: string;
  }[];
}

interface AlertSystemProps {
  currentLocation: Location | null;
  enableGeofencing?: boolean;
  maxAlerts?: number;
  websocketUrl?: string;
  analyticsEnabled?: boolean;
  selectedLanguage?: "en" | "hi";
  userName?: string;
  enableNotifications?: boolean;
  theme?: "light" | "dark";
}

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";
type CategoryFilter =
  | "all"
  | "weather"
  | "traffic"
  | "emergency"
  | "health"
  | "security"
  | "utility"
  | "community";
type SortBy = "timestamp" | "distance" | "severity" | "relevance";

interface UserPreferences {
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  autoArchive: boolean;
  smartFiltering: boolean;
  locationRadius: number;
  preferredCategories: string[];
  mutedKeywords: string[];
  emergencyContacts: string[];
}

interface AlertStats {
  total: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  todayCount: number;
  weekCount: number;
  avgResponseTime: string;
  mostActiveArea: string;
}

// Alert state management with useReducer
type AlertAction =
  | { type: "SET_ALERTS"; payload: Alert[] }
  | { type: "ADD_ALERT"; payload: Alert }
  | { type: "UPDATE_ALERT"; payload: { id: number; updates: Partial<Alert> } }
  | { type: "MARK_READ"; payload: number }
  | { type: "ARCHIVE"; payload: number }
  | { type: "DELETE"; payload: number }
  | { type: "TOGGLE_STAR"; payload: number }
  | {
      type: "BULK_ACTION";
      payload: { ids: number[]; action: "archive" | "delete" | "read" };
    };

interface AlertState {
  alerts: Alert[];
  archived: Set<number>;
  starred: Set<number>;
  deleted: Set<number>;
}

const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case "SET_ALERTS":
      return { ...state, alerts: action.payload };
    case "ADD_ALERT":
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case "UPDATE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload.id
            ? { ...alert, ...action.payload.updates }
            : alert
        ),
      };
    case "MARK_READ":
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload ? { ...alert, isRead: true } : alert
        ),
      };
    case "ARCHIVE":
      return {
        ...state,
        archived: new Set([...state.archived, action.payload]),
      };
    case "DELETE":
      return {
        ...state,
        deleted: new Set([...state.deleted, action.payload]),
      };
    case "TOGGLE_STAR":
      const newStarred = new Set(state.starred);
      if (newStarred.has(action.payload)) {
        newStarred.delete(action.payload);
      } else {
        newStarred.add(action.payload);
      }
      return { ...state, starred: newStarred };
    case "BULK_ACTION":
      const { ids, action: bulkAction } = action.payload;
      switch (bulkAction) {
        case "archive":
          return {
            ...state,
            archived: new Set([...state.archived, ...ids]),
          };
        case "delete":
          return {
            ...state,
            deleted: new Set([...state.deleted, ...ids]),
          };
        case "read":
          return {
            ...state,
            alerts: state.alerts.map((alert) =>
              ids.includes(alert.id) ? { ...alert, isRead: true } : alert
            ),
          };
        default:
          return state;
      }
    default:
      return state;
  }
};

const AlertSystem: React.FC<AlertSystemProps> = ({
  currentLocation,
  enableGeofencing = true,
  maxAlerts = 100,
  websocketUrl,
  analyticsEnabled = false,
  selectedLanguage = "en",
  userName = "User",
  enableNotifications = true,
  theme = "light",
}) => {
  // Enhanced state management
  const [state, dispatch] = useReducer(alertReducer, {
    alerts: [],
    archived: new Set(),
    starred: new Set(),
    deleted: new Set(),
  });

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("timestamp");
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null);

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    notifications: enableNotifications,
    sound: true,
    vibration: true,
    autoArchive: false,
    smartFiltering: true,
    locationRadius: 50,
    preferredCategories: ["emergency", "weather", "security"],
    mutedKeywords: [],
    emergencyContacts: [],
  });

  const wsRef = useRef<WebSocket | null>(null);
  const notificationRef = useRef<Notification | null>(null);

  // Enhanced translations with Hindi support
  const translations = {
    en: {
      activeAlerts: "Active Alerts",
      archivedAlerts: "Archived Alerts",
      starredAlerts: "Starred Alerts",
      noActiveAlerts: "No active alerts!",
      allCaughtUp: "You're all caught up! Stay alert for updates.",
      viewOnMap: "View Details",
      shareAlert: "Share Alert",
      dismiss: "Dismiss",
      close: "Close",
      showArchived: "Show archived",
      hideArchived: "Hide archived",
      distance: "away",
      filterBySeverity: "Filter by severity",
      alertDismissed: "Alert dismissed",
      alertCopied: "Alert copied to clipboard",
      actionRequired: "Action Required",
      estimatedDuration: "Est. Duration",
      allSeverities: "All Severities",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      location: "Location",
      time: "Time",
      severity: "Severity",
      details: "Details",
      instructions: "Instructions",
      interactiveMapView: "Interactive Map View",
      loading: "Loading...",
      offline: "You're currently offline. Some features may not work.",
      connecting: "Connecting...",
      connected: "Connected",
      newAlert: "New alert received",
      settings: "Settings",
      statistics: "Statistics",
      preferences: "Preferences",
      notifications: "Notifications",
      soundEnabled: "Sound Alerts",
      vibrationEnabled: "Vibration",
      autoArchive: "Auto Archive Read Alerts",
      smartFiltering: "Smart Location Filtering",
      locationRadius: "Location Radius (km)",
      search: "Search alerts...",
      sortBy: "Sort by",
      timestamp: "Time",
      relevance: "Relevance",
      bulkActions: "Bulk Actions",
      selectAll: "Select All",
      markAllRead: "Mark All Read",
      archiveSelected: "Archive Selected",
      deleteSelected: "Delete Selected",
      selected: "selected",
      clearSelection: "Clear Selection",
      todayAlerts: "Today's Alerts",
      weekAlerts: "This Week",
      totalAlerts: "Total Alerts",
      categories: "Categories",
      weather: "Weather",
      traffic: "Traffic",
      emergency: "Emergency",
      health: "Health",
      security: "Security",
      utility: "Utility",
      community: "Community",
      all: "All",
      export: "Export Data",
      import: "Import Settings",
      backup: "Backup",
      restore: "Restore",
      save: "Save",
      cancel: "Cancel",
      reset: "Reset",
      updates: "Updates",
      contact: "Contact",
      emergencyContact: "Emergency",
      supportContact: "Support",
      website: "Website",
      source: "Source",
      affectedAreas: "Affected Areas",
      responseTime: "Response Time",
      relatedAlerts: "Related Alerts",
    },
    hi: {
      activeAlerts: "सक्रिय अलर्ट",
      archivedAlerts: "संग्रहीत अलर्ट",
      starredAlerts: "तारांकित अलर्ट",
      noActiveAlerts: "कोई सक्रिय अलर्ट नहीं!",
      allCaughtUp: "आप सभी अपडेट देख चुके हैं! अपडेट के लिए सतर्क रहें।",
      viewOnMap: "विवरण देखें",
      shareAlert: "अलर्ट साझा करें",
      dismiss: "खारिज करें",
      close: "बंद करें",
      showArchived: "संग्रहीत दिखाएं",
      hideArchived: "संग्रहीत छुपाएं",
      distance: "दूर",
      filterBySeverity: "गंभीरता से फ़िल्टर करें",
      alertDismissed: "अलर्ट खारिज कर दिया गया",
      alertCopied: "अलर्ट क्लिपबोर्ड पर कॉपी किया गया",
      actionRequired: "कार्रवाई आवश्यक",
      estimatedDuration: "अनुमानित अवधि",
      allSeverities: "सभी गंभीरताएं",
      critical: "गंभीर",
      high: "उच्च",
      medium: "मध्यम",
      low: "कम",
      location: "स्थान",
      time: "समय",
      severity: "गंभीरता",
      details: "विवरण",
      instructions: "निर्देश",
      interactiveMapView: "इंटरैक्टिव मैप व्यू",
      loading: "लोड हो रहा है...",
      offline: "आप वर्तमान में ऑफ़लाइन हैं। कुछ सुविधाएं काम नहीं कर सकती हैं।",
      connecting: "कनेक्ट हो रहा है...",
      connected: "कनेक्ट हो गया",
      newAlert: "नया अलर्ट प्राप्त हुआ",
      settings: "सेटिंग्स",
      statistics: "आंकड़े",
      preferences: "प्राथमिकताएं",
      notifications: "सूचनाएं",
      soundEnabled: "ध्वनि अलर्ट",
      vibrationEnabled: "कंपन",
      autoArchive: "पढ़े गए अलर्ट को स्वचालित संग्रहीत करें",
      smartFiltering: "स्मार्ट स्थान फ़िल्टरिंग",
      locationRadius: "स्थान त्रिज्या (किमी)",
      search: "अलर्ट खोजें...",
      sortBy: "इसके अनुसार क्रमबद्ध करें",
      timestamp: "समय",
      relevance: "प्रासंगिकता",
      bulkActions: "बल्क एक्शन",
      selectAll: "सभी चुनें",
      markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
      archiveSelected: "चयनित को संग्रहीत करें",
      deleteSelected: "चयनित को हटाएं",
      selected: "चयनित",
      clearSelection: "चयन साफ़ करें",
      todayAlerts: "आज के अलर्ट",
      weekAlerts: "इस सप्ताह",
      totalAlerts: "कुल अलर्ट",
      categories: "श्रेणियां",
      weather: "मौसम",
      traffic: "यातायात",
      emergency: "आपातकाल",
      health: "स्वास्थ्य",
      security: "सुरक्षा",
      utility: "उपयोगिता",
      community: "समुदाय",
      all: "सभी",
      export: "डेटा निर्यात करें",
      import: "सेटिंग्स आयात करें",
      backup: "बैकअप",
      restore: "पुनर्स्थापना",
      save: "सहेजें",
      cancel: "रद्द करें",
      reset: "रीसेट करें",
      updates: "अपडेट",
      contact: "संपर्क",
      emergencyContact: "आपातकाल",
      supportContact: "सहायता",
      website: "वेबसाइट",
      source: "स्रोत",
      affectedAreas: "प्रभावित क्षेत्र",
      responseTime: "प्रतिक्रिया समय",
      relatedAlerts: "संबंधित अलर्ट",
    },
  };

  const t = translations[selectedLanguage];

  // Enhanced severity configuration
  const severityConfig = useMemo(
    () => ({
      low: {
        icon: Info,
        bg: "bg-blue-50 hover:bg-blue-100",
        border: "border-l-4 border-blue-500",
        text: "text-blue-800",
        badge: "bg-blue-100 text-blue-800",
        iconBg: "bg-blue-500",
        priority: 1,
        color: "#3B82F6",
        pulse: false,
      },
      medium: {
        icon: AlertTriangle,
        bg: "bg-yellow-50 hover:bg-yellow-100",
        border: "border-l-4 border-yellow-500",
        text: "text-yellow-800",
        badge: "bg-yellow-100 text-yellow-800",
        iconBg: "bg-yellow-500",
        priority: 2,
        color: "#EAB308",
        pulse: false,
      },
      high: {
        icon: AlertTriangle,
        bg: "bg-orange-50 hover:bg-orange-100",
        border: "border-l-4 border-orange-500",
        text: "text-orange-800",
        badge: "bg-orange-100 text-orange-800",
        iconBg: "bg-orange-500",
        priority: 3,
        color: "#F97316",
        pulse: true,
      },
      critical: {
        icon: AlertTriangle,
        bg: "bg-red-50 hover:bg-red-100",
        border: "border-l-4 border-red-500",
        text: "text-red-800",
        badge: "bg-red-100 text-red-800",
        iconBg: "bg-red-500",
        priority: 4,
        color: "#EF4444",
        pulse: true,
      },
    }),
    []
  );

  // Calculate alert statistics
  const calculateStats = useCallback((alerts: Alert[]): AlertStats => {
    const now = dayjs();
    const todayStart = now.startOf("day");
    const weekStart = now.startOf("week");

    const todayAlerts = alerts.filter((alert) =>
      dayjs(alert.timestamp).isAfter(todayStart)
    );
    const weekAlerts = alerts.filter((alert) =>
      dayjs(alert.timestamp).isAfter(weekStart)
    );

    const byCategory = alerts.reduce((acc, alert) => {
      acc[alert.category || "other"] =
        (acc[alert.category || "other"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeverity = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationCounts = alerts.reduce((acc, alert) => {
      acc[alert.location.name] = (acc[alert.location.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveArea =
      Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    return {
      total: alerts.length,
      byCategory,
      bySeverity,
      todayCount: todayAlerts.length,
      weekCount: weekAlerts.length,
      avgResponseTime: "5-10 minutes",
      mostActiveArea,
    };
  }, []);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Geofencing check
  const isAlertRelevant = useCallback(
    (alert: Alert) => {
      if (!enableGeofencing || !currentLocation) return true;

      const distance = calculateDistance(alert.location.coordinates);
      if (distance === null) return true;

      const relevanceRadius = {
        critical: 50, // km
        high: 20,
        medium: 10,
        low: 5,
      };

      return distance <= relevanceRadius[alert.severity];
    },
    [enableGeofencing, currentLocation]
  );

  // Check if alert should be shown based on user preferences
  const shouldShowAlert = useCallback(
    (alert: Alert) => {
      // Check muted keywords
      const isMuted = userPreferences.mutedKeywords.some(
        (keyword) =>
          alert.title.toLowerCase().includes(keyword.toLowerCase()) ||
          alert.description.toLowerCase().includes(keyword.toLowerCase())
      );
      if (isMuted) return false;

      // Check preferred categories
      if (userPreferences.preferredCategories.length > 0 && alert.category) {
        if (!userPreferences.preferredCategories.includes(alert.category)) {
          return alert.severity === "critical"; // Always show critical alerts
        }
      }

      // Check geofencing
      if (enableGeofencing && !isAlertRelevant(alert)) {
        return alert.severity === "critical"; // Always show critical alerts
      }

      return true;
    },
    [userPreferences, enableGeofencing, isAlertRelevant]
  );

  // Distance calculation
  const calculateDistance = useCallback(
    (alertLocation: Location) => {
      if (!currentLocation) return null;
      const R = 6371;
      const dLat = ((alertLocation.lat - currentLocation.lat) * Math.PI) / 180;
      const dLng = ((alertLocation.lng - currentLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((currentLocation.lat * Math.PI) / 180) *
          Math.cos((alertLocation.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    [currentLocation]
  );

  // Analytics tracking
  const trackAlertInteraction = useCallback(
    (action: string, alertId: number) => {
      if (!analyticsEnabled) return;

      // Google Analytics 4
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", action, {
          event_category: "alert_system",
          event_label: alertId.toString(),
          value: 1,
        });
      }

      // Custom analytics endpoint
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          alertId,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    },
    [analyticsEnabled]
  );

  // Enhanced notification system
  const showNotification = useCallback(
    (alert: Alert) => {
      if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      const config = severityConfig[alert.severity];
      notificationRef.current = new Notification(alert.title, {
        body: alert.description,
        icon: "/notification-icon.png",
        badge: "/notification-badge.png",
        tag: `alert-${alert.id}`,
        requireInteraction: alert.severity === "critical",
        silent: !userPreferences.sound,
        timestamp: Date.now(),
        data: { alertId: alert.id },
      });

      notificationRef.current.onclick = () => {
        setSelectedAlert(alert);
        window.focus();
      };

      // Auto-close after timeout (except for critical alerts)
      if (alert.severity !== "critical") {
        setTimeout(() => {
          if (notificationRef.current) {
            notificationRef.current.close();
          }
        }, 8000);
      }
    },
    [severityConfig, userPreferences.sound]
  );

  // Sound notification system
  const playNotificationSound = useCallback(
    (severity: string) => {
      if (!userPreferences.sound) return;

      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const frequencies = {
          low: 440,
          medium: 554,
          high: 659,
          critical: 880,
        };

        oscillator.frequency.setValueAtTime(
          frequencies[severity as keyof typeof frequencies] || 440,
          audioContext.currentTime
        );

        oscillator.type = severity === "critical" ? "sawtooth" : "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        // Multiple beeps for critical alerts
        if (severity === "critical") {
          setTimeout(() => playNotificationSound("critical"), 600);
        }
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    },
    [userPreferences.sound]
  );

  // Vibration patterns
  const getVibrationPattern = useCallback((severity: string) => {
    const patterns = {
      low: [100],
      medium: [100, 50, 100],
      high: [200, 100, 200, 100, 200],
      critical: [300, 100, 300, 100, 300, 100, 300],
    };
    return patterns[severity as keyof typeof patterns] || [100];
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (websocketUrl && isOnline) {
      const connectWebSocket = () => {
        const ws = new WebSocket(websocketUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
          showToast(t.connected, "success");
        };

        ws.onmessage = (event) => {
          try {
            const newAlert: Alert = JSON.parse(event.data);

            // Sanitize alert content
            newAlert.title = DOMPurify.sanitize(newAlert.title);
            newAlert.description = DOMPurify.sanitize(newAlert.description);

            // Check if alert should be shown
            if (shouldShowAlert(newAlert)) {
              dispatch({ type: "ADD_ALERT", payload: newAlert });

              // Show notification if enabled
              if (userPreferences.notifications && "Notification" in window) {
                showNotification(newAlert);
              }

              // Play sound if enabled
              if (userPreferences.sound) {
                playNotificationSound(newAlert.severity);
              }

              // Vibrate if enabled and supported
              if (userPreferences.vibration && "vibrate" in navigator) {
                navigator.vibrate(getVibrationPattern(newAlert.severity));
              }

              showToast(t.newAlert, "info");
            }

            if (analyticsEnabled) {
              trackAlertInteraction("alert_received", newAlert.id);
            }
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          showToast("Connection error", "error");
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (isOnline) {
              connectWebSocket();
            }
          }, 5000);
        };
      };

      connectWebSocket();

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [
    websocketUrl,
    isOnline,
    userPreferences,
    shouldShowAlert,
    showNotification,
    playNotificationSound,
    getVibrationPattern,
    t.connected,
    t.newAlert,
    analyticsEnabled,
    trackAlertInteraction,
  ]);

  // Load mock data
  useEffect(() => {
    const loadAlerts = () => {
      setIsLoading(true);

      const mockAlerts: Alert[] = [
        {
          id: 1,
          title: "Flash Flood Warning",
          description:
            "Heavy rainfall has caused flash flooding in downtown areas. Avoid driving through flooded streets. Emergency shelters are open at Community Center and High School.",
          severity: "critical",
          location: {
            name: "Downtown Commercial District",
            coordinates: { lat: 37.7749, lng: -122.4194 },
          },
          timestamp: dayjs().subtract(15, "minute").toISOString(),
          type: "weather",
          category: "weather",
          distance: 0.8,
          isRead: false,
          actionRequired: true,
          estimatedDuration: "6-8 hours",
          tags: ["flood", "emergency", "shelter"],
          source: "National Weather Service",
          affectedAreas: ["Downtown", "Financial District", "SoMa"],
          responseTime: "Immediate",
          priority: 4,
          instructions: [
            "Stay indoors and avoid unnecessary travel",
            "Do not drive through flooded roads",
            "Move to higher ground if in low-lying areas",
            "Contact emergency services if trapped",
          ],
          contactInfo: {
            emergency: "911",
            support: "1-800-FLOOD-HELP",
            website: "weather.gov/flood-safety",
          },
          updates: [
            {
              timestamp: dayjs().subtract(5, "minute").toISOString(),
              message:
                "Water levels rising. Evacuation recommended for River Street area.",
            },
          ],
        },
        {
          id: 2,
          title: "Major Traffic Accident - Highway Closure",
          description:
            "Multi-vehicle collision on Highway 101 northbound. All lanes closed between exits 12-15. Emergency responders on scene. Expect major delays.",
          severity: "high",
          location: {
            name: "Highway 101 North",
            coordinates: { lat: 37.7849, lng: -122.4094 },
          },
          timestamp: dayjs().subtract(45, "minute").toISOString(),
          type: "traffic",
          category: "traffic",
          distance: 2.3,
          isRead: false,
          estimatedDuration: "3-4 hours",
          tags: ["accident", "highway", "closure"],
          source: "Highway Patrol",
          affectedAreas: ["Highway 101", "Surface Streets"],
          responseTime: "2-3 hours",
          priority: 3,
          instructions: [
            "Use alternate routes: I-280 or surface streets",
            "Expect significant delays on alternate routes",
            "Consider delaying non-essential travel",
          ],
          contactInfo: {
            support: "511",
            website: "511.org",
          },
        },
        {
          id: 3,
          title: "Air Quality Alert - Unhealthy Conditions",
          description:
            "Air Quality Index has reached unhealthy levels due to wildfire smoke. Sensitive individuals should remain indoors. Schools canceling outdoor activities.",
          severity: "medium",
          location: {
            name: "Bay Area Region",
            coordinates: { lat: 37.7649, lng: -122.4294 },
          },
          timestamp: dayjs().subtract(2, "hour").toISOString(),
          type: "health",
          category: "health",
          distance: 0.0,
          isRead: false,
          actionRequired: false,
          estimatedDuration: "24-48 hours",
          tags: ["air quality", "smoke", "health"],
          source: "Air Quality Management District",
          affectedAreas: ["Entire Bay Area"],
          priority: 2,
          instructions: [
            "Stay indoors with windows and doors closed",
            "Use air purifiers if available",
            "Avoid outdoor exercise",
            "Wear N95 masks if you must go outside",
          ],
        },
        {
          id: 4,
          title: "Security Alert - Suspicious Activity",
          description:
            "Suspicious package reported near City Hall. Area cordoned off as precaution. Police investigating. Avoid the area until further notice.",
          severity: "high",
          location: {
            name: "City Hall Plaza",
            coordinates: { lat: 37.7549, lng: -122.4394 },
          },
          timestamp: dayjs().subtract(30, "minute").toISOString(),
          type: "security",
          category: "security",
          distance: 0.3,
          isRead: false,
          actionRequired: true,
          estimatedDuration: "2-3 hours",
          tags: ["security", "investigation", "evacuation"],
          source: "Police Department",
          priority: 3,
          instructions: [
            "Avoid City Hall area",
            "Use alternate entrances to nearby buildings",
            "Follow police instructions if in the area",
          ],
          contactInfo: {
            emergency: "911",
          },
        },
        {
          id: 5,
          title: "Power Outage - Equipment Failure",
          description:
            "Widespread power outage affecting 15,000 customers due to transformer failure. Repair crews dispatched. Estimated restoration by 8 PM.",
          severity: "medium",
          location: {
            name: "Sunset District",
            coordinates: { lat: 37.7449, lng: -122.4494 },
          },
          timestamp: dayjs().subtract(3, "hour").toISOString(),
          type: "utility",
          category: "utility",
          distance: 3.2,
          isRead: true,
          actionRequired: false,
          estimatedDuration: "4-6 hours",
          tags: ["power", "outage", "utility"],
          source: "Electric Company",
          affectedAreas: ["Sunset District", "Richmond District"],
          priority: 2,
          instructions: [
            "Use flashlights instead of candles",
            "Keep refrigerator doors closed",
            "Check on elderly neighbors",
            "Report additional outages",
          ],
          contactInfo: {
            support: "1-800-POWER-OUT",
          },
        },
        {
          id: 6,
          title: "Community Event - Street Festival",
          description:
            "Annual street festival happening this weekend on Mission Street. Road closures in effect. Live music, food vendors, and local artisans.",
          severity: "low",
          location: {
            name: "Mission Street",
            coordinates: { lat: 37.7349, lng: -122.4594 },
          },
          timestamp: dayjs().subtract(5, "hour").toISOString(),
          type: "community",
          category: "community",
          distance: 1.2,
          isRead: true,
          tags: ["festival", "community", "entertainment"],
          source: "City Events Office",
          priority: 1,
        },
        {
          id: 7,
          title: "Water Service Maintenance",
          description:
            "Scheduled water main maintenance will interrupt service on Oak Street between 1st and 5th Ave from 2 AM to 6 AM tomorrow.",
          severity: "medium",
          location: {
            name: "Oak Street Corridor",
            coordinates: { lat: 37.7249, lng: -122.4694 },
          },
          timestamp: dayjs().subtract(4, "hour").toISOString(),
          type: "utility",
          category: "utility",
          distance: 2.1,
          isRead: true,
          actionRequired: false,
          estimatedDuration: "4 hours",
          tags: ["water", "maintenance", "scheduled"],
          source: "Water Department",
          priority: 2,
          instructions: [
            "Store water for essential needs",
            "Plan accordingly for morning routines",
            "Business owners prepare for service interruption",
          ],
        },
        {
          id: 8,
          title: "Medical Emergency Response",
          description:
            "Large-scale medical emergency at convention center. Multiple ambulances dispatched. Area around convention center experiencing heavy emergency vehicle traffic.",
          severity: "high",
          location: {
            name: "Convention Center",
            coordinates: { lat: 37.7149, lng: -122.4794 },
          },
          timestamp: dayjs().subtract(25, "minute").toISOString(),
          type: "emergency",
          category: "emergency",
          distance: 0.5,
          isRead: false,
          actionRequired: true,
          tags: ["medical", "emergency", "traffic"],
          source: "Emergency Services",
          priority: 3,
          instructions: [
            "Avoid convention center area",
            "Give way to emergency vehicles",
            "Do not go to area unless essential",
          ],
        },
      ];

      // Filter alerts based on user preferences and location
      const filteredAlerts = mockAlerts.filter((alert) =>
        shouldShowAlert(alert)
      );

      dispatch({ type: "SET_ALERTS", payload: filteredAlerts });
      setAlertStats(calculateStats(filteredAlerts));
      setIsLoading(false);
    };

    setTimeout(loadAlerts, 800);
  }, [shouldShowAlert, calculateStats]);

  // Time ago helper
  const getTimeAgo = useCallback(
    (timestamp: string) => dayjs(timestamp).fromNow(),
    []
  );

  // Enhanced filtering and sorting
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = state.alerts.filter((alert) => {
      // Basic filters
      if (showArchived && !state.archived.has(alert.id)) return false;
      if (!showArchived && state.archived.has(alert.id)) return false;
      if (showStarred && !state.starred.has(alert.id)) return false;
      if (state.deleted.has(alert.id)) return false;

      // Severity filter
      if (severityFilter !== "all" && alert.severity !== severityFilter)
        return false;

      // Category filter
      if (categoryFilter !== "all" && alert.category !== categoryFilter)
        return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          alert.title.toLowerCase().includes(searchLower) ||
          alert.description.toLowerCase().includes(searchLower) ||
          alert.location.name.toLowerCase().includes(searchLower) ||
          alert.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "severity":
          return (
            severityConfig[b.severity].priority -
            severityConfig[a.severity].priority
          );
        case "distance":
          return (a.distance ?? Infinity) - (b.distance ?? Infinity);
        case "relevance":
          // Custom relevance scoring
          const aScore = getRelevanceScore(a);
          const bScore = getRelevanceScore(b);
          return bScore - aScore;
        case "timestamp":
        default:
          return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf();
      }
    });

    return filtered;
  }, [
    state.alerts,
    state.archived,
    state.starred,
    state.deleted,
    showArchived,
    showStarred,
    severityFilter,
    categoryFilter,
    searchTerm,
    sortBy,
    severityConfig,
  ]);

  // Calculate relevance score for sorting
  const getRelevanceScore = useCallback(
    (alert: Alert) => {
      let score = 0;

      // Severity weight
      score += severityConfig[alert.severity].priority * 10;

      // Distance weight (closer = higher score)
      if (alert.distance) {
        score += Math.max(0, 50 - alert.distance);
      }

      // Recency weight
      const hoursAgo = dayjs().diff(dayjs(alert.timestamp), "hour");
      score += Math.max(0, 24 - hoursAgo);

      // Action required weight
      if (alert.actionRequired) score += 20;

      // Unread weight
      if (!alert.isRead) score += 15;

      return score;
    },
    [severityConfig]
  );

  // Enhanced toast notification
  const showToast = useCallback(
    (
      message: string,
      type: "success" | "info" | "warning" | "error" = "info"
    ) => {
      const toast = document.createElement("div");
      const colors = {
        success: "bg-green-500 text-white",
        info: "bg-blue-500 text-white",
        warning: "bg-yellow-500 text-white",
        error: "bg-red-500 text-white",
      };

      toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full opacity-0 ${colors[type]}`;
      toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    `;
      document.body.appendChild(toast);

      // Animate in
      setTimeout(() => {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
      }, 10);

      // Auto remove
      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.style.opacity = "0";
          toast.style.transform = "translateX(100%)";
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, 300);
        }
      }, 5000);
    },
    []
  );

  // Enhanced handlers
  const handleShareAlert = useCallback(
    async (alert: Alert) => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: alert.title,
            text: alert.description,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(
            `${alert.title}: ${alert.description}`
          );
          showToast(t.alertCopied, "success");
        }

        if (analyticsEnabled) {
          trackAlertInteraction("alert_shared", alert.id);
        }
      } catch (error) {
        console.error("Share failed:", error);
        showToast("Failed to share alert", "error");
      }
    },
    [showToast, t.alertCopied, analyticsEnabled, trackAlertInteraction]
  );

  const handleBulkAction = useCallback(
    (action: "archive" | "delete" | "read") => {
      const ids = Array.from(selectedAlerts);
      dispatch({ type: "BULK_ACTION", payload: { ids, action } });
      setSelectedAlerts(new Set());
      setShowBulkActions(false);

      const actionLabels = {
        archive: "archived",
        delete: "deleted",
        read: "marked as read",
      };

      showToast(`${ids.length} alerts ${actionLabels[action]}`, "success");
    },
    [selectedAlerts, showToast]
  );

  // Export/Import functionality
  const handleExportData = useCallback(() => {
    const data = {
      alerts: state.alerts,
      preferences: userPreferences,
      stats: alertStats,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alert-system-data-${dayjs().format("YYYY-MM-DD")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Data exported successfully", "success");
  }, [state.alerts, userPreferences, alertStats, showToast]);

  const handleImportData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.preferences) {
            setUserPreferences(data.preferences);
            showToast("Settings imported successfully", "success");
          }
        } catch (error) {
          showToast("Failed to import data", "error");
        }
      };
      reader.readAsText(file);
    },
    [showToast]
  );

  // Settings Component
  const SettingsModal = () => (
    <Dialog.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-50">
          <Dialog.Title className="text-2xl font-bold text-gray-900 p-6 pb-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <span>{t.settings}</span>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </Dialog.Title>

          <div className="p-6 space-y-6">
            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t.notifications}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{t.notifications}</div>
                    <div className="text-sm text-gray-500">
                      Receive push notifications for new alerts
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.notifications}
                      onChange={(e) =>
                        setUserPreferences((prev) => ({
                          ...prev,
                          notifications: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{t.soundEnabled}</div>
                    <div className="text-sm text-gray-500">
                      Play sound for alert notifications
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.sound}
                      onChange={(e) =>
                        setUserPreferences((prev) => ({
                          ...prev,
                          sound: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{t.vibrationEnabled}</div>
                    <div className="text-sm text-gray-500">
                      Vibrate device for alerts
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.vibration}
                      onChange={(e) =>
                        setUserPreferences((prev) => ({
                          ...prev,
                          vibration: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Filtering Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Smart Filtering
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{t.smartFiltering}</div>
                    <div className="text-sm text-gray-500">
                      Filter alerts based on your location
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userPreferences.smartFiltering}
                      onChange={(e) =>
                        setUserPreferences((prev) => ({
                          ...prev,
                          smartFiltering: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="block font-medium mb-2">
                    {t.locationRadius}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={userPreferences.locationRadius}
                    onChange={(e) =>
                      setUserPreferences((prev) => ({
                        ...prev,
                        locationRadius: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5 km</span>
                    <span className="font-medium">
                      {userPreferences.locationRadius} km
                    </span>
                    <span>100 km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Preferred Categories
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  "weather",
                  "traffic",
                  "emergency",
                  "health",
                  "security",
                  "utility",
                  "community",
                ].map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={userPreferences.preferredCategories.includes(
                        category
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUserPreferences((prev) => ({
                            ...prev,
                            preferredCategories: [
                              ...prev.preferredCategories,
                              category,
                            ],
                          }));
                        } else {
                          setUserPreferences((prev) => ({
                            ...prev,
                            preferredCategories:
                              prev.preferredCategories.filter(
                                (c) => c !== category
                              ),
                          }));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="capitalize">
                      {t[category as keyof typeof t] || category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Data Management
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t.export}
                </button>

                <label className="flex items-center justify-center gap-2 p-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {t.import}
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  showToast("Settings saved", "success");
                }}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t.save}
              </button>
              <button
                onClick={() =>
                  setUserPreferences({
                    notifications: true,
                    sound: true,
                    vibration: true,
                    autoArchive: false,
                    smartFiltering: true,
                    locationRadius: 50,
                    preferredCategories: ["emergency", "weather", "security"],
                    mutedKeywords: [],
                    emergencyContacts: [],
                  })
                }
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  // Enhanced Alert Card Component
  const AlertCard = React.memo(({ alert }: { alert: Alert }) => {
    const config = severityConfig[alert.severity];
    const distance = calculateDistance
      ? calculateDistance(alert.location.coordinates)
      : alert.distance;
    const Icon = config.icon;
    const isSelected = selectedAlerts.has(alert.id);
    const isStarred = state.starred.has(alert.id);

    return (
      <motion.div
        layout
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={clsx(
          "relative rounded-xl shadow-sm transition-all duration-200 cursor-pointer group border",
          config.bg,
          config.border,
          !alert.isRead && "ring-2 ring-blue-200 ring-opacity-50",
          isSelected && "ring-4 ring-blue-400",
          config.pulse && alert.severity === "critical" && "animate-pulse"
        )}
      >
        {/* Selection checkbox */}
        {showBulkActions && (
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                const newSelected = new Set(selectedAlerts);
                if (e.target.checked) {
                  newSelected.add(alert.id);
                } else {
                  newSelected.delete(alert.id);
                }
                setSelectedAlerts(newSelected);
              }}
              className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        )}

        {/* Unread indicator */}
        {!alert.isRead && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}

        {/* Quick actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            className="p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "TOGGLE_STAR", payload: alert.id });
              showToast(
                isStarred ? "Removed from starred" : "Added to starred",
                "info"
              );
            }}
            title={isStarred ? "Remove from starred" : "Add to starred"}
          >
            <Star
              className={clsx(
                "w-4 h-4",
                isStarred ? "text-yellow-500 fill-current" : "text-gray-400"
              )}
            />
          </button>

          <button
            className="p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "ARCHIVE", payload: alert.id });
              showToast(t.alertDismissed, "success");
            }}
            title={t.dismiss}
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div
          className="p-4"
          onClick={() => {
            setSelectedAlert(alert);
            if (!alert.isRead) {
              dispatch({ type: "MARK_READ", payload: alert.id });
            }
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className={clsx(
                "p-2.5 rounded-full text-white flex-shrink-0",
                config.iconBg,
                config.pulse && alert.severity === "critical" && "animate-pulse"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3
                  className={clsx(
                    "font-bold text-lg leading-tight pr-2",
                    config.text
                  )}
                >
                  {alert.title}
                </h3>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  {alert.actionRequired && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full whitespace-nowrap">
                      {t.actionRequired}
                    </span>
                  )}
                  <span
                    className={clsx(
                      "px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap",
                      config.badge
                    )}
                  >
                    {t[alert.severity as keyof typeof t] ||
                      alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {alert.tags && alert.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {alert.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {alert.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{alert.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeAgo(alert.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{alert.location.name}</span>
                </div>
                {distance && (
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                    {distance.toFixed(1)}km {t.distance}
                  </span>
                )}
                {alert.estimatedDuration && (
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                    {t.estimatedDuration}: {alert.estimatedDuration}
                  </span>
                )}
                {alert.source && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {alert.source}
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                {alert.description}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAlert(alert);
                    if (!alert.isRead) {
                      dispatch({ type: "MARK_READ", payload: alert.id });
                    }
                  }}
                >
                  <Info className="w-4 h-4" />
                  {t.viewOnMap}
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareAlert(alert);
                  }}
                >
                  <Share className="w-4 h-4" />
                  {t.shareAlert}
                </button>
                {alert.actionRequired && (
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast("Emergency action initiated", "warning");
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Emergency
                  </button>
                )}
              </div>

              {/* Updates indicator */}
              {alert.updates && alert.updates.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {alert.updates.length} update
                      {alert.updates.length !== 1 ? "s" : ""} available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  // Enhanced Modal for Alert Details
  const AlertModal = () => (
    <Dialog.Root
      open={!!selectedAlert}
      onOpenChange={() => setSelectedAlert(null)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-50">
          {selectedAlert && (
            <>
              <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-3 p-6 pb-4 border-b">
                <div
                  className={clsx(
                    "p-2 rounded-full text-white",
                    severityConfig[selectedAlert.severity].iconBg
                  )}
                >
                  {React.createElement(
                    severityConfig[selectedAlert.severity].icon,
                    { className: "w-5 h-5" }
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedAlert.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={clsx(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        severityConfig[selectedAlert.severity].badge
                      )}
                    >
                      {t[selectedAlert.severity as keyof typeof t] ||
                        selectedAlert.severity.toUpperCase()}
                    </span>
                    {selectedAlert.actionRequired && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {t.actionRequired}
                      </span>
                    )}
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </Dialog.Close>
              </Dialog.Title>

              <div className="p-6 space-y-6">
                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {t.location}
                    </div>
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedAlert.location.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {t.time}
                    </div>
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getTimeAgo(selectedAlert.timestamp)}
                    </div>
                  </div>
                  {selectedAlert.estimatedDuration && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {t.estimatedDuration}
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedAlert.estimatedDuration}
                      </div>
                    </div>
                  )}
                  {selectedAlert.source && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {t.source}
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedAlert.source}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {t.details}
                  </h4>
                  <Dialog.Description className="text-gray-700 leading-relaxed">
                    {selectedAlert.description}
                  </Dialog.Description>
                </div>

                {/* Instructions */}
                {selectedAlert.instructions &&
                  selectedAlert.instructions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {t.instructions}
                      </h4>
                      <ul className="space-y-2">
                        {selectedAlert.instructions.map(
                          (instruction, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                {index + 1}
                              </span>
                              {instruction}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Affected Areas */}
                {selectedAlert.affectedAreas &&
                  selectedAlert.affectedAreas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        {t.affectedAreas}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAlert.affectedAreas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Contact Information */}
                {selectedAlert.contactInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {t.contact}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedAlert.contactInfo.emergency && (
                        <a
                          href={`tel:${selectedAlert.contactInfo.emergency}`}
                          className="flex items-center gap-2 p-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <div>
                            <div className="font-medium text-xs">
                              {t.emergencyContact}
                            </div>
                            <div className="font-bold">
                              {selectedAlert.contactInfo.emergency}
                            </div>
                          </div>
                        </a>
                      )}
                      {selectedAlert.contactInfo.support && (
                        <a
                          href={`tel:${selectedAlert.contactInfo.support}`}
                          className="flex items-center gap-2 p-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <div>
                            <div className="font-medium text-xs">
                              {t.supportContact}
                            </div>
                            <div className="font-bold">
                              {selectedAlert.contactInfo.support}
                            </div>
                          </div>
                        </a>
                      )}
                      {selectedAlert.contactInfo.website && (
                        <a
                          href={`https://${selectedAlert.contactInfo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <div>
                            <div className="font-medium text-xs">
                              {t.website}
                            </div>
                            <div className="font-bold truncate">
                              {selectedAlert.contactInfo.website}
                            </div>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Updates */}
                {selectedAlert.updates && selectedAlert.updates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      {t.updates}
                    </h4>
                    <div className="space-y-3">
                      {selectedAlert.updates.map((update, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">
                              Update #{selectedAlert.updates!.length - index}
                            </span>
                            <span className="text-xs text-blue-600">
                              {getTimeAgo(update.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-blue-900">
                            {update.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500 text-lg font-medium">
                      {t.interactiveMapView}
                    </span>
                    <p className="text-gray-400 text-sm mt-1">
                      Location: {selectedAlert.location.name}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleShareAlert(selectedAlert)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                  >
                    <Share className="w-4 h-4" />
                    {t.shareAlert}
                  </button>
                  <Dialog.Close asChild>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      {t.close}
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4 bg-white text-gray-900">
        <div className="text-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-blue-200 mx-auto animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t.loading}
          </h3>
          <p className="text-gray-500">Fetching latest alerts and updates...</p>
        </div>

        {/* Enhanced loading skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="rounded-full bg-gray-200 h-12 w-12 flex-shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 min-h-screen bg-white text-gray-900">
      {/* Enhanced header with statistics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              {showArchived
                ? t.archivedAlerts
                : showStarred
                ? t.starredAlerts
                : t.activeAlerts}
            </h1>
            <p className="text-gray-600 mt-1">
              {userName && `Welcome back, ${userName}! `}
              Stay informed about important updates in your area.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {wsRef.current?.readyState === WebSocket.OPEN && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t.connected}</span>
              </div>
            )}

            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={t.statistics}
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={t.settings}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        {alertStats && showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    {t.todayAlerts}
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {alertStats.todayCount}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    {t.weekAlerts}
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {alertStats.weekCount}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    {t.totalAlerts}
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {alertStats.total}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    Active Area
                  </p>
                  <p className="text-sm font-bold text-orange-900 truncate">
                    {alertStats.mostActiveArea}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Offline indicator */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 py-3 rounded-lg border bg-yellow-100 border-yellow-400 text-yellow-800 flex items-center gap-3"
        >
          <WifiOff className="w-5 h-5" />
          <div>
            <p className="font-medium">{t.offline}</p>
            <p className="text-sm">
              You're viewing cached alerts. Some features may be limited.
            </p>
          </div>
        </motion.div>
      )}

      {/* Enhanced controls */}
      <div className="mb-6 space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value as SeverityFilter)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t.allSeverities}</option>
              <option value="critical">{t.critical}</option>
              <option value="high">{t.high}</option>
              <option value="medium">{t.medium}</option>
              <option value="low">{t.low}</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as CategoryFilter)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t.all}</option>
              <option value="weather">{t.weather}</option>
              <option value="traffic">{t.traffic}</option>
              <option value="emergency">{t.emergency}</option>
              <option value="health">{t.health}</option>
              <option value="security">{t.security}</option>
              <option value="utility">{t.utility}</option>
              <option value="community">{t.community}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="timestamp">{t.timestamp}</option>
              <option value="severity">{t.severity}</option>
              <option value="distance">Distance</option>
              <option value="relevance">{t.relevance}</option>
            </select>
          </div>
        </div>

        {/* View toggles and bulk actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setShowArchived(!showArchived);
                setShowStarred(false);
              }}
              className={clsx(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                showArchived
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "border border-gray-300 hover:bg-gray-50"
              )}
            >
              <Archive className="w-4 h-4 inline mr-1" />
              {showArchived ? t.hideArchived : t.showArchived}
              {state.archived.size > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                  {state.archived.size}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setShowStarred(!showStarred);
                setShowArchived(false);
              }}
              className={clsx(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                showStarred
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "border border-gray-300 hover:bg-gray-50"
              )}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Starred
              {state.starred.size > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                  {state.starred.size}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredAndSortedAlerts.length} alert
              {filteredAndSortedAlerts.length !== 1 ? "s" : ""}
            </span>

            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className={clsx(
                "px-3 py-1.5 text-sm rounded-lg transition-colors border",
                showBulkActions
                  ? "bg-blue-100 text-blue-800 border-blue-300"
                  : "border-gray-300 hover:bg-gray-50"
              )}
            >
              <CheckCircle className="w-4 h-4 inline mr-1" />
              {t.bulkActions}
            </button>
          </div>
        </div>

        {/* Bulk actions bar */}
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const allIds = new Set(
                    filteredAndSortedAlerts.map((a) => a.id)
                  );
                  setSelectedAlerts(
                    selectedAlerts.size === allIds.size ? new Set() : allIds
                  );
                }}
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                {selectedAlerts.size === filteredAndSortedAlerts.length
                  ? "Deselect All"
                  : t.selectAll}
              </button>

              {selectedAlerts.size > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedAlerts.size} {t.selected}
                </span>
              )}
            </div>

            {selectedAlerts.size > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleBulkAction("read")}
                  className="px-3 py-1.5 text-sm bg-green-100 text-green-800 border border-green-300 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  {t.markAllRead}
                </button>

                <button
                  onClick={() => handleBulkAction("archive")}
                  className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <Archive className="w-4 h-4 inline mr-1" />
                  {t.archiveSelected}
                </button>

                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-800 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  {t.deleteSelected}
                </button>

                <button
                  onClick={() => {
                    setSelectedAlerts(new Set());
                    setShowBulkActions(false);
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.clearSelection}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Alerts list */}
      {filteredAndSortedAlerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            {showArchived ? (
              <Archive className="w-12 h-12 text-gray-400" />
            ) : showStarred ? (
              <Star className="w-12 h-12 text-gray-400" />
            ) : searchTerm ? (
              <Search className="w-12 h-12 text-gray-400" />
            ) : (
              <Bell className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            {showArchived
              ? "No archived alerts"
              : showStarred
              ? "No starred alerts"
              : searchTerm
              ? "No matching alerts"
              : t.noActiveAlerts}
          </h3>
          <p className="text-gray-500 max-w-md leading-relaxed">
            {showArchived
              ? "Alerts you dismiss will appear here for future reference."
              : showStarred
              ? "Star important alerts to access them quickly."
              : searchTerm
              ? `No alerts found matching "${searchTerm}". Try different keywords or adjust your filters.`
              : t.allCaughtUp}
          </p>

          {(showArchived || showStarred || searchTerm) && (
            <button
              onClick={() => {
                setShowArchived(false);
                setShowStarred(false);
                setSearchTerm("");
                setSeverityFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Active Alerts
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5),
                }}
              >
                <AlertCard alert={alert} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load more button if needed */}
      {filteredAndSortedAlerts.length >= 20 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              showToast("Loading more alerts...", "info");
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More Alerts
          </button>
        </div>
      )}

      {/* Modals */}
      <SettingsModal />
      <AlertModal />
    </div>
  );
};

export default AlertSystem;
