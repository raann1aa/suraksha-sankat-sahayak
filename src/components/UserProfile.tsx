import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Settings,
  Bell,
  Globe,
  Shield,
  Info,
  Edit,
  Camera,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Heart,
  Star,
  Award,
  Download,
  Upload,
  Share2,
  Mail,
  Key,
  Smartphone,
  Wifi,
  Battery,
  Moon,
  Sun,
  Volume2,
  Vibrate,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface UserProfileProps {
  selectedLanguage: string;
}

interface UserData {
  name: string;
  phone: string;
  email: string;
  location: string;
  emergencyContact: string;
  bloodGroup: string;
  medicalConditions: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
}

interface UserSettings {
  notifications: boolean;
  locationSharing: boolean;
  emergencyAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  dataUsage: "low" | "medium" | "high";
  autoBackup: boolean;
  biometricAuth: boolean;
  twoFactorAuth: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  progress?: number;
  date?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ selectedLanguage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    name: "राहुल शर्मा / Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@email.com",
    location: "Mumbai, Maharashtra",
    emergencyContact: "+91 99887 76543",
    bloodGroup: "B+",
    medicalConditions: "None",
    joinDate: "2024-01-15",
    lastActive: "Just now",
  });

  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    locationSharing: true,
    emergencyAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    dataUsage: "medium",
    autoBackup: true,
    biometricAuth: false,
    twoFactorAuth: false,
  });

  const translations = {
    en: {
      title: "Profile",
      personalInfo: "Personal Information",
      name: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      location: "Current Location",
      emergencyContact: "Emergency Contact",
      bloodGroup: "Blood Group",
      medicalConditions: "Medical Conditions",
      preferences: "Preferences",
      notifications: "Push Notifications",
      locationSharing: "Share Location",
      emergencyAlerts: "Emergency Alerts",
      soundEnabled: "Sound Alerts",
      vibrationEnabled: "Vibration",
      darkMode: "Dark Mode",
      dataUsage: "Data Usage",
      autoBackup: "Auto Backup",
      biometricAuth: "Biometric Authentication",
      twoFactorAuth: "Two-Factor Authentication",
      language: "Language",
      about: "About App",
      version: "Version 1.0.0",
      developer: "Developed for Indian Citizens",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      help: "Help & Support",
      logout: "Logout",
      settings: "Settings",
      achievements: "Achievements",
      statistics: "Statistics",
      reportsSubmitted: "Reports Submitted",
      alertsReceived: "Alerts Received",
      emergencyCalls: "Emergency Calls",
      helpedOthers: "People Helped",
      profileCompletion: "Profile Completion",
      joinedOn: "Member Since",
      lastActive: "Last Active",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      changePhoto: "Change Photo",
      showPrivateInfo: "Show Private Info",
      hidePrivateInfo: "Hide Private Info",
      exportData: "Export My Data",
      deleteAccount: "Delete Account",
      securitySettings: "Security & Privacy",
      appPreferences: "App Preferences",
      accountActions: "Account Actions",
      low: "Low",
      medium: "Medium",
      high: "High",
      earned: "Earned",
      inProgress: "In Progress",
      locked: "Locked",
      backupData: "Backup Data",
      restoreData: "Restore Data",
      shareProfile: "Share Profile",
    },
    hi: {
      title: "प्रोफ़ाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      name: "पूरा नाम",
      phone: "फोन नंबर",
      email: "ईमेल पता",
      location: "वर्तमान स्थान",
      emergencyContact: "आपातकालीन संपर्क",
      bloodGroup: "रक्त समूह",
      medicalConditions: "चिकित्सा स्थितियां",
      preferences: "प्राथमिकताएं",
      notifications: "पुश नोटिफिकेशन",
      locationSharing: "स्थान साझा करें",
      emergencyAlerts: "आपातकालीन अलर्ट",
      soundEnabled: "ध्वनि अलर्ट",
      vibrationEnabled: "कंपन",
      darkMode: "डार्क मोड",
      dataUsage: "डेटा उपयोग",
      autoBackup: "ऑटो बैकअप",
      biometricAuth: "बायोमेट्रिक प्रमाणीकरण",
      twoFactorAuth: "दो-कारक प्रमाणीकरण",
      language: "भाषा",
      about: "ऐप के बारे में",
      version: "संस्करण 1.0.0",
      developer: "भारतीय नागरिकों के लिए विकसित",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      help: "सहायता और समर्थन",
      logout: "लॉगआउट",
      settings: "सेटिंग्स",
      achievements: "उपलब्धियां",
      statistics: "आंकड़े",
      reportsSubmitted: "सबमिट की गई रिपोर्ट",
      alertsReceived: "प्राप्त अलर्ट",
      emergencyCalls: "आपातकालीन कॉल",
      helpedOthers: "लोगों की मदद की",
      profileCompletion: "प्रोफाइल पूर्णता",
      joinedOn: "सदस्य बने",
      lastActive: "अंतिम बार सक्रिय",
      editProfile: "प्रोफाइल संपादित करें",
      saveChanges: "परिवर्तन सहेजें",
      cancel: "रद्द करें",
      changePhoto: "फोटो बदलें",
      showPrivateInfo: "निजी जानकारी दिखाएं",
      hidePrivateInfo: "निजी जानकारी छुपाएं",
      exportData: "मेरा डेटा निर्यात करें",
      deleteAccount: "खाता हटाएं",
      securitySettings: "सुरक्षा और गोपनीयता",
      appPreferences: "ऐप प्राथमिकताएं",
      accountActions: "खाता क्रियाएं",
      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      earned: "अर्जित",
      inProgress: "प्रगति में",
      locked: "लॉक",
      backupData: "डेटा बैकअप",
      restoreData: "डेटा पुनर्स्थापना",
      shareProfile: "प्रोफाइल साझा करें",
    },
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  const userStats = [
    {
      label: t.reportsSubmitted,
      value: "3",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: t.alertsReceived,
      value: "12",
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: t.emergencyCalls,
      value: "0",
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t.helpedOthers,
      value: "7",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const achievements: Achievement[] = [
    {
      id: "first-report",
      title: selectedLanguage === "en" ? "First Reporter" : "पहला रिपोर्टर",
      description:
        selectedLanguage === "en"
          ? "Submitted your first disaster report"
          : "आपकी पहली आपदा रिपोर्ट जमा की",
      icon: Award,
      earned: true,
      date: "2024-01-20",
    },
    {
      id: "helper",
      title: selectedLanguage === "en" ? "Community Helper" : "सामुदायिक सहायक",
      description:
        selectedLanguage === "en"
          ? "Helped 5 people in emergency"
          : "5 लोगों की आपातकाल में मदद की",
      icon: Heart,
      earned: true,
      progress: 100,
      date: "2024-02-15",
    },
    {
      id: "vigilant",
      title: selectedLanguage === "en" ? "Vigilant Citizen" : "सतर्क नागरिक",
      description:
        selectedLanguage === "en"
          ? "Report 10 incidents"
          : "10 घटनाओं की रिपोर्ट करें",
      icon: Eye,
      earned: false,
      progress: 30,
    },
    {
      id: "lifesaver",
      title: selectedLanguage === "en" ? "Life Saver" : "जीवन रक्षक",
      description:
        selectedLanguage === "en" ? "Save someone's life" : "किसी की जान बचाएं",
      icon: Shield,
      earned: false,
      progress: 0,
    },
  ];

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: `${key} has been ${value ? "enabled" : "disabled"}`,
      duration: 2000,
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
      duration: 2000,
    });
    // Calculate profile completion
    const fields = Object.values(userData).filter(
      (value) => value && value.trim() !== ""
    );
    setProfileCompletion(
      Math.round((fields.length / Object.keys(userData).length) * 100)
    );
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: userData,
      settings: settings,
      stats: userStats,
      achievements: achievements.filter((a) => a.earned),
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `disaster_app_profile_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Data Exported",
      description: "Your profile data has been downloaded",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="relative">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() =>
                      toast({
                        title: "Feature Coming Soon",
                        description: "Photo upload will be available soon",
                      })
                    }
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData.name}
                    </h2>
                    <p className="text-gray-600 flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t.joinedOn}:{" "}
                      {new Date(userData.joinDate).toLocaleDateString()} •{" "}
                      {t.lastActive}: {userData.lastActive}
                    </p>
                  </div>

                  <div className="text-right">
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="mb-2"
                    >
                      {isEditing ? (
                        <Save className="w-4 h-4 mr-2" />
                      ) : (
                        <Edit className="w-4 h-4 mr-2" />
                      )}
                      {isEditing ? t.saveChanges : t.editProfile}
                    </Button>

                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        {t.profileCompletion}
                      </div>
                      <Progress
                        value={profileCompletion}
                        className="w-32 h-2"
                      />
                      <div className="text-xs text-gray-500">
                        {profileCompletion}% complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div
                className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>{t.achievements}</span>
          </CardTitle>
          <Dialog
            open={isAchievementsOpen}
            onOpenChange={setIsAchievementsOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span>{t.achievements}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          achievement.earned
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        {achievement.progress !== undefined &&
                          !achievement.earned && (
                            <div className="mt-2">
                              <Progress
                                value={achievement.progress}
                                className="h-2"
                              />
                              <span className="text-xs text-gray-500">
                                {achievement.progress}%
                              </span>
                            </div>
                          )}
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t.earned}:{" "}
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {achievement.earned && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {achievements.slice(0, 2).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border ${
                  achievement.earned
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <achievement.icon
                    className={`w-4 h-4 ${
                      achievement.earned ? "text-yellow-600" : "text-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {achievement.title}
                  </span>
                  {achievement.earned && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{t.personalInfo}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivateInfo(!showPrivateInfo)}
            >
              {showPrivateInfo ? (
                <EyeOff className="w-4 h-4 mr-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {showPrivateInfo ? t.hidePrivateInfo : t.showPrivateInfo}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t.name}
              </Label>
              {isEditing ? (
                <Input
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  <span className="text-gray-900">{userData.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t.phone}
              </Label>
              {isEditing ? (
                <Input
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  <span className="text-gray-900">
                    {showPrivateInfo ? userData.phone : "••••• ••210"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t.email}
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  <span className="text-gray-900">
                    {showPrivateInfo ? userData.email : "••••••@email.com"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t.location}
              </Label>
              {isEditing ? (
                <Input
                  value={userData.location}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{userData.location}</span>
                </div>
              )}
            </div>

            {showPrivateInfo && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t.emergencyContact}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={userData.emergencyContact}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          emergencyContact: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded border">
                      <span className="text-gray-900">
                        {userData.emergencyContact}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t.bloodGroup}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={userData.bloodGroup}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          bloodGroup: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded border">
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-300"
                      >
                        {userData.bloodGroup}
                      </Badge>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t.medicalConditions}
              </Label>
              {isEditing ? (
                <Textarea
                  value={userData.medicalConditions}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      medicalConditions: e.target.value,
                    }))
                  }
                  placeholder="Any medical conditions, allergies, or medications..."
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border">
                  <span className="text-gray-900">
                    {userData.medicalConditions}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={handleSaveProfile} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {t.saveChanges}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t.preferences}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{t.notifications}</div>
                  <div className="text-sm text-gray-500">
                    Receive flood alerts and updates
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(value) =>
                  updateSetting("notifications", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{t.locationSharing}</div>
                  <div className="text-sm text-gray-500">
                    Help emergency services locate you
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.locationSharing}
                onCheckedChange={(value) =>
                  updateSetting("locationSharing", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{t.emergencyAlerts}</div>
                  <div className="text-sm text-gray-500">
                    Critical emergency notifications
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.emergencyAlerts}
                onCheckedChange={(value) =>
                  updateSetting("emergencyAlerts", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">{t.language}</div>
                  <div className="text-sm text-gray-500">
                    App display language
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                {selectedLanguage === "en" ? "English" : "हिंदी"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced {t.settings}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t.settings}</DialogTitle>
                </DialogHeader>
                <AdvancedSettings
                  settings={settings}
                  updateSetting={updateSetting}
                  translations={t}
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.exportData}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>{t.about}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{t.version}</div>
            <div className="text-sm text-gray-600">{t.developer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button variant="ghost" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              {t.privacy}
            </Button>
            <Button variant="ghost" className="justify-start">
              <Info className="w-4 h-4 mr-2" />
              {t.terms}
            </Button>
            <Button variant="ghost" className="justify-start">
              <Phone className="w-4 h-4 mr-2" />
              {t.help}
            </Button>
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              {t.shareProfile}
            </Button>
            <Button variant="destructive" className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              {t.deleteAccount}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Advanced Settings Component
const AdvancedSettings: React.FC<{
  settings: UserSettings;
  updateSetting: (key: keyof UserSettings, value: any) => void;
  translations: any;
}> = ({ settings, updateSetting, translations: t }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center space-x-2">
        <Volume2 className="w-4 h-4" />
        <span>Audio & Vibration</span>
      </h4>

      <div className="flex items-center justify-between">
        <span className="text-sm">{t.soundEnabled}</span>
        <Switch
          checked={settings.soundEnabled}
          onCheckedChange={(value) => updateSetting("soundEnabled", value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">{t.vibrationEnabled}</span>
        <Switch
          checked={settings.vibrationEnabled}
          onCheckedChange={(value) => updateSetting("vibrationEnabled", value)}
        />
      </div>
    </div>

    <Separator />

    <div className="space-y-4">
      <h4 className="font-semibold flex items-center space-x-2">
        <Smartphone className="w-4 h-4" />
        <span>App Preferences</span>
      </h4>

      <div className="flex items-center justify-between">
        <span className="text-sm">{t.darkMode}</span>
        <Switch
          checked={settings.darkMode}
          onCheckedChange={(value) => updateSetting("darkMode", value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">{t.autoBackup}</span>
        <Switch
          checked={settings.autoBackup}
          onCheckedChange={(value) => updateSetting("autoBackup", value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">{t.dataUsage}</Label>
        <select
          value={settings.dataUsage}
          onChange={(e) => updateSetting("dataUsage", e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="low">{t.low}</option>
          <option value="medium">{t.medium}</option>
          <option value="high">{t.high}</option>
        </select>
      </div>
    </div>

    <Separator />

    <div className="space-y-4">
      <h4 className="font-semibold flex items-center space-x-2">
        <Lock className="w-4 h-4" />
        <span>Security</span>
      </h4>

      <div className="flex items-center justify-between">
        <span className="text-sm">{t.biometricAuth}</span>
        <Switch
          checked={settings.biometricAuth}
          onCheckedChange={(value) => updateSetting("biometricAuth", value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">{t.twoFactorAuth}</span>
        <Switch
          checked={settings.twoFactorAuth}
          onCheckedChange={(value) => updateSetting("twoFactorAuth", value)}
        />
      </div>
    </div>
  </div>
);

export default UserProfile;
