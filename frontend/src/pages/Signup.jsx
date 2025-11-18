import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Shield, Calendar, GraduationCap, Camera, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    branch: '',
    year: '',
    photo: null
  });
  const [otp, setOtp] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: '', score: 0 });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signUp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { title: 'Account Details', icon: User },
    { title: 'Verification', icon: Shield }
  ];
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'password') {
      checkPasswordStrength(e.target.value);
      checkPasswordMatch(e.target.value, formData.confirmPassword);
    }
    if (e.target.name === 'confirmPassword') {
      checkPasswordMatch(formData.password, e.target.value);
    }
  };
  const checkPasswordStrength = (password) => {
    let score = 0;
    let level = '';
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (score < 3) level = 'weak';
    else if (score < 5) level = 'medium';
    else level = 'strong';
    setPasswordStrength({ level, score });
  };
  const checkPasswordMatch = (password, confirmPassword) => {
    if (confirmPassword === '') {
      setPasswordMatch(true); 
    } else {
      setPasswordMatch(password === confirmPassword);
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file
      });
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleNextStep = async () => {
    if (currentStep === 0) {

      if (!passwordMatch) {
        toast.error('Passwords do not match');
        return;
      }
      if (!formData.email.endsWith('@chitkara.edu.in')) {
        toast.error('Only @chitkara.edu.in email addresses are allowed');
        return;
      }
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 16 || age > 30) {
        toast.error('Age must be between 16 and 30');
        return;
      }
      if (!formData.branch || !formData.year) {
        toast.error('Branch and year are required');
        return;
      }

      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('name', formData.fullName);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('department', formData.branch);
        formDataToSend.append('semester', formData.year);
        if (formData.photo) {
          formDataToSend.append('photo', formData.photo);
        }
        const { error } = await signUp(formData.email, formData.password, formDataToSend);
        if (error) {
          toast.error(error.message || 'Registration failed');
          return;
        } else {
          toast.success('Account created! Please check your email for verification code.');
          setCurrentStep(1);
        }
      } catch {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const { error } = await verifyOtp(formData.email, otp);
      if (error) {
        toast.error(error || 'Verification failed');
      } else {
        toast.success('Account verified successfully! Welcome to Campus Connect!');
        navigate('/dashboard', { replace: true });
      }
    } catch {
      console.error('Signup: Unexpected error during OTP verification');
      toast.error('An unexpected error occurred');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 pt-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <div className="max-w-md w-full">
        <div className="bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-2xl p-8 shadow-[0_0_25px_rgba(107,159,255,0.1)]">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-accent-gradient mb-4 block">
              Campus Connect
            </Link>
            <h2 className="text-2xl font-semibold text-textPrimary mb-2">
              Join the Community
            </h2>
            <p className="text-textMuted">
              Create your account and start connecting
            </p>
          </div>

          {/* Custom Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        index <= currentStep ? 'text-blue-500' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                      placeholder="your.email@chitkara.edu.in"
                      required
                    />
                  </div>
                  <p className="text-textMuted text-sm mt-1">Only @chitkara.edu.in email addresses are allowed</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-textPrimary font-medium mb-2" htmlFor="age">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="16"
                        max="30"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                        placeholder="18"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-textPrimary font-medium mb-2" htmlFor="year">
                      Year
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300 appearance-none"
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="5th Year">5th Year</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="branch">
                    Branch
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300 appearance-none"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics and Communication">Electronics and Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/3 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-75 bottom-6 transform -translate-y-1/2 text-textMuted hover:text-primary transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.level === 'weak' ? 'bg-red-500 w-1/3' :
                              passwordStrength.level === 'medium' ? 'bg-yellow-500 w-2/3' :
                              'bg-green-500 w-full'
                            }`}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.level === 'weak' ? 'text-red-400' :
                          passwordStrength.level === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                        </span>
                      </div>
                      <div className="text-xs text-textMuted">
                        Password must be at least 8 characters with uppercase, lowercase, number, and special character
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <CheckCircle className={`absolute left-3.5 top-1/3 transform -translate-y-1/2 w-5 h-5 ${!passwordMatch ? 'text-red-400' : 'text-textMuted'}`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 transition-all duration-300 ${
                        !passwordMatch ? 'border-red-500/50 focus:ring-red-500/70 focus:border-red-500/70' : 'border-borderSubtle focus:ring-primary/70 focus:border-primary/70'
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-75 bottom-6 transform -translate-y-1/2 text-textMuted hover:text-primary transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordMatch && (
                    <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="photo">
                    Profile Photo (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex items-center justify-center w-full p-4 bg-white/5 border border-borderSubtle border-dashed rounded-xl cursor-pointer hover:border-primary/70 transition-all duration-300 relative overflow-hidden"
                    >
                      {photoPreview ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            loading="lazy"
                            className="w-16 h-16 object-cover rounded-full border-2 border-primary/50 mb-2"
                          />
                          <p className="text-textMuted text-sm">Click to change photo</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-textMuted mx-auto mb-2" />
                          <p className="text-textMuted text-sm">Click to upload profile photo</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-textPrimary font-medium mb-2" htmlFor="otp">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-borderSubtle rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all duration-300"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                    />
                  </div>
                  <p className="text-textMuted text-sm mt-1">
                    Check your email for the verification code
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                Previous
              </button>
            )}

            {currentStep === 0 && (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={loading}
                className="ml-auto px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {currentStep === 1 && (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Verify & Complete
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-textMuted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-secondary transition-colors duration-300 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
export default Signup;
