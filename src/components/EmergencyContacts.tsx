import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Ambulance,
  Shield,
  AlertTriangle,
  Clock,
  Signal,
  Heart,
  Navigation,
  Users,
  MessageCircle,
  Star,
  Copy,
  CheckCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EmergencyContactsProps {
  selectedLanguage: string;
  userLocation?: { lat: number; lng: number; address?: string };
  networkStatus?: "online" | "offline" | "weak";
}

interface CallLog {
  id: string;
  serviceName: string;
  number: string;
  timestamp: Date;
  duration?: number;
  status: "completed" | "failed" | "ongoing";
}

interface PersonalContact {
  id: string;
  name: string;
  relationship: string;
  number: string;
  priority: "high" | "medium" | "low";
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  selectedLanguage,
  userLocation,
  networkStatus = "online",
}) => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>(
    []
  );
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const translations = {
    en: {
      title: "Emergency Contacts",
      subtitle: "Tap to call immediately",
      ndma: "National Disaster Management",
      police: "Police Emergency",
      fire: "Fire Brigade",
      ambulance: "Medical Emergency",
      flood: "Flood Control Room",
      rescue: "Search & Rescue",
      calling: "Calling",
      available: "Available 24/7",
      currentTime: "Current Time",
      networkStatus: "Network Status",
      location: "Current Location",
      callHistory: "Recent Calls",
      personalContacts: "My Emergency Contacts",
      addContact: "Add Personal Contact",
      quickMessage: "Quick Emergency Message",
      sendSMS: "Send SMS Alert",
      shareLocation: "Share My Location",
      emergencyProtocol: "Emergency Protocol",
      guidelines: "Emergency Guidelines",
      name: "Name",
      relationship: "Relationship",
      phoneNumber: "Phone Number",
      priority: "Priority",
      high: "High",
      medium: "Medium",
      low: "Low",
      save: "Save Contact",
      cancel: "Cancel",
      copy: "Copy Number",
      copied: "Copied!",
      online: "Online",
      offline: "Offline",
      weak: "Weak Signal",
      messageTemplate: "Emergency! I need immediate assistance. My location: ",
      protocolSteps: [
        "1. Assess the situation quickly but thoroughly",
        "2. Ensure your own safety first",
        "3. Call the appropriate emergency service",
        "4. Provide clear location information",
        "5. Follow dispatcher instructions carefully",
        "6. Stay on the line until help arrives",
        "7. Contact family/friends if safe to do so",
      ],
      favorites: "Favorites",
      addToFavorites: "Add to Favorites",
    },
    hi: {
      title: "आपातकालीन संपर्क",
      subtitle: "तुरंत कॉल करने के लिए टैप करें",
      ndma: "राष्ट्रीय आपदा प्रबंधन",
      police: "पुलिस आपातकाल",
      fire: "अग्निशमन",
      ambulance: "चिकित्सा आपातकाल",
      flood: "बाढ़ नियंत्रण कक्ष",
      rescue: "खोज और बचाव",
      calling: "कॉल कर रहे हैं",
      available: "24/7 उपलब्ध",
      currentTime: "वर्तमान समय",
      networkStatus: "नेटवर्क स्थिति",
      location: "वर्तमान स्थान",
      callHistory: "हाल की कॉल",
      personalContacts: "मेरे आपातकालीन संपर्क",
      addContact: "व्यक्तिगत संपर्क जोड़ें",
      quickMessage: "त्वरित आपातकालीन संदेश",
      sendSMS: "SMS अलर्ट भेजें",
      shareLocation: "मेरा स्थान साझा करें",
      emergencyProtocol: "आपातकालीन प्रोटोकॉल",
      guidelines: "आपातकालीन दिशानिर्देश",
      name: "नाम",
      relationship: "रिश्ता",
      phoneNumber: "फोन नंबर",
      priority: "प्राथमिकता",
      high: "उच्च",
      medium: "मध्यम",
      low: "कम",
      save: "संपर्क सहेजें",
      cancel: "रद्द करें",
      copy: "नंबर कॉपी करें",
      copied: "कॉपी हो गया!",
      online: "ऑनलाइन",
      offline: "ऑफलाइन",
      weak: "कमजोर सिग्नल",
      messageTemplate: "आपातकाल! मुझे तत्काल सहायता चाहिए। मेरा स्थान: ",
      protocolSteps: [
        "1. स्थिति का तुरंत लेकिन पूर्ण आकलन करें",
        "2. पहले अपनी सुरक्षा सुनिश्चित करें",
        "3. उपयुक्त आपातकालीन सेवा को कॉल करें",
        "4. स्पष्ट स्थान की जानकारी प्रदान करें",
        "5. डिस्पैचर के निर्देशों का सावधानीपूर्वक पालन करें",
        "6. सहायता आने तक लाइन पर रहें",
        "7. यदि सुरक्षित हो तो परिवार/मित्रों से संपर्क करें",
      ],
      favorites: "पसंदीदा",
      addToFavorites: "पसंदीदा में जोड़ें",
    },
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  const emergencyContacts = [
    {
      id: "ndma",
      name: t.ndma,
      number: "1077",
      icon: AlertTriangle,
      color: "bg-red-600 hover:bg-red-700",
      description: "NDMA Emergency Helpline",
      category: "government",
      priority: "high",
    },
    {
      id: "police",
      name: t.police,
      number: "100",
      icon: Shield,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Police Emergency Services",
      category: "law-enforcement",
      priority: "high",
    },
    {
      id: "fire",
      name: t.fire,
      number: "101",
      icon: AlertTriangle,
      color: "bg-orange-600 hover:bg-orange-700",
      description: "Fire Brigade Emergency",
      category: "fire-safety",
      priority: "high",
    },
    {
      id: "ambulance",
      name: t.ambulance,
      number: "108",
      icon: Ambulance,
      color: "bg-green-600 hover:bg-green-700",
      description: "Medical Emergency Services",
      category: "medical",
      priority: "high",
    },
    {
      id: "flood",
      name: t.flood,
      number: "1070",
      icon: MapPin,
      color: "bg-indigo-600 hover:bg-indigo-700",
      description: "Flood Emergency Control",
      category: "disaster",
      priority: "medium",
    },
    {
      id: "rescue",
      name: t.rescue,
      number: "1091",
      icon: Users,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Search and Rescue Operations",
      category: "rescue",
      priority: "high",
    },
  ];

  const handleEmergencyCall = (number: string, serviceName: string) => {
    const newCall: CallLog = {
      id: Date.now().toString(),
      serviceName,
      number,
      timestamp: new Date(),
      status: "ongoing",
    };

    setCallLogs((prev) => [newCall, ...prev.slice(0, 9)]); // Keep last 10 calls

    toast({
      title: t.calling,
      description: `${serviceName}: ${number}`,
      duration: 3000,
    });

    if (typeof window !== "undefined") {
      window.open(`tel:${number}`, "_self");
    }
  };

  const handleCopyNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      toast({
        title: t.copied,
        description: number,
        duration: 2000,
      });
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (err) {
      console.error("Failed to copy number:", err);
    }
  };

  const handleSendEmergencySMS = () => {
    const message =
      emergencyMessage ||
      t.messageTemplate + (userLocation?.address || "Unknown");
    personalContacts.forEach((contact) => {
      if (contact.priority === "high") {
        if (typeof window !== "undefined") {
          window.open(
            `sms:${contact.number}?body=${encodeURIComponent(message)}`,
            "_self"
          );
        }
      }
    });
    toast({
      title: "SMS Alerts Sent",
      description: `Sent to ${
        personalContacts.filter((c) => c.priority === "high").length
      } contacts`,
      duration: 3000,
    });
  };

  const addPersonalContact = (contact: Omit<PersonalContact, "id">) => {
    const newContact: PersonalContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setPersonalContacts((prev) => [...prev, newContact]);
    setIsAddingContact(false);
    toast({
      title: "Contact Added",
      description: `${contact.name} added to emergency contacts`,
      duration: 2000,
    });
  };

  const getNetworkStatusColor = () => {
    switch (networkStatus) {
      case "online":
        return "text-green-600";
      case "weak":
        return "text-yellow-600";
      case "offline":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getNetworkStatusIcon = () => {
    switch (networkStatus) {
      case "online":
        return <Signal className="w-4 h-4" />;
      case "weak":
        return <Signal className="w-4 h-4" />;
      case "offline":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Signal className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header with Status Information */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
          <Badge
            variant="outline"
            className="mt-2 text-green-700 border-green-300"
          >
            <Clock className="w-4 h-4 mr-1" />
            {t.available}
          </Badge>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-center space-x-2 bg-white rounded-lg p-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{t.currentTime}:</span>
            <span className="font-mono">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>

          <div
            className={`flex items-center justify-center space-x-2 bg-white rounded-lg p-3 ${getNetworkStatusColor()}`}
          >
            {getNetworkStatusIcon()}
            <span className="font-medium">{t.networkStatus}:</span>
            <span>{t[networkStatus as keyof typeof t] || networkStatus}</span>
          </div>

          {userLocation && (
            <div className="flex items-center justify-center space-x-2 bg-white rounded-lg p-3">
              <Navigation className="w-4 h-4 text-green-600" />
              <span className="font-medium">{t.location}:</span>
              <span className="truncate">
                {userLocation.address || "Available"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <MessageCircle className="w-5 h-5" />
              <span>{t.quickMessage}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder={t.messageTemplate}
              value={emergencyMessage}
              onChange={(e) => setEmergencyMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handleSendEmergencySMS}
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={
                personalContacts.filter((c) => c.priority === "high").length ===
                0
              }
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {t.sendSMS}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-blue-800">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{t.personalContacts}</span>
              </div>
              <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    {t.addContact}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.addContact}</DialogTitle>
                  </DialogHeader>
                  <AddContactForm onAdd={addPersonalContact} translations={t} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {personalContacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No personal contacts added yet
              </p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {personalContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500">
                        {contact.relationship}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          contact.priority === "high"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {t[contact.priority as keyof typeof t]}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleEmergencyCall(contact.number, contact.name)
                        }
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Service Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyContacts.map((contact) => {
          const IconComponent = contact.icon;
          return (
            <Card
              key={contact.id}
              className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500 hover:scale-105"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-full ${
                        contact.color.split(" ")[0]
                      } text-white shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {contact.description}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {contact.category}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="font-mono text-xl font-bold px-4 py-2"
                  >
                    {contact.number}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyNumber(contact.number)}
                    className="flex items-center space-x-1"
                  >
                    {copiedNumber === contact.number ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-xs">
                      {copiedNumber === contact.number ? t.copied : t.copy}
                    </span>
                  </Button>
                </div>

                <Button
                  onClick={() =>
                    handleEmergencyCall(contact.number, contact.name)
                  }
                  className={`w-full ${contact.color} text-white font-bold py-4 flex items-center justify-center space-x-2 text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
                  size="lg"
                >
                  <Phone className="w-6 h-6" />
                  <span>Call {contact.number}</span>
                  <Zap className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call History */}
      {callLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{t.callHistory}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {callLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <div>
                    <p className="font-medium">{log.serviceName}</p>
                    <p className="text-sm text-gray-500">
                      {log.timestamp.toLocaleString()} • {log.number}
                    </p>
                  </div>
                  <Badge
                    variant={
                      log.status === "completed" ? "default" : "destructive"
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Protocol */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Heart className="w-6 h-6" />
            <span>{t.emergencyProtocol}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">
                {t.guidelines}
              </h4>
              <div className="space-y-2">
                {t.protocolSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-blue-700 flex-1">
                      {step.substring(3)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h4 className="font-bold text-red-800">Critical Reminders</h4>
                  <p className="text-red-700 text-sm">
                    Keep these points in mind during emergencies
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Stay calm and speak clearly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Provide exact location with landmarks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Keep phone battery charged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Have backup communication method</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add Contact Form Component
const AddContactForm: React.FC<{
  onAdd: (contact: Omit<PersonalContact, "id">) => void;
  translations: any;
}> = ({ onAdd, translations: t }) => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    number: "",
    priority: "high" as "high" | "medium" | "low",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.number) {
      onAdd(formData);
      setFormData({ name: "", relationship: "", number: "", priority: "high" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t.name}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="relationship">{t.relationship}</Label>
        <Input
          id="relationship"
          value={formData.relationship}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, relationship: e.target.value }))
          }
          placeholder="e.g., Spouse, Parent, Friend"
        />
      </div>

      <div>
        <Label htmlFor="number">{t.phoneNumber}</Label>
        <Input
          id="number"
          type="tel"
          value={formData.number}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, number: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="priority">{t.priority}</Label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              priority: e.target.value as any,
            }))
          }
          className="w-full p-2 border rounded-md"
        >
          <option value="high">{t.high}</option>
          <option value="medium">{t.medium}</option>
          <option value="low">{t.low}</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {t.save}
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          {t.cancel}
        </Button>
      </div>
    </form>
  );
};

export default EmergencyContacts;
