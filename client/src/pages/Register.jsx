import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Code2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (form.username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      addToast({ message: 'Account created! Welcome to CodeInsight.', type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', icon: User, placeholder: 'johndoe', delay: 0.2 },
    { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', delay: 0.3 },
    { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password', icon: Lock, placeholder: '••••••••', delay: 0.4 },
    { name: 'confirmPassword', label: 'Confirm Password', type: showPassword ? 'text' : 'password', icon: Lock, placeholder: '••••••••', delay: 0.5 },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-purple" />
        <div className="orb orb-cyan" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Code2 size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">CodeInsight AI</span>
        </motion.div>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>
          <p className="text-dark-300 text-sm text-center mb-8">Start analyzing your code with AI</p>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: field.delay }}
              >
                <label className="block text-sm font-medium text-dark-200 mb-1.5">{field.label}</label>
                <div className="relative">
                  <field.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={`input-dark pl-10 ${field.name.includes('password') ? 'pr-10' : ''} ${
                      fieldErrors[field.name] ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                    placeholder={field.placeholder}
                    required
                    id={`register-${field.name}`}
                  />
                  {field.name === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>

                {/* Field error */}
                <AnimatePresence>
                  {fieldErrors[field.name] && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {fieldErrors[field.name]}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Password Strength Meter */}
                {field.name === 'password' && form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="strength-meter">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`strength-bar ${passwordStrength >= level ? `active ${strengthClasses[level]}` : ''}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 ${
                      passwordStrength <= 1 ? 'text-red-400' :
                      passwordStrength === 2 ? 'text-yellow-400' :
                      passwordStrength === 3 ? 'text-cyan-400' : 'text-green-400'
                    }`}>
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                id="register-submit"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-dark-300 mt-6"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-accent-purple hover:text-accent-cyan transition-colors font-medium">
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
