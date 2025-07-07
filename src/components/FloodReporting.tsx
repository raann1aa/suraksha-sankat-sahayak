
import React, { useState } from 'react';
import { Camera, MapPin, Send, Upload, AlertTriangle, Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface FloodReportingProps {
  currentLocation: {lat: number, lng: number} | null;
  selectedLanguage: string;
}

const FloodReporting: React.FC<FloodReportingProps> = ({ currentLocation, selectedLanguage }) => {
  const [reportType, setReportType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const translations = {
    en: {
      title: "Report Flood Situation",
      subtitle: "Help your community by reporting flood conditions",
      reportType: "Report Type",
      floodLevel: "Flood in Street/Road",
      waterLogging: "Water Logging",
      damageProperty: "Property Damage",
      waterQuality: "Water Quality Issue",
      emergencyRescue: "Emergency Rescue Needed",
      severity: "Severity Level",
      low: "Low - Minor inconvenience",
      medium: "Medium - Moderate impact", 
      high: "High - Serious concern",
      critical: "Critical - Life threatening",
      description: "Description",
      descriptionPlaceholder: "Describe the situation in detail...",
      addPhotos: "Add Photos",
      submit: "Submit Report",
      location: "Location",
      submitting: "Submitting Report..."
    },
    hi: {
      title: "बाढ़ की स्थिति की रिपोर्ट करें",
      subtitle: "बाढ़ की स्थिति की रिपोर्ट करके अपने समुदाय की मदद करें",
      reportType: "रिपोर्ट का प्रकार",
      floodLevel: "सड़क/रास्ते में बाढ़",
      waterLogging: "जल भराव",
      damageProperty: "संपत्ति की क्षति",
      waterQuality: "पानी की गुणवत्ता की समस्या",
      emergencyRescue: "आपातकालीन बचाव की आवश्यकता",
      severity: "गंभीरता का स्तर",
      low: "कम - मामूली परेशानी",
      medium: "मध्यम - मध्यम प्रभाव",
      high: "उच्च - गंभीर चिंता",
      critical: "गंभीर - जानलेवा",
      description: "विवरण",
      descriptionPlaceholder: "स्थिति का विस्तार से वर्णन करें...",
      addPhotos: "फोटो जोड़ें",
      submit: "रिपोर्ट भेजें",
      location: "स्थान",
      submitting: "रिपोर्ट भेज रहे हैं..."
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations];

  const reportTypes = [
    { value: 'flood_level', label: t.floodLevel, icon: AlertTriangle },
    { value: 'water_logging', label: t.waterLogging, icon: MapPin },
    { value: 'property_damage', label: t.damageProperty, icon: Home },
    { value: 'water_quality', label: t.waterQuality, icon: Building },
    { value: 'emergency_rescue', label: t.emergencyRescue, icon: AlertTriangle }
  ];

  const severityLevels = [
    { value: 'low', label: t.low, color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: t.medium, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: t.high, color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: t.critical, color: 'bg-red-100 text-red-800' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleSubmitReport = async () => {
    if (!reportType || !severity || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: t.submitting,
      description: "Your report is being processed...",
    });

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Submitted Successfully",
        description: "Thank you for helping your community. Report ID: #FLD" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      });
      
      // Reset form
      setReportType('');
      setSeverity('');
      setDescription('');
      setImages([]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {currentLocation && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <span className="font-medium text-blue-800">{t.location}: </span>
              <span className="text-blue-700">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.reportType}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type..." />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="hover:bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <type.icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.severity}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {severityLevels.map((level) => (
              <Button
                key={level.value}
                variant={severity === level.value ? "default" : "outline"}
                onClick={() => setSeverity(level.value)}
                className={`h-auto py-3 ${severity === level.value ? level.color : ''}`}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm">{level.label.split(' - ')[0]}</div>
                  <div className="text-xs opacity-75">{level.label.split(' - ')[1]}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.description}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>{t.addPhotos}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="outline" className="w-full cursor-pointer" asChild>
                <div className="flex items-center justify-center space-x-2 py-8 border-2 border-dashed border-gray-300 hover:border-gray-400">
                  <Upload className="w-6 h-6" />
                  <span>Click to upload photos</span>
                </div>
              </Button>
            </label>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmitReport}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 text-lg"
        size="lg"
      >
        <Send className="w-5 h-5 mr-2" />
        {t.submit}
      </Button>
    </div>
  );
};

export default FloodReporting;
