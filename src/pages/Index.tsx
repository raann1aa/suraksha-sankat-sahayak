import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Phone,
  MapPin,
  AlertTriangle,
  User,
  Camera,
  Send,
  Volume2,
  Settings,
  Shield,
  Navigation,
  Wifi,
  WifiOff,
  Battery,
  Zap,
  Bell,
  Map,
  Activity,
  Clock,
  Users,
  MessageSquare,
  BookOpen,
  Globe,
  Heart,
  Home,
  Car,
  Building,
  Hospital,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Enhanced components
import EmergencyContacts from "@/components/EmergencyContacts";
import FloodReporting from "@/components/FloodReporting";
import AlertSystem from "@/components/AlertSystem";
import UserProfile from "@/components/UserProfile";
import LanguageSelector from "@/components/LanguageSelector";
import EmergencyMap from "@/components/EmergencyMap";
import RealTimeWeather from "@/components/RealTimeWeather";
import SOSButton from "@/components/SOSButton";
import OfflineSync from "@/components/OfflineSync";
import CommunityFeed from "@/components/CommunityFeed";
import SafetyTips from "@/components/SafetyTips";
import EmergencyKits from "@/components/EmergencyKits";
import ReliefCenters from "@/components/ReliefCenters";

// Types
interface Location {
  lat: number;
  lng: number;
  address?: string;
  accuracy?: number;
}

interface EmergencyAlert {
  id: string;
  type: "flood" | "earthquake" | "fire" | "medical" | "security" | "weather";
  severity: "low" | "medium" | "high" | "critical";
  location: Location;
  timestamp: Date;
  message: string;
  radius: number;
}

interface SystemStatus {
  isOnline: boolean;
  batteryLevel: number;
  locationAccuracy: number;
  lastSync: Date | null;
  emergencyMode: boolean;
}

const Index = () => {
  // Core state
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    isOnline: navigator.onLine,
    batteryLevel: 100,
    locationAccuracy: 0,
    lastSync: null,
    emergencyMode: false,
  });

  // Emergency state
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [quickAccessEnabled, setQuickAccessEnabled] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Refs
  const locationWatchId = useRef<number | null>(null);
  const notificationPermission = useRef<NotificationPermission>("default");

  // Enhanced geolocation with continuous tracking
  const initializeLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your device doesn't support location services",
        variant: "destructive",
      });
      setIsLocationLoading(false);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(location);
        setSystemStatus((prev) => ({
          ...prev,
          locationAccuracy: position.coords.accuracy,
        }));
        setIsLocationLoading(false);

        // Reverse geocoding for address
        reverseGeocode(location);

        toast({
          title: "Location Updated",
          description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
          variant: "default",
        });
      },
      (error) => {
        console.error("Location error:", error);
        setIsLocationLoading(false);

        let message = "Unknown location error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location access denied. Enable GPS for emergency services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }

        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        });
      },
      options
    );

    // Watch position for continuous updates
    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(location);
        setSystemStatus((prev) => ({
          ...prev,
          locationAccuracy: position.coords.accuracy,
        }));
      },
      (error) => console.warn("Location watch error:", error),
      { ...options, maximumAge: 30000 }
    );
  }, []);

  // Reverse geocoding
  const reverseGeocode = async (location: Location) => {
    try {
      // This would typically use a geocoding service
      // For demo purposes, we'll simulate an address
      const address = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      setCurrentLocation((prev) => (prev ? { ...prev, address } : null));
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
    }
  };

  // Battery status monitoring
  const initializeBatteryStatus = useCallback(async () => {
    if ("getBattery" in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setSystemStatus((prev) => ({
          ...prev,
          batteryLevel: Math.round(battery.level * 100),
        }));

        battery.addEventListener("levelchange", () => {
          setSystemStatus((prev) => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
          }));
        });
      } catch (error) {
        console.warn("Battery API not available:", error);
      }
    }
  }, []);

  // Network status monitoring
  const handleOnlineStatus = useCallback(() => {
    setSystemStatus((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
    }));

    if (navigator.onLine) {
      toast({
        title: "Connection Restored",
        description: "Emergency services are now available",
        variant: "default",
      });
    } else {
      toast({
        title: "Connection Lost",
        description: "Working in offline mode. Some features limited.",
        variant: "destructive",
      });
    }
  }, []);

  // Emergency mode activation
  const activateEmergencyMode = useCallback(() => {
    setSystemStatus((prev) => ({ ...prev, emergencyMode: true }));
    setActiveTab("emergency");

    // Request permissions
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        notificationPermission.current = permission;
      });
    }

    // Increase location tracking frequency
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }

    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setCurrentLocation(location);
      },
      (error) => console.warn("Emergency location error:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );

    toast({
      title: "Emergency Mode Activated",
      description: "All emergency services are now prioritized",
      variant: "destructive",
    });
  }, []);

  // Initialize app
  useEffect(() => {
    initializeLocation();
    initializeBatteryStatus();

    // Network status listeners
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        notificationPermission.current = permission;
      });
    }

    // Keyboard shortcuts for emergency
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case "e":
            event.preventDefault();
            activateEmergencyMode();
            break;
          case "s":
            event.preventDefault();
            setIsSOSActive(true);
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    initializeLocation,
    initializeBatteryStatus,
    handleOnlineStatus,
    activateEmergencyMode,
  ]);

  // Enhanced translations
  const translations = {
    en: {
      appTitle: "Suraksha Sankat Sahayak",
      subtitle: "Emergency Management System",
      dashboard: "Dashboard",
      report: "Report",
      alerts: "Alerts",
      emergency: "Emergency",
      community: "Community",
      safety: "Safety",
      profile: "Profile",
      map: "Map",
      currentLocation: "Current Location",
      emergencyAlert: "Emergency Services Available 24/7",
      systemStatus: "System Status",
      batteryLevel: "Battery",
      locationAccuracy: "GPS Accuracy",
      onlineStatus: "Connection",
      emergencyMode: "Emergency Mode",
      quickAccess: "Quick Access",
      notifications: "Notifications",
      activeAlerts: "Active Alerts",
      nearbyServices: "Nearby Services",
      weatherConditions: "Weather",
      sosButton: "SOS Emergency",
      offlineMode: "Offline Mode",
      lastSync: "Last Sync",
    },
    hi: {
      appTitle: "सुरक्षा संकट सहायक",
      subtitle: "आपातकालीन प्रबंधन प्रणाली",
      dashboard: "डैशबोर्ड",
      report: "रिपोर्ट",
      alerts: "अलर्ट",
      emergency: "आपातकाल",
      community: "समुदाय",
      safety: "सुरक्षा",
      profile: "प्रोफाइल",
      map: "मानचित्र",
      currentLocation: "वर्तमान स्थान",
      emergencyAlert: "आपातकालीन सेवाएं 24/7 उपलब्ध",
      systemStatus: "सिस्टम स्थिति",
      batteryLevel: "बैटरी",
      locationAccuracy: "GPS सटीकता",
      onlineStatus: "कनेक्शन",
      emergencyMode: "आपातकालीन मोड",
      quickAccess: "त्वरित पहुंच",
      notifications: "सूचनाएं",
      activeAlerts: "सक्रिय अलर्ट",
      nearbyServices: "नजदीकी सेवाएं",
      weatherConditions: "मौसम",
      sosButton: "SOS आपातकाल",
      offlineMode: "ऑफलाइन मोड",
      lastSync: "अंतिम सिंक",
    },
    bn: {
      appTitle: "সুরক্ষা সঙ্কট সহায়ক",
      subtitle: "জরুরী ব্যবস্থাপনা সিস্টেম",
      dashboard: "ড্যাশবোর্ড",
      report: "রিপোর্ট",
      alerts: "সতর্কতা",
      emergency: "জরুরী",
      community: "সম্প্রদায়",
      safety: "নিরাপত্তা",
      profile: "প্রোফাইল",
      map: "মানচিত্র",
      currentLocation: "বর্তমান অবস্থান",
      emergencyAlert: "জরুরী সেবা ২৪/৭ উপলব্ধ",
      systemStatus: "সিস্টেম অবস্থা",
      batteryLevel: "ব্যাটারি",
      locationAccuracy: "GPS নির্ভুলতা",
      onlineStatus: "সংযোগ",
      emergencyMode: "জরুরী মোড",
      quickAccess: "দ্রুত অ্যাক্সেস",
      notifications: "বিজ্ঞপ্তি",
      activeAlerts: "সক্রিয় সতর্কতা",
      nearbyServices: "কাছাকাছি সেবা",
      weatherConditions: "আবহাওয়া",
      sosButton: "SOS জরুরী",
      offlineMode: "অফলাইন মোড",
      lastSync: "শেষ সিঙ্ক",
    },
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  // System status component
  const SystemStatusBar = () => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{t.systemStatus}</h3>
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-1">
              {systemStatus.isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-xs text-gray-600">
                {systemStatus.isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Battery Level */}
            <div className="flex items-center space-x-1">
              <Battery className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">
                {systemStatus.batteryLevel}%
              </span>
            </div>

            {/* Location Accuracy */}
            {currentLocation && (
              <div className="flex items-center space-x-1">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">
                  ±{Math.round(systemStatus.locationAccuracy)}m
                </span>
              </div>
            )}

            {/* Emergency Mode Toggle */}
            <div className="flex items-center space-x-1">
              <Shield
                className={cn(
                  "w-4 h-4",
                  systemStatus.emergencyMode ? "text-red-500" : "text-gray-400"
                )}
              />
              <Switch
                checked={systemStatus.emergencyMode}
                onCheckedChange={(checked) => {
                  if (checked) {
                    activateEmergencyMode();
                  } else {
                    setSystemStatus((prev) => ({
                      ...prev,
                      emergencyMode: false,
                    }));
                  }
                }}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Emergency Mode Indicator */}
        {systemStatus.emergencyMode && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-md flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-red-800 font-medium text-sm">
              Emergency Mode Active - All systems prioritized
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Quick actions component
  const QuickActions = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          {t.quickAccess}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="destructive"
            size="lg"
            className="h-16 flex-col space-y-1"
            onClick={() => setIsSOSActive(true)}
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs">{t.sosButton}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 flex-col space-y-1"
            onClick={() => setActiveTab("alerts")}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs">{t.alerts}</span>
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1">
                {activeAlerts.length}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 flex-col space-y-1"
            onClick={() => setActiveTab("map")}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">{t.map}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 flex-col space-y-1"
            onClick={() => setActiveTab("report")}
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs">{t.report}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 to-green-50",
        systemStatus.emergencyMode && "bg-red-50 border-t-4 border-red-500"
      )}
    >
      {/* Enhanced Header */}
      <header
        className={cn(
          "shadow-md p-4 sticky top-0 z-50 transition-colors duration-300",
          systemStatus.emergencyMode
            ? "bg-red-600 text-white"
            : darkMode
            ? "bg-gray-800 text-white"
            : "bg-white"
        )}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                systemStatus.emergencyMode
                  ? "bg-white text-red-600"
                  : "bg-blue-600 text-white"
              )}
            >
              {systemStatus.emergencyMode ? (
                <AlertTriangle className="w-7 h-7 animate-pulse" />
              ) : (
                <Shield className="w-7 h-7" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{t.appTitle}</h1>
              <p className="text-sm opacity-75">{t.subtitle}</p>
              {systemStatus.emergencyMode && (
                <Badge
                  variant="outline"
                  className="mt-1 border-white text-white"
                >
                  EMERGENCY ACTIVE
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            {/* Notification Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell
                className={cn("w-4 h-4", notifications && "text-yellow-500")}
              />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </Button>

            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Location Status */}
      {isLocationLoading ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-3 mx-4 mt-4 rounded flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-800">Getting your location...</span>
        </div>
      ) : currentLocation ? (
        <div className="bg-green-100 border-l-4 border-green-500 p-3 mx-4 mt-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                {t.currentLocation}:{" "}
              </span>
              <span className="text-green-700 ml-1">
                {currentLocation.address ||
                  `${currentLocation.lat.toFixed(
                    4
                  )}, ${currentLocation.lng.toFixed(4)}`}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-green-700 border-green-300"
            >
              ±{Math.round(systemStatus.locationAccuracy)}m
            </Badge>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mx-4 mt-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">
                Location access required for emergency services
              </span>
            </div>
            <Button size="sm" onClick={initializeLocation}>
              Enable GPS
            </Button>
          </div>
        </div>
      )}

      {/* Offline Status */}
      {!systemStatus.isOnline && (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-3 mx-4 mt-2 rounded">
          <div className="flex items-center">
            <WifiOff className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium">
              {t.offlineMode} - Limited functionality
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <SystemStatusBar />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={cn(
              "grid w-full grid-cols-4 lg:grid-cols-8 h-16 shadow-lg rounded-xl p-1 mb-6",
              systemStatus.emergencyMode
                ? "bg-red-100 border border-red-200"
                : "bg-white"
            )}
          >
            <TabsTrigger
              value="dashboard"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-medium">{t.dashboard}</span>
            </TabsTrigger>

            <TabsTrigger
              value="report"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs font-medium">{t.report}</span>
            </TabsTrigger>

            <TabsTrigger
              value="alerts"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 relative"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-medium">{t.alerts}</span>
              {activeAlerts.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                >
                  {activeAlerts.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="emergency"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-red-100 data-[state=active]:text-red-700"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">{t.emergency}</span>
            </TabsTrigger>

            <TabsTrigger
              value="map"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Map className="w-5 h-5" />
              <span className="text-xs font-medium">{t.map}</span>
            </TabsTrigger>

            <TabsTrigger
              value="community"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium">{t.community}</span>
            </TabsTrigger>

            <TabsTrigger
              value="safety"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs font-medium">{t.safety}</span>
            </TabsTrigger>

            <TabsTrigger
              value="profile"
              className="flex flex-col items-center space-y-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">{t.profile}</span>
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <TabsContent value="dashboard" className="space-y-4">
              <QuickActions />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RealTimeWeather
                  location={currentLocation}
                  selectedLanguage={selectedLanguage}
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-orange-500" />
                      {t.activeAlerts}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeAlerts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No active alerts in your area
                      </p>
                    ) : (
                      activeAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="mb-2 p-2 border-l-4 border-orange-500 bg-orange-50 rounded"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{alert.type}</span>
                            <Badge variant="destructive">
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="report" className="space-y-4">
              <FloodReporting
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
                emergencyMode={systemStatus.emergencyMode}
                isOnline={systemStatus.isOnline}
              />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <AlertSystem
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
                emergencyMode={systemStatus.emergencyMode}
                activeAlerts={activeAlerts}
                onAlertsUpdate={setActiveAlerts}
              />
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <EmergencyContacts
                selectedLanguage={selectedLanguage}
                currentLocation={currentLocation}
                emergencyMode={systemStatus.emergencyMode}
              />
            </TabsContent>

            <TabsContent value="map" className="space-y-4">
              <EmergencyMap
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
                activeAlerts={activeAlerts}
                emergencyMode={systemStatus.emergencyMode}
              />
            </TabsContent>

            <TabsContent value="community" className="space-y-4">
              <CommunityFeed
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
                isOnline={systemStatus.isOnline}
              />
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SafetyTips selectedLanguage={selectedLanguage} />
                <EmergencyKits selectedLanguage={selectedLanguage} />
              </div>
              <ReliefCenters
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
              />
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <UserProfile
                selectedLanguage={selectedLanguage}
                systemStatus={systemStatus}
                onEmergencyModeToggle={activateEmergencyMode}
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* SOS Modal */}
      <SOSButton
        isActive={isSOSActive}
        onClose={() => setIsSOSActive(false)}
        currentLocation={currentLocation}
        selectedLanguage={selectedLanguage}
        emergencyContacts={emergencyContacts}
      />

      {/* Offline Sync Component */}
      <OfflineSync
        isOnline={systemStatus.isOnline}
        lastSync={systemStatus.lastSync}
        onSyncComplete={(syncTime) =>
          setSystemStatus((prev) => ({ ...prev, lastSync: syncTime }))
        }
      />

      {/* Enhanced Footer */}
      <footer
        className={cn(
          "py-8 mt-12 transition-colors",
          darkMode ? "bg-gray-800 text-white" : "bg-gray-800 text-white"
        )}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Emergency Helplines</h3>
              <div className="space-y-1 text-sm">
                <p>
                  National Emergency:{" "}
                  <span className="font-bold text-red-400">112</span>
                </p>
                <p>
                  Disaster Management:{" "}
                  <span className="font-bold text-red-400">1077</span>
                </p>
                <p>
                  NDMA:{" "}
                  <span className="font-bold text-red-400">011-26701700</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Quick Shortcuts</h3>
              <div className="space-y-1 text-sm">
                <p>
                  Emergency Mode:{" "}
                  <kbd className="bg-gray-700 px-2 py-1 rounded">
                    Ctrl+Shift+E
                  </kbd>
                </p>
                <p>
                  SOS Alert:{" "}
                  <kbd className="bg-gray-700 px-2 py-1 rounded">
                    Ctrl+Shift+S
                  </kbd>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">System Info</h3>
              <div className="space-y-1 text-sm">
                <p>Version: 2.1.0</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
                <p
                  className={
                    systemStatus.isOnline ? "text-green-400" : "text-red-400"
                  }
                >
                  Status: {systemStatus.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-gray-600" />

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Developed for the safety and welfare of Indian citizens
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2025 Suraksha Sankat Sahayak - Ministry of Home Affairs,
              Government of India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
