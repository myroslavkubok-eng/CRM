import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  X,
  AlertTriangle,
  Mail,
  Clock,
  CreditCard,
  CheckCircle,
  Shield,
  Lock,
  Info,
  DollarSign,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

interface RefundRequestModalProps {
  salon: any;
  onClose: () => void;
  onSubmit: (data: RefundRequestData) => void;
}

export interface RefundRequestData {
  salonId: number;
  salonName: string;
  ownerEmail: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reason: string;
  confirmationEmail: string;
  daysFromPayment: number;
}

export function RefundRequestModal({ salon, onClose, onSubmit }: RefundRequestModalProps) {
  const [step, setStep] = useState<'info' | 'verify' | 'confirm' | 'sent'>('info');
  const [reason, setReason] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Расчет дней с момента последнего платежа
  const lastPayment = salon.paymentHistory?.[0];
  const paymentDate = lastPayment ? new Date(lastPayment.date) : new Date();
  const today = new Date();
  const daysFromPayment = Math.floor((today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = 7 - daysFromPayment;
  const isEligible = daysFromPayment <= 7;

  // Расчет суммы возврата
  const refundAmount = lastPayment?.amount || 0;

  const handleEmailVerification = () => {
    setEmailError('');
    
    // Проверка что email совпадает с владельцем
    if (confirmEmail.toLowerCase().trim() !== salon.email.toLowerCase().trim()) {
      setEmailError('Email does not match salon owner email. For security, refund can only be requested by the registered owner.');
      return;
    }

    // Проверка что заполнена причина
    if (!reason.trim()) {
      setEmailError('Please provide a reason for the refund request.');
      return;
    }

    // Проверка согласия с условиями
    if (!agreedToTerms) {
      setEmailError('Please agree to the refund terms and conditions.');
      return;
    }

    setStep('verify');
  };

  const handleSendVerification = () => {
    // Здесь будет отправка email с кодом подтверждения
    console.log('📧 Sending verification email to:', confirmEmail);
    setStep('sent');
    
    // Имитация отправки запроса
    setTimeout(() => {
      const requestData: RefundRequestData = {
        salonId: salon.id,
        salonName: salon.name,
        ownerEmail: salon.email,
        amount: refundAmount,
        paymentDate: lastPayment.date,
        paymentMethod: lastPayment.method,
        reason: reason,
        confirmationEmail: confirmEmail,
        daysFromPayment: daysFromPayment,
      };
      onSubmit(requestData);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Secure Refund Request</h2>
                <p className="text-sm text-purple-100">Protected by email verification</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ELIGIBILITY CHECK */}
          {!isEligible ? (
            <Card className="p-6 border-2 border-red-200 bg-red-50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-900 text-lg mb-2">Refund Period Expired</h3>
                  <p className="text-red-700 mb-3">
                    According to our refund policy, refunds can only be requested within{' '}
                    <strong>7 days</strong> of payment.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Payment Date:</p>
                        <p className="font-bold text-gray-900">{lastPayment?.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Days Since Payment:</p>
                        <p className="font-bold text-red-600">{daysFromPayment} days</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    If you believe this is an error or have special circumstances, please contact
                    support at <strong>support@katia.beauty</strong>
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* STEP INDICATOR */}
              <div className="flex items-center justify-between mb-6">
                {[
                  { id: 'info', label: 'Information', icon: Info },
                  { id: 'verify', label: 'Verification', icon: Mail },
                  { id: 'sent', label: 'Submitted', icon: CheckCircle },
                ].map((s, idx) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div
                      className={`flex items-center gap-2 ${
                        step === s.id
                          ? 'text-purple-600'
                          : ['verify', 'sent'].includes(step) && idx < 1
                          ? 'text-green-600'
                          : step === 'sent' && idx < 2
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step === s.id
                            ? 'bg-purple-600 text-white'
                            : ['verify', 'sent'].includes(step) && idx < 1
                            ? 'bg-green-600 text-white'
                            : step === 'sent' && idx < 2
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded ${
                          ['verify', 'sent'].includes(step) && idx < 1
                            ? 'bg-green-600'
                            : step === 'sent' && idx === 1
                            ? 'bg-green-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* STEP 1: INFO */}
              {step === 'info' && (
                <div className="space-y-6">
                  {/* Eligibility Status */}
                  <Card className="p-5 border-2 border-green-200 bg-green-50">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="font-bold text-green-900">Eligible for Refund</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-gray-600">Days since payment:</p>
                          <p className="font-bold text-green-700">{daysFromPayment} days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-gray-600">Days left to request:</p>
                          <p className="font-bold text-green-700">{daysLeft} days</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Refund Details */}
                  <Card className="p-5 border-2 border-purple-100 bg-purple-50/30">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      Refund Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Salon:</span>
                        <span className="font-bold">{salon.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-bold">{salon.owner}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="font-bold">{lastPayment?.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Method:</span>
                        <Badge className="bg-blue-100 text-blue-700 gap-2">
                          <CreditCard className="w-3 h-3" />
                          {lastPayment?.method}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t-2 border-purple-200 flex justify-between items-center">
                        <span className="text-gray-600 font-semibold">Refund Amount:</span>
                        <span className="font-bold text-2xl text-green-600">
                          AED {refundAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Security Notice */}
                  <Card className="p-5 border-2 border-blue-100 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <h4 className="font-bold text-blue-900">Security & Refund Policy</h4>
                        <ul className="space-y-1 text-blue-800">
                          <li>✓ Refund will be sent to the <strong>original payment method only</strong></li>
                          <li>✓ Email verification required for security</li>
                          <li>✓ Super admin will review and approve request</li>
                          <li>✓ Processing time: 5-10 business days</li>
                          <li>✓ You will receive email confirmation at each step</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Reason Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Reason for Refund Request <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please explain why you are requesting a refund..."
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 min-h-[100px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
                  </div>

                  {/* Email Verification */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm Your Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => {
                          setConfirmEmail(e.target.value);
                          setEmailError('');
                        }}
                        placeholder="Enter your registered email"
                        className="pl-10 border-2 border-gray-300 focus:border-purple-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must match: <strong>{salon.email}</strong>
                    </p>
                    {emailError && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      I understand that the refund will be processed to my original payment method,
                      and I agree to the 7-day refund policy terms. I confirm that I am the
                      authorized owner of this salon account.
                    </span>
                  </label>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEmailVerification}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Continue to Verification
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: VERIFY */}
              {step === 'verify' && (
                <div className="space-y-6">
                  <Card className="p-6 border-2 border-purple-200 bg-purple-50">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto">
                        <Mail className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Email Verification Required</h3>
                      <p className="text-gray-700">
                        We will send a verification email to:
                      </p>
                      <p className="text-lg font-bold text-purple-600">{confirmEmail}</p>
                      <p className="text-sm text-gray-600">
                        Click the link in the email to confirm your refund request. The link will be
                        valid for <strong>24 hours</strong>.
                      </p>
                    </div>
                  </Card>

                  <Card className="p-5 border-2 border-amber-200 bg-amber-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <h4 className="font-bold text-amber-900">Important Security Note</h4>
                        <p className="text-amber-800">
                          After email confirmation, a super admin will review your request. You will
                          receive a final confirmation email when the refund is approved and processed.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refund Amount:</span>
                      <span className="font-bold">AED {refundAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refund To:</span>
                      <span className="font-bold">{lastPayment?.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-bold">5-10 business days</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('info')}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSendVerification}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Verification Email
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: SENT */}
              {step === 'sent' && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Request Submitted!</h3>
                  <p className="text-gray-700 max-w-md mx-auto">
                    We've sent a verification email to <strong>{confirmEmail}</strong>. Please check
                    your inbox and click the confirmation link.
                  </p>

                  <Card className="p-6 border-2 border-blue-100 bg-blue-50 text-left">
                    <h4 className="font-bold text-blue-900 mb-3">Next Steps:</h4>
                    <ol className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">1.</span>
                        <span>Check your email inbox (and spam folder)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">2.</span>
                        <span>Click the verification link within 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">3.</span>
                        <span>Super admin will review your request</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">4.</span>
                        <span>Refund processed within 5-10 business days</span>
                      </li>
                    </ol>
                  </Card>

                  <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
                    Close
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
