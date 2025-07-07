
import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Volume2, Share, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface AlertSystemProps {
  currentLocation: {lat: number, lng: number} | null;
  selectedLanguage: string;
}

const AlertSystem: React.FC<AlertSystemProps> = ({ currentLocation, selectedLanguage }) => {
  const [alerts, setAlerts] = useState<any[]>([]);

  const translations = {
    en: {
      title: "Flood Alerts",
      subtitle: "Real-time flood warnings in your area",
      noAlerts: "No active alerts in your area",
      stayAlert: "Stay alert and be prepared",
      shareAlert: "Share Alert",
      viewOnMap: "View on Map",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      critical: "CRITICAL",
      high: "HIGH",
      medium: "MEDIUM",
      low: "LOW",
      safetyTips: "Safety Tips",
      tip1: "Move to higher ground immediately",
      tip2: "Avoid walking through flood water",
      tip3: "Keep emergency supplies ready",
      tip4: "Stay informed through official channels"
    },
    hi: {
      title: "बाढ़ अलर्ट",
      subtitle: "आपके क्षेत्र में वास्तविक समय बाढ़ चेतावनी",
      noAlerts: "आपके क्षेत्र में कोई सक्रिय अलर्ट नहीं",
      stayAlert: "सतर्क रहें और तैयार रहें",
      shareAlert: "अलर्ट साझा करें",
      viewOnMap: "मानचित्र पर देखें",
      minutesAgo: "मिनट पहले",
      hoursAgo: "घंटे पहले",
      critical: "गंभीर",
      high: "उच्च",
      medium: "मध्यम",
      low: "कम",
      safetyTips: "सुरक्षा सुझाव",
      tip1: "तुरंत ऊंची जगह जाएं",
      tip2: "बाढ़ के पानी में चलने से बचें",
      tip3: "आपातकालीन सामग्री तैयार रखें",
      tip4: "आधिकारिक चैनलों के माध्यम से जानकारी रखें"
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  useEffect(() => {
    // Simulate real-time alerts
    const mockAlerts = [
      {
        id: 1,
        severity: 'critical',
        title: 'Flash Flood Warning',
        description: 'Heavy rainfall causing flash floods in low-lying areas',
        location: 'Mumbai Central',
        distance: '2.3 km',
        time: '15 minutes ago',
        coordinates: { lat: 19.0176, lng: 72.8562 }
      },
      {
        id: 2,
        severity: 'high',
        title: 'Water Logging Alert',
        description: 'Severe water logging reported on major roads',
        location: 'Bandra East',
        distance: '5.7 km',
        time: '1 hour ago',
        coordinates: { lat: 19.0596, lng: 72.8295 }
      },
      {
        id: 3,
        severity: 'medium',
        title: 'River Level Rising',
        description: 'Mithi River level approaching danger mark',
        location: 'Powai',
        distance: '8.1 km',
        time: '2 hours ago',
        coordinates: { lat: 19.1176, lng: 72.9060 }
      }
    ];
    
    setAlerts(mockAlerts);
  }, []);

  const severityConfig = {
    critical: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      icon: '🚨',
      bgColor: 'bg-red-50 border-l-red-500'
    },
    high: { 
      color: 'bg-orange-100 text-orange-800 border-orange-300', 
      icon: '⚠️',
      bgColor: 'bg-orange-50 border-l-orange-500'
    },
    medium: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
      icon: '⚡',
      bgColor: 'bg-yellow-50 border-l-yellow-500'
    },
    low: { 
      color: 'bg-blue-100 text-blue-800 border-blue-300', 
      icon: 'ℹ️',
      bgColor: 'bg-blue-50 border-l-blue-500'
    }
  };

  const handleShareAlert = (alert: any) => {
    const text = `🚨 Flood Alert: ${alert.title}\n📍 Location: ${alert.location}\n⏰ ${alert.time}\n\n${alert.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Flood Alert',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Alert Copied",
        description: "Alert details copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {alerts.length === 0 ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">{t.noAlerts}</h3>
            <p className="text-green-600">{t.stayAlert}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity as keyof typeof severityConfig];
            return (
              <Card key={alert.id} className={`${config.bgColor} border-l-4`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={config.color}>
                            {t[alert.severity as keyof typeof t]}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {alert.time}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShareAlert(alert)}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.location}</span>
                      </div>
                      <span>•</span>
                      <span>{alert.distance} away</span>
                    </div>
                    <Button variant="outline" size="sm">
                      {t.viewOnMap}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Volume2 className="w-5 h-5" />
            <span>{t.safetyTips}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{t.tip1}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{t.tip2}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{t.tip3}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{t.tip4}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSystem;
