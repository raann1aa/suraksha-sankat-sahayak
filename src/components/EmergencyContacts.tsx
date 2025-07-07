
import React from 'react';
import { Phone, MapPin, Ambulance, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EmergencyContactsProps {
  selectedLanguage: string;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ selectedLanguage }) => {
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
      available: "Available 24/7"
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
      available: "24/7 उपलब्ध"
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  const emergencyContacts = [
    {
      id: 'ndma',
      name: t.ndma,
      number: '1077',
      icon: AlertTriangle,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'NDMA Emergency Helpline'
    },
    {
      id: 'police',
      name: t.police,
      number: '100',
      icon: Shield,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Police Emergency Services'
    },
    {
      id: 'fire',
      name: t.fire,
      number: '101',
      icon: AlertTriangle,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Fire Brigade Emergency'
    },
    {
      id: 'ambulance',
      name: t.ambulance,
      number: '108',
      icon: Ambulance,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Medical Emergency Services'
    },
    {
      id: 'flood',
      name: t.flood,
      number: '1070',
      icon: MapPin,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Flood Emergency Control'
    },
    {
      id: 'rescue',
      name: t.rescue,
      number: '1091',
      icon: Phone,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Search and Rescue Operations'
    }
  ];

  const handleEmergencyCall = (number: string, serviceName: string) => {
    toast({
      title: t.calling,
      description: `${serviceName}: ${number}`,
      duration: 2000
    });
    
    // In a real app, this would initiate the phone call
    if (typeof window !== 'undefined') {
      window.open(`tel:${number}`, '_self');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
        <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
          {t.available}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyContacts.map((contact) => {
          const IconComponent = contact.icon;
          return (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${contact.color.split(' ')[0]} text-white`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono text-lg">
                    {contact.number}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleEmergencyCall(contact.number, contact.name)}
                  className={`w-full ${contact.color} text-white font-semibold py-3 flex items-center justify-center space-x-2`}
                  size="lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call {contact.number}</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Emergency Guidelines</h3>
              <p className="text-red-700 text-sm mt-1">
                Stay calm • Provide exact location • Follow operator instructions • 
                Keep line clear for updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContacts;
