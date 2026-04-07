import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Phone, 
  TrendingUp, 
  Shield, 
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import '../styles/carousel.css';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

// Country codes with flags
const countryCodes = [
  { code: '+971-UAE', dialCode: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+93-Afghanistan', dialCode: '+93', country: 'Afghanistan', flag: '🇦🇫' },
  { code: '+355-Albania', dialCode: '+355', country: 'Albania', flag: '🇦🇱' },
  { code: '+213-Algeria', dialCode: '+213', country: 'Algeria', flag: '🇩🇿' },
  { code: '+376-Andorra', dialCode: '+376', country: 'Andorra', flag: '🇦🇩' },
  { code: '+244-Angola', dialCode: '+244', country: 'Angola', flag: '🇦🇴' },
  { code: '+54-Argentina', dialCode: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+374-Armenia', dialCode: '+374', country: 'Armenia', flag: '🇦🇲' },
  { code: '+61-Australia', dialCode: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+43-Austria', dialCode: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+994-Azerbaijan', dialCode: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+973-Bahrain', dialCode: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+880-Bangladesh', dialCode: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+375-Belarus', dialCode: '+375', country: 'Belarus', flag: '🇧🇾' },
  { code: '+32-Belgium', dialCode: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+501-Belize', dialCode: '+501', country: 'Belize', flag: '🇧🇿' },
  { code: '+229-Benin', dialCode: '+229', country: 'Benin', flag: '🇧🇯' },
  { code: '+975-Bhutan', dialCode: '+975', country: 'Bhutan', flag: '🇧🇹' },
  { code: '+591-Bolivia', dialCode: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+387-Bosnia', dialCode: '+387', country: 'Bosnia', flag: '🇧🇦' },
  { code: '+267-Botswana', dialCode: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+55-Brazil', dialCode: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+673-Brunei', dialCode: '+673', country: 'Brunei', flag: '🇧🇳' },
  { code: '+359-Bulgaria', dialCode: '+359', country: 'Bulgaria', flag: '🇧🇬' },
  { code: '+226-BurkinaFaso', dialCode: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+257-Burundi', dialCode: '+257', country: 'Burundi', flag: '🇧🇮' },
  { code: '+855-Cambodia', dialCode: '+855', country: 'Cambodia', flag: '🇰🇭' },
  { code: '+237-Cameroon', dialCode: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+1-Canada', dialCode: '+1', country: 'Canada/USA', flag: '🇨🇦' },
  { code: '+238-CapeVerde', dialCode: '+238', country: 'Cape Verde', flag: '🇨🇻' },
  { code: '+236-CAR', dialCode: '+236', country: 'Central African Republic', flag: '🇨🇫' },
  { code: '+235-Chad', dialCode: '+235', country: 'Chad', flag: '🇹🇩' },
  { code: '+56-Chile', dialCode: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+86-China', dialCode: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+57-Colombia', dialCode: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+269-Comoros', dialCode: '+269', country: 'Comoros', flag: '🇰🇲' },
  { code: '+242-Congo', dialCode: '+242', country: 'Congo', flag: '🇨🇬' },
  { code: '+506-CostaRica', dialCode: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+385-Croatia', dialCode: '+385', country: 'Croatia', flag: '🇭🇷' },
  { code: '+53-Cuba', dialCode: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+357-Cyprus', dialCode: '+357', country: 'Cyprus', flag: '🇨🇾' },
  { code: '+420-Czechia', dialCode: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+45-Denmark', dialCode: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+253-Djibouti', dialCode: '+253', country: 'Djibouti', flag: '🇩🇯' },
  { code: '+593-Ecuador', dialCode: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+20-Egypt', dialCode: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+503-ElSalvador', dialCode: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+240-EqGuinea', dialCode: '+240', country: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '+291-Eritrea', dialCode: '+291', country: 'Eritrea', flag: '🇪🇷' },
  { code: '+372-Estonia', dialCode: '+372', country: 'Estonia', flag: '🇪🇪' },
  { code: '+251-Ethiopia', dialCode: '+251', country: 'Ethiopia', flag: '🇪🇹' },
  { code: '+679-Fiji', dialCode: '+679', country: 'Fiji', flag: '🇫🇯' },
  { code: '+358-Finland', dialCode: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+33-France', dialCode: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+241-Gabon', dialCode: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+220-Gambia', dialCode: '+220', country: 'Gambia', flag: '🇬🇲' },
  { code: '+995-Georgia', dialCode: '+995', country: 'Georgia', flag: '🇬🇪' },
  { code: '+49-Germany', dialCode: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+233-Ghana', dialCode: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+30-Greece', dialCode: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+502-Guatemala', dialCode: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+224-Guinea', dialCode: '+224', country: 'Guinea', flag: '🇬🇳' },
  { code: '+245-GuineaBissau', dialCode: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+592-Guyana', dialCode: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+509-Haiti', dialCode: '+509', country: 'Haiti', flag: '🇭🇹' },
  { code: '+504-Honduras', dialCode: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+852-HongKong', dialCode: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+36-Hungary', dialCode: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+354-Iceland', dialCode: '+354', country: 'Iceland', flag: '🇮🇸' },
  { code: '+91-India', dialCode: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+62-Indonesia', dialCode: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+98-Iran', dialCode: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+964-Iraq', dialCode: '+964', country: 'Iraq', flag: '🇮🇶' },
  { code: '+353-Ireland', dialCode: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+972-Israel', dialCode: '+972', country: 'Israel', flag: '🇱' },
  { code: '+39-Italy', dialCode: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+225-IvoryCoast', dialCode: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
  { code: '+81-Japan', dialCode: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+962-Jordan', dialCode: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+7-Kazakhstan', dialCode: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+254-Kenya', dialCode: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+965-Kuwait', dialCode: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+996-Kyrgyzstan', dialCode: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+856-Laos', dialCode: '+856', country: 'Laos', flag: '🇱🇦' },
  { code: '+371-Latvia', dialCode: '+371', country: 'Latvia', flag: '🇱🇻' },
  { code: '+961-Lebanon', dialCode: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+266-Lesotho', dialCode: '+266', country: 'Lesotho', flag: '🇱🇸' },
  { code: '+231-Liberia', dialCode: '+231', country: 'Liberia', flag: '🇱🇷' },
  { code: '+218-Libya', dialCode: '+218', country: 'Libya', flag: '🇱🇾' },
  { code: '+423-Liechtenstein', dialCode: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
  { code: '+370-Lithuania', dialCode: '+370', country: 'Lithuania', flag: '🇱🇹' },
  { code: '+352-Luxembourg', dialCode: '+352', country: 'Luxembourg', flag: '🇱🇺' },
  { code: '+853-Macau', dialCode: '+853', country: 'Macau', flag: '🇲🇴' },
  { code: '+389-Macedonia', dialCode: '+389', country: 'Macedonia', flag: '🇲🇰' },
  { code: '+261-Madagascar', dialCode: '+261', country: 'Madagascar', flag: '🇲🇬' },
  { code: '+265-Malawi', dialCode: '+265', country: 'Malawi', flag: '🇲🇼' },
  { code: '+60-Malaysia', dialCode: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+960-Maldives', dialCode: '+960', country: 'Maldives', flag: '🇲🇻' },
  { code: '+223-Mali', dialCode: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+356-Malta', dialCode: '+356', country: 'Malta', flag: '🇲🇹' },
  { code: '+222-Mauritania', dialCode: '+222', country: 'Mauritania', flag: '🇲🇷' },
  { code: '+230-Mauritius', dialCode: '+230', country: 'Mauritius', flag: '🇲🇺' },
  { code: '+52-Mexico', dialCode: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+373-Moldova', dialCode: '+373', country: 'Moldova', flag: '🇲🇩' },
  { code: '+377-Monaco', dialCode: '+377', country: 'Monaco', flag: '🇲🇨' },
  { code: '+976-Mongolia', dialCode: '+976', country: 'Mongolia', flag: '🇲🇳' },
  { code: '+382-Montenegro', dialCode: '+382', country: 'Montenegro', flag: '🇲🇪' },
  { code: '+212-Morocco', dialCode: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+258-Mozambique', dialCode: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '+95-Myanmar', dialCode: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+264-Namibia', dialCode: '+264', country: 'Namibia', flag: '🇳🇦' },
  { code: '+977-Nepal', dialCode: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+31-Netherlands', dialCode: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+64-NewZealand', dialCode: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+505-Nicaragua', dialCode: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+227-Niger', dialCode: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+234-Nigeria', dialCode: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+850-NorthKorea', dialCode: '+850', country: 'North Korea', flag: '🇰🇵' },
  { code: '+47-Norway', dialCode: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+968-Oman', dialCode: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+92-Pakistan', dialCode: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+970-Palestine', dialCode: '+970', country: 'Palestine', flag: '🇵🇸' },
  { code: '+507-Panama', dialCode: '+507', country: 'Panama', flag: '🇵🇦' },
  { code: '+675-PNG', dialCode: '+675', country: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '+595-Paraguay', dialCode: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+51-Peru', dialCode: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+63-Philippines', dialCode: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+48-Poland', dialCode: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+351-Portugal', dialCode: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+974-Qatar', dialCode: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+40-Romania', dialCode: '+40', country: 'Romania', flag: '🇷🇴' },
  { code: '+7-Russia', dialCode: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+250-Rwanda', dialCode: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+966-SaudiArabia', dialCode: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+221-Senegal', dialCode: '+221', country: 'Senegal', flag: '🇸🇳' },
  { code: '+381-Serbia', dialCode: '+381', country: 'Serbia', flag: '🇷🇸' },
  { code: '+248-Seychelles', dialCode: '+248', country: 'Seychelles', flag: '🇸🇨' },
  { code: '+232-SierraLeone', dialCode: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+65-Singapore', dialCode: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+421-Slovakia', dialCode: '+421', country: 'Slovakia', flag: '🇸🇰' },
  { code: '+386-Slovenia', dialCode: '+386', country: 'Slovenia', flag: '🇸🇮' },
  { code: '+252-Somalia', dialCode: '+252', country: 'Somalia', flag: '🇸🇴' },
  { code: '+27-SouthAfrica', dialCode: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+82-SouthKorea', dialCode: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+211-SouthSudan', dialCode: '+211', country: 'South Sudan', flag: '🇸🇸' },
  { code: '+34-Spain', dialCode: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+94-SriLanka', dialCode: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+249-Sudan', dialCode: '+249', country: 'Sudan', flag: '🇸🇩' },
  { code: '+597-Suriname', dialCode: '+597', country: 'Suriname', flag: '🇸🇷' },
  { code: '+268-Swaziland', dialCode: '+268', country: 'Swaziland', flag: '🇸🇿' },
  { code: '+46-Sweden', dialCode: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+41-Switzerland', dialCode: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+963-Syria', dialCode: '+963', country: 'Syria', flag: '🇸🇾' },
  { code: '+886-Taiwan', dialCode: '+886', country: 'Taiwan', flag: '🇹🇼' },
  { code: '+992-Tajikistan', dialCode: '+992', country: 'Tajikistan', flag: '🇹🇯' },
  { code: '+255-Tanzania', dialCode: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+66-Thailand', dialCode: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+228-Togo', dialCode: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+676-Tonga', dialCode: '+676', country: 'Tonga', flag: '🇹🇴' },
  { code: '+216-Tunisia', dialCode: '+216', country: 'Tunisia', flag: '🇹🇳' },
  { code: '+90-Turkey', dialCode: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+993-Turkmenistan', dialCode: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+256-Uganda', dialCode: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+380-Ukraine', dialCode: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+44-UK', dialCode: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+598-Uruguay', dialCode: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+998-Uzbekistan', dialCode: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+58-Venezuela', dialCode: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+84-Vietnam', dialCode: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+967-Yemen', dialCode: '+967', country: 'Yemen', flag: '🇾🇪' },
  { code: '+260-Zambia', dialCode: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263-Zimbabwe', dialCode: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
];

export function BecomePartnerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    salonName: '',
    countryCode: '+971-UAE', // Changed to include country for uniqueness
    phone: '',
    email: '',
  });
  // const [verificationCode, setVerificationCode] = useState(''); // Temporarily disabled
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Temporarily disabled email verification - will be enabled after Resend setup
  // const [step, setStep] = useState<'form' | 'verify'>('form');
  // const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // Countdown timer for resend (disabled)
  // useEffect(() => {
  //   if (countdown > 0) {
  //     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [countdown]);

  // Simple form submission without verification (temporary)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const leadResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            fullName: formData.salonName,
            businessName: formData.salonName,
            phoneNumber: `${countryCodes.find(c => c.code === formData.countryCode)?.dialCode || ''}${formData.phone}`,
            email: formData.email,
            city: 'Dubai',
            businessType: 'Salon',
          }),
        }
      );

      const leadResult = await leadResponse.json();

      if (leadResponse.ok && leadResult.success) {
        console.log('✅ Lead created:', leadResult.leadId);
        navigate('/pricing');
        toast.success('Lead created successfully!');
      } else {
        setError('Something went wrong. Please try again.');
        toast.error('Failed to create lead.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Failed to submit. Please try again.');
      toast.error('Failed to submit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* EMAIL VERIFICATION CODE - COMMENTED OUT FOR LATER USE
  
  // Handle initial form submission - send verification code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads/send-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Verification code sent to:', formData.email);
        setStep('verify');
        setCountdown(60); // 60 seconds cooldown
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('❌ Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle code verification and lead creation
  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // First, verify the code
      const verifyResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads/verify-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ 
            email: formData.email,
            code: verificationCode 
          }),
        }
      );

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyResult.success) {
        setError(verifyResult.error || 'Invalid verification code');
        setIsSubmitting(false);
        return;
      }

      // Code is valid - now create the lead
      const leadResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            fullName: formData.salonName,
            businessName: formData.salonName,
            phoneNumber: `${countryCodes.find(c => c.code === formData.countryCode)?.dialCode || ''}${formData.phone}`,
            email: formData.email,
            city: 'Dubai',
            businessType: 'Salon',
          }),
        }
      );

      const leadResult = await leadResponse.json();

      if (leadResponse.ok && leadResult.success) {
        console.log('✅ Lead created:', leadResult.leadId);
        navigate('/pricing');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads/send-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Verification code resent');
        setCountdown(60);
        setVerificationCode('');
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (error) {
      console.error('❌ Error resending code:', error);
      setError('Failed to resend code');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  END OF EMAIL VERIFICATION CODE */

  const brandLogos = [
    'HARPER\'S BAZAAR',
    'COSMOPOLITAN',
    'VANITY FAIR',
    'MARIE CLAIRE',
    'VOGUE',
    'ELLE',
    'GLAMOUR',
    'HARPER\'S BAZAAR'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">The Future of Salon Management</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gray-900">Your Salon Needs an </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Receptionist
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8">
                Stop losing clients to missed calls. Katia AI answers instantly, consults clients, and books appointments directly into your calendar. 24/7.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">AI Receptionist 24/7</h3>
                    <p className="text-sm text-gray-600">Never miss a client. Our AI answers calls and messages instantly, booking appointments day and night.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Real-time Voice Booking</h3>
                    <p className="text-sm text-gray-600">Clients can talk naturally to our AI, and it will find the perfect slot in your calendar automatically.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Business Growth</h3>
                    <p className="text-sm text-gray-600">Access powerful analytics and marketing tools to scale your revenue.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">No Hidden Fees</h3>
                    <p className="text-sm text-gray-600">One monthly price for your whole team. No per user commissions or charges.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <Card className="border-2 border-gray-200 shadow-2xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Your AI Assistant
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter your details to start automating your salon
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Salon Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Salon Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Bella Beauty"
                        value={formData.salonName}
                        onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                        >
                          <SelectTrigger className="w-32 h-12">
                            <SelectValue>
                              {countryCodes.find(c => c.code === formData.countryCode)?.flag} {countryCodes.find(c => c.code === formData.countryCode)?.dialCode}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {countryCodes.map((country, index) => (
                              <SelectItem key={`${country.code}-${index}`} value={country.code}>
                                <span className="flex items-center gap-2">
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-sm">{country.country}</span>
                                  <span className="text-xs text-gray-500">{country.dialCode}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="tel"
                          placeholder="50 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="flex-1 h-12"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>

                    {/* Verification Code */}
                    {/* {step === 'verify' && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Verification Code
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="h-12"
                          maxLength={6}
                          required
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            Code sent to {formData.email}
                          </p>
                          {countdown > 0 ? (
                            <p className="text-xs text-gray-400">
                              Resend in {countdown}s
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendCode}
                              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                              disabled={isSubmitting}
                            >
                              Resend Code
                            </button>
                          )}
                        </div>
                      </div>
                    )} */}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get Your AI Assistant'}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      No credit card required to view our plans
                    </p>

                    {/* Error Message */}
                    {error && (
                      <p className="text-sm text-center text-red-500 mt-2">
                        {error}
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-12 border-y border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-6">
            TRUSTED BY TOP SALONS IN DUBAI, LONDON, AND NEW YORK
          </p>
          <div className="carousel-container">
            <div className="carousel-track">
              {/* First set of logos */}
              {brandLogos.map((logo, index) => (
                <div key={index} className="carousel-item">
                  {logo}
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {brandLogos.map((logo, index) => (
                <div key={`duplicate-${index}`} className="carousel-item">
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}