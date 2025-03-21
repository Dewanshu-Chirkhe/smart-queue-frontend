
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

interface OTPVerificationProps {
  onVerify: () => void;
  onCancel: () => void;
  email: string;
}

const OTPVerification = ({ onVerify, onCancel, email }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Handle timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input if a digit was entered
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Resend OTP
  const resendOTP = () => {
    if (timer === 0) {
      setIsResending(true);
      
      // Simulate API call
      setTimeout(() => {
        setTimer(60);
        setIsResending(false);
      }, 1000);
    }
  };

  // Check if OTP is complete
  const isOTPComplete = otp.every(digit => digit !== '');

  // Verify OTP
  const verifyOTP = () => {
    if (isOTPComplete) {
      // Mock verification - in a real app, this would validate with the backend
      if (otp.join('') === '1234') { // Always accept 1234 as valid OTP for demo
        onVerify();
      } else {
        alert('Invalid OTP. For demo, use 1234.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Enter Verification Code</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification code to <strong>{email}</strong>. Please enter it below.
          </p>
          
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold"
                  autoFocus={index === 0}
                  maxLength={1}
                />
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={resendOTP}
                disabled={timer > 0 || isResending}
                className={`text-sm ${timer > 0 || isResending ? 'text-gray-400' : 'text-hospital-600 hover:text-hospital-700'}`}
              >
                {isResending ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
              
              <p className="text-sm text-gray-500">
                For demo, use OTP: 1234
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={verifyOTP}
              disabled={!isOTPComplete}
              className={`hospital-btn-primary w-full ${!isOTPComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
