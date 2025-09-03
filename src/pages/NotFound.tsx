import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Home,
  ArrowLeft,
  Search,
  Phone,
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  RefreshCw,
  HelpCircle,
  Navigation,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RouteMapping {
  path: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
  category: "emergency" | "reporting" | "general" | "navigation";
}

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [errorDetails, setErrorDetails] = useState({
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    attemptedPath: location.pathname,
  });

  // Enhanced route suggestions for emergency system
  const routeMapping: RouteMapping[] = [
    {
      path: "/",
      title: "Emergency Dashboard",
      description: "Main emergency management interface",
      icon: <Home className="w-5 h-5" />,
      priority: "high",
      category: "emergency",
    },
    {
      path: "/emergency",
      title: "Emergency Contacts",
      description: "Access emergency helplines and contacts",
      icon: <Phone className="w-5 h-5" />,
      priority: "high",
      category: "emergency",
    },
    {
      path: "/alerts",
      title: "Emergency Alerts",
      description: "View active emergency alerts and warnings",
      icon: <AlertTriangle className="w-5 h-5" />,
      priority: "high",
      category: "emergency",
    },
    {
      path: "/report",
      title: "Report Emergency",
      description: "Report floods, disasters, or emergency situations",
      icon: <Shield className="w-5 h-5" />,
      priority: "high",
      category: "reporting",
    },
    {
      path: "/map",
      title: "Emergency Map",
      description: "Interactive map showing emergency zones and services",
      icon: <MapPin className="w-5 h-5" />,
      priority: "medium",
      category: "navigation",
    },
    {
      path: "/profile",
      title: "User Profile",
      description: "Manage your emergency profile and preferences",
      icon: <HelpCircle className="w-5 h-5" />,
      priority: "low",
      category: "general",
    },
  ];

  // Detect if attempted path seems emergency-related
  const detectEmergencyContext = useCallback(() => {
    const emergencyKeywords = [
      "emergency",
      "sos",
      "alert",
      "help",
      "urgent",
      "critical",
      "flood",
      "fire",
      "medical",
      "police",
      "disaster",
      "rescue",
    ];

    const pathLower = location.pathname.toLowerCase();
    return emergencyKeywords.some((keyword) => pathLower.includes(keyword));
  }, [location.pathname]);

  // Enhanced error logging with emergency context
  useEffect(() => {
    const isEmergencyRelated = detectEmergencyContext();
    setIsEmergencyMode(isEmergencyRelated);

    // Log error with enhanced context
    const errorLog = {
      timestamp: new Date().toISOString(),
      attemptedPath: location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      isEmergencyRelated,
      isOnline: navigator.onLine,
      sessionId: sessionStorage.getItem("sessionId") || "unknown",
      userId: localStorage.getItem("userId") || "anonymous",
    };

    console.error("404 Error - Enhanced Emergency System Context:", errorLog);

    // Emergency-specific handling
    if (isEmergencyRelated) {
      console.warn(
        "CRITICAL: User attempted emergency-related path that doesn't exist"
      );
      toast({
        title: "Emergency Path Not Found",
        description:
          "Redirecting to emergency dashboard for immediate assistance",
        variant: "destructive",
      });

      // Faster redirect for emergency contexts
      setRedirectCountdown(5);
    }

    // Send telemetry (in real app, this would go to your analytics)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_not_found", {
        page_path: location.pathname,
        emergency_related: isEmergencyRelated,
        user_online: navigator.onLine,
      });
    }
  }, [location.pathname, detectEmergencyContext]);

  // Network status monitoring
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

  // Auto-redirect countdown for emergency mode
  useEffect(() => {
    if (!isEmergencyMode) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEmergencyMode, navigate]);

  // Search functionality
  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      const matchedRoutes = routeMapping.filter(
        (route) =>
          route.title.toLowerCase().includes(query.toLowerCase()) ||
          route.description.toLowerCase().includes(query.toLowerCase())
      );

      if (matchedRoutes.length > 0) {
        const bestMatch = matchedRoutes.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })[0];

        navigate(bestMatch.path);
      } else {
        toast({
          title: "No matches found",
          description: "Try searching for 'emergency', 'report', or 'alerts'",
          variant: "default",
        });
      }
    },
    [navigate, routeMapping]
  );

  // Emergency quick actions
  const emergencyActions = [
    {
      title: "Call Emergency",
      action: () => window.open("tel:112"),
      icon: <Phone className="w-4 h-4" />,
      variant: "destructive" as const,
    },
    {
      title: "Report Emergency",
      action: () => navigate("/report"),
      icon: <AlertTriangle className="w-4 h-4" />,
      variant: "destructive" as const,
    },
    {
      title: "View Alerts",
      action: () => navigate("/alerts"),
      icon: <Shield className="w-4 h-4" />,
      variant: "outline" as const,
    },
  ];

  // Filter suggestions based on search
  const filteredSuggestions = routeMapping
    .filter(
      (route) =>
        !searchQuery ||
        route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300",
        isEmergencyMode
          ? "bg-gradient-to-br from-red-50 to-orange-50"
          : "bg-gradient-to-br from-blue-50 to-gray-50"
      )}
    >
      <div className="max-w-2xl w-full mx-4">
        {/* Emergency Mode Banner */}
        {isEmergencyMode && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                  <span className="text-red-800 font-semibold">
                    Emergency Context Detected
                  </span>
                </div>
                <Badge variant="destructive">PRIORITY</Badge>
              </div>
              <p className="text-red-700 text-sm mt-2">
                Auto-redirecting to emergency dashboard in {redirectCountdown}{" "}
                seconds
              </p>
              <Progress
                value={(10 - redirectCountdown) * 10}
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
        )}

        {/* Main Error Card */}
        <Card
          className={cn(
            "text-center shadow-lg",
            isEmergencyMode && "border-red-200"
          )}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center",
                  isEmergencyMode
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                )}
              >
                <span className="text-4xl font-bold">404</span>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold">
              {isEmergencyMode ? "Emergency Page Not Found" : "Page Not Found"}
            </CardTitle>

            <p className="text-gray-600 mt-2">
              {isEmergencyMode
                ? "The emergency resource you're looking for doesn't exist, but help is still available."
                : "The page you're looking for doesn't exist or has been moved."}
            </p>

            {/* Network Status */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Offline Mode</span>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Emergency Quick Actions */}
            {isEmergencyMode && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-800">
                    Immediate Actions
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {emergencyActions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        onClick={action.action}
                        className="flex items-center space-x-2"
                      >
                        {action.icon}
                        <span>{action.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Search Functionality */}
            <div className="space-y-3">
              <h3 className="font-semibold">Find What You Need</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search for emergency services, alerts, reporting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSearch(searchQuery)
                  }
                  className="flex-1"
                />
                <Button onClick={() => handleSearch(searchQuery)}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Route Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Available Pages</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSuggestions(false)}
                    >
                      Hide
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredSuggestions.slice(0, 6).map((route) => (
                      <Button
                        key={route.path}
                        variant="outline"
                        className={cn(
                          "flex items-start space-x-3 h-auto p-3 text-left justify-start",
                          route.priority === "high" &&
                            "border-orange-200 hover:border-orange-300",
                          route.category === "emergency" &&
                            "border-red-200 hover:border-red-300"
                        )}
                        onClick={() => navigate(route.path)}
                      >
                        <div className="flex-shrink-0 mt-1">{route.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {route.title}
                            </span>
                            {route.priority === "high" && (
                              <Badge variant="secondary" className="text-xs">
                                HIGH
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {route.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </Button>

              <Button
                onClick={() => navigate("/", { replace: true })}
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>{isEmergencyMode ? "Emergency Dashboard" : "Home"}</span>
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>

            {/* Error Details (Development/Debug) */}
            {process.env.NODE_ENV === "development" && (
              <>
                <Separator />
                <details className="text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600">
                    Debug Information
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono space-y-1">
                    <div>
                      <strong>Path:</strong> {errorDetails.attemptedPath}
                    </div>
                    <div>
                      <strong>Time:</strong>{" "}
                      {errorDetails.timestamp.toISOString()}
                    </div>
                    <div>
                      <strong>Referrer:</strong>{" "}
                      {errorDetails.referrer || "Direct"}
                    </div>
                    <div>
                      <strong>Emergency Mode:</strong>{" "}
                      {isEmergencyMode ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Online:</strong> {isOnline ? "Yes" : "No"}
                    </div>
                  </div>
                </details>
              </>
            )}
          </CardContent>
        </Card>

        {/* Emergency Helpline Footer */}
        <Card className="mt-6 bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="font-medium">Emergency:</span>
                <a
                  href="tel:112"
                  className="text-red-600 font-bold hover:underline"
                >
                  112
                </a>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Disaster Help:</span>
                <a
                  href="tel:1077"
                  className="text-blue-600 font-bold hover:underline"
                >
                  1077
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              24/7 Emergency Services Available
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
