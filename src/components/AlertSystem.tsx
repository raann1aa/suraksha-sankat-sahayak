// Make sure to install: framer-motion, dayjs, @radix-ui/react-dialog, clsx, lucide-react
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Share,
  X,
  Info,
  Filter,
  ChevronDown,
  Bell,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import clsx from "clsx";

dayjs.extend(relativeTime);

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
}

interface AlertSystemProps {
  currentLocation: Location | null;
  selectedLanguage: string;
  onNotificationToggle?: (enabled: boolean) => void;
}

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";

const AlertSystem: React.FC<AlertSystemProps> = ({
  currentLocation,
  selectedLanguage,
  onNotificationToggle,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [archived, setArchived] = useState<Set<number>>(new Set());
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Enhanced severity configuration with animations and colors
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
      },
      medium: {
        icon: AlertTriangle,
        bg: "bg-yellow-50 hover:bg-yellow-100",
        border: "border-l-4 border-yellow-500",
        text: "text-yellow-800",
        badge: "bg-yellow-100 text-yellow-800",
        iconBg: "bg-yellow-500",
        priority: 2,
      },
      high: {
        icon: AlertTriangle,
        bg: "bg-orange-50 hover:bg-orange-100",
        border: "border-l-4 border-orange-500",
        text: "text-orange-800",
        badge: "bg-orange-100 text-orange-800",
        iconBg: "bg-orange-500",
        priority: 3,
      },
      critical: {
        icon: AlertTriangle,
        bg: "bg-red-50 hover:bg-red-100",
        border: "border-l-4 border-red-500",
        text: "text-red-800",
        badge: "bg-red-100 text-red-800",
        iconBg: "bg-red-500",
        priority: 4,
      },
    }),
    []
  );

  // Enhanced translations
  const translations = useMemo(
    () => ({
      en: {
        activeAlerts: "Active Alerts",
        noActiveAlerts: "No active alerts!",
        allCaughtUp: "You're all caught up! Stay alert for updates.",
        viewOnMap: "View Details",
        shareAlert: "Share Alert",
        dismiss: "Dismiss",
        close: "Close",
        showArchived: "Show archived",
        hideArchived: "Hide archived",
        archivedAlerts: "Archived Alerts",
        distance: "away",
        filterBySeverity: "Filter by severity",
        alertDismissed: "Alert dismissed",
        alertCopied: "Alert copied to clipboard",
        enableNotifications: "Enable Notifications",
        actionRequired: "Action Required",
        estimatedDuration: "Est. Duration",
      },
    }),
    []
  );

  const t =
    translations[selectedLanguage as keyof typeof translations] ||
    translations.en;

  // Enhanced notification system
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      const enabled = permission === "granted";
      setNotificationsEnabled(enabled);
      onNotificationToggle?.(enabled);
      return enabled;
    }
    return false;
  }, [onNotificationToggle]);

  // Enhanced mock data with more realistic alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockAlerts: Alert[] = [
        {
          id: 1,
          title: "Severe Weather Alert",
          description:
            "Heavy rainfall and thunderstorms expected in your area. Avoid outdoor activities and stay indoors until conditions improve.",
          severity: "critical",
          location: {
            name: "Downtown Area",
            coordinates: { lat: 37.7749, lng: -122.4194 },
          },
          timestamp: dayjs().subtract(15, "minute").toISOString(),
          type: "weather",
          distance: 0.8,
          isRead: false,
          actionRequired: true,
          estimatedDuration: "3-4 hours",
        },
        {
          id: 2,
          title: "Traffic Disruption",
          description:
            "Multi-vehicle accident on Highway 101. Emergency services on scene. Expect delays of 45-60 minutes.",
          severity: "high",
          location: {
            name: "Highway 101 North",
            coordinates: { lat: 37.7849, lng: -122.4094 },
          },
          timestamp: dayjs().subtract(45, "minute").toISOString(),
          type: "traffic",
          distance: 2.3,
          isRead: false,
          estimatedDuration: "1-2 hours",
        },
        {
          id: 3,
          title: "Community Event",
          description:
            "Local farmers market happening this weekend at Central Park. Fresh produce and local crafts available.",
          severity: "low",
          location: {
            name: "Central Park",
            coordinates: { lat: 37.7649, lng: -122.4294 },
          },
          timestamp: dayjs().subtract(2, "hour").toISOString(),
          type: "community",
          distance: 1.2,
          isRead: true,
        },
      ];

      setAlerts(mockAlerts);
      setIsLoading(false);
    };
    fetchAlerts();
  }, [currentLocation]);

  // Enhanced handlers with better UX feedback
  const showToast = useCallback(
    (message: string, type: "success" | "info" = "info") => {
      // You can replace this with your toast library
      const toast = document.createElement("div");
      toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-blue-500 text-white"
      }`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2700);
    },
    []
  );

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
      } catch (error) {
        console.error("Share failed:", error);
        showToast("Failed to share alert");
      }
    },
    [showToast, t.alertCopied]
  );

  const handleArchive = useCallback(
    (id: number) => {
      setArchived((prev) => new Set([...prev, id]));
      showToast(t.alertDismissed, "success");
    },
    [showToast, t.alertDismissed]
  );

  const handleMarkAsRead = useCallback((id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  }, []);

  const getTimeAgo = useCallback(
    (timestamp: string) => dayjs(timestamp).fromNow(),
    []
  );

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

  // Enhanced filtering and sorting
  const filteredAlerts = useMemo(() => {
    let filtered = alerts.filter((a) =>
      showArchived ? archived.has(a.id) : !archived.has(a.id)
    );

    if (severityFilter !== "all") {
      filtered = filtered.filter((a) => a.severity === severityFilter);
    }

    return filtered.sort((a, b) => {
      const priorityDiff =
        severityConfig[b.severity].priority -
        severityConfig[a.severity].priority;
      if (priorityDiff !== 0) return priorityDiff;
      return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf();
    });
  }, [alerts, archived, severityFilter, showArchived, severityConfig]);

  // Enhanced Alert Card Component
  const AlertCard = ({ alert }: { alert: Alert }) => {
    const config = severityConfig[alert.severity];
    const distance = calculateDistance(alert.location.coordinates);
    const Icon = config.icon;

    return (
      <motion.div
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          "relative rounded-xl shadow-sm transition-all duration-200 cursor-pointer group",
          config.bg,
          config.border,
          !alert.isRead && "ring-2 ring-blue-200 ring-opacity-50"
        )}
        onClick={() => {
          setSelectedAlert(alert);
          handleMarkAsRead(alert.id);
        }}
      >
        {/* Unread indicator */}
        {!alert.isRead && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}

        {/* Archive button */}
        <button
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm hover:shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleArchive(alert.id);
          }}
          title={t.dismiss}
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={clsx("p-2.5 rounded-full text-white", config.iconBg)}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={clsx("font-bold text-lg", config.text)}>
                  {alert.title}
                </h3>
                <div className="flex items-center gap-2">
                  {alert.actionRequired && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {t.actionRequired}
                    </span>
                  )}
                  <span
                    className={clsx(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      config.badge
                    )}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeAgo(alert.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{alert.location.name}</span>
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
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                {alert.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAlert(alert);
                    handleMarkAsRead(alert.id);
                  }}
                >
                  <MapPin className="w-4 h-4" />
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
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-36 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {showArchived ? t.archivedAlerts : t.activeAlerts}
          </h1>
          <span className="px-2 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
            {filteredAlerts.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications toggle */}
          <button
            onClick={requestNotificationPermission}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors",
              notificationsEnabled
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            )}
          >
            <Bell className="w-4 h-4" />
            {t.enableNotifications}
          </button>

          {/* Severity filter */}
          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value as SeverityFilter)
              }
              className="appearance-none px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Archive toggle */}
          <button
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? t.hideArchived : t.showArchived}
            {archived.size > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                {archived.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t.noActiveAlerts}
          </h3>
          <p className="text-gray-500 max-w-md">{t.allCaughtUp}</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AlertCard alert={alert} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Enhanced Modal using only Radix primitives */}
      <Dialog.Root
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto z-50">
            {selectedAlert && (
              <>
                {/* Title - Required by Radix */}
                <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-3 p-6 pb-4">
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
                  {selectedAlert.title}
                </Dialog.Title>

                {/* Content */}
                <div className="px-6 pb-6 space-y-6">
                  {/* Alert metadata */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Location
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedAlert.location.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Time
                      </div>
                      <div className="text-sm text-gray-900">
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
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Severity
                      </div>
                      <div
                        className={clsx(
                          "text-sm font-medium",
                          severityConfig[selectedAlert.severity].text
                        )}
                      >
                        {selectedAlert.severity.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Details
                    </h4>
                    <Dialog.Description className="text-gray-700 leading-relaxed">
                      {selectedAlert.description}
                    </Dialog.Description>
                  </div>

                  {/* Map placeholder */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">
                        Interactive Map View
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleShareAlert(selectedAlert)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share className="w-4 h-4" />
                      {t.shareAlert}
                    </button>
                    <Dialog.Close asChild>
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {t.close}
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Close button */}
                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AlertSystem;
