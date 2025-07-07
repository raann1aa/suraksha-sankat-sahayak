
import React, { useState } from 'react';
import { User, MapPin, Phone, Settings, Bell, Globe, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface UserProfileProps {
  selectedLanguage: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ selectedLanguage }) => {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const translations = {
    en: {
      title: "Profile",
      personalInfo: "Personal Information",
      name: "Full Name",
      phone: "Phone Number",
      location: "Current Location",
      preferences: "Preferences",
      notifications: "Push Notifications",
      locationSharing: "Share Location",
      emergencyAlerts: "Emergency Alerts",
      language: "Language",
      about: "About App",
      version: "Version 1.0.0",
      developer: "Developed for Indian Citizens",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      help: "Help & Support",
      logout: "Logout",
      settings: "Settings",
      reportsSubmitted: "Reports Submitted",
      alertsReceived: "Alerts Received",
      emergencyCalls: "Emergency Calls"
    },
    hi: {
      title: "प्रोफ़ाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      name: "पूरा नाम",
      phone: "फोन नंबर",
      location: "वर्तमान स्थान",
      preferences: "प्राथमिकताएं",
      notifications: "पुश नोटिफिकेशन",
      locationSharing: "स्थान साझा करें",
      emergencyAlerts: "आपातकालीन अलर्ट",
      language: "भाषा",
      about: "ऐप के बारे में",
      version: "संस्करण 1.0.0",
      developer: "भारतीय नागरिकों के लिए विकसित",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      help: "सहायता और समर्थन",
      logout: "लॉगआउट",
      settings: "सेटिंग्स",
      reportsSubmitted: "सबमिट की गई रिपोर्ट",
      alertsReceived: "प्राप्त अलर्ट",
      emergencyCalls: "आपातकालीन कॉल"
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  const userStats = [
    { label: t.reportsSubmitted, value: '3', icon: User, color: 'text-blue-600' },
    { label: t.alertsReceived, value: '12', icon: Bell, color: 'text-orange-600' },
    { label: t.emergencyCalls, value: '0', icon: Phone, color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4">
        {userStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{t.personalInfo}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t.name}</label>
            <div className="p-2 bg-gray-50 rounded border">
              <span className="text-gray-900">राहुल शर्मा / Rahul Sharma</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t.phone}</label>
            <div className="p-2 bg-gray-50 rounded border">
              <span className="text-gray-900">+91 98765 43210</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t.location}</label>
            <div className="p-2 bg-gray-50 rounded border flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">Mumbai, Maharashtra</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t.preferences}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">{t.notifications}</div>
                <div className="text-sm text-gray-500">Receive flood alerts and updates</div>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">{t.locationSharing}</div>
                <div className="text-sm text-gray-500">Help emergency services locate you</div>
              </div>
            </div>
            <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">{t.emergencyAlerts}</div>
                <div className="text-sm text-gray-500">Critical emergency notifications</div>
              </div>
            </div>
            <Switch checked={emergencyAlerts} onCheckedChange={setEmergencyAlerts} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">{t.language}</div>
                <div className="text-sm text-gray-500">App display language</div>
              </div>
            </div>
            <Badge variant="outline">
              {selectedLanguage === 'en' ? 'English' : 'हिंदी'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>{t.about}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">{t.version}</div>
            <div className="text-sm text-gray-600">{t.developer}</div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              {t.privacy}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t.terms}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              {t.help}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
