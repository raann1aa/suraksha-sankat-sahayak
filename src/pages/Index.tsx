
import React, { useState, useEffect } from 'react';
import { Phone, MapPin, AlertTriangle, User, Camera, Send, Volume2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import EmergencyContacts from '@/components/EmergencyContacts';
import FloodReporting from '@/components/FloodReporting';
import AlertSystem from '@/components/AlertSystem';
import UserProfile from '@/components/UserProfile';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
          toast({
            title: "Location Access",
            description: "Enable location access for better emergency services",
            variant: "default"
          });
        }
      );
    }
  }, []);

  const translations = {
    en: {
      appTitle: "Flood Management System",
      report: "Report",
      alerts: "Alerts", 
      emergency: "Emergency",
      profile: "Profile",
      currentLocation: "Current Location",
      emergencyAlert: "Emergency Services Available 24/7"
    },
    hi: {
      appTitle: "बाढ़ प्रबंधन प्रणाली",
      report: "रिपोर्ट",
      alerts: "अलर्ट",
      emergency: "आपातकाल",
      profile: "प्रोफाइल",
      currentLocation: "वर्तमान स्थान",
      emergencyAlert: "आपातकालीन सेवाएं 24/7 उपलब्ध"
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t.appTitle}</h1>
              <p className="text-sm text-gray-600">{t.emergencyAlert}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Location Status */}
      {currentLocation && (
        <div className="bg-green-100 border-l-4 border-green-500 p-3 mx-4 mt-4 rounded">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">{t.currentLocation}: </span>
            <span className="text-green-700 ml-1">
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger value="report" className="flex flex-col items-center space-y-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Camera className="w-5 h-5" />
              <span className="text-xs font-medium">{t.report}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex flex-col items-center space-y-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-medium">{t.alerts}</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex flex-col items-center space-y-1 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">{t.emergency}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center space-y-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">{t.profile}</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="report" className="space-y-4">
              <FloodReporting 
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
              />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <AlertSystem 
                currentLocation={currentLocation}
                selectedLanguage={selectedLanguage}
              />
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <EmergencyContacts selectedLanguage={selectedLanguage} />
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <UserProfile selectedLanguage={selectedLanguage} />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            Emergency Helpline: <span className="font-bold text-red-400">1077</span> | 
            NDMA: <span className="font-bold text-red-400">011-26701700</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Developed for the safety and welfare of Indian citizens
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
