import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Mail, Lock, User, Phone, Building2, GraduationCap, AtSign } from 'lucide-react';

const roleRedirects = {
  admin: '/dashboard',
  student: '/my-vouchers',
  business: '/scanner',
};

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', role: 'student',
    phone: '', businessName: '', studentId: '', identifier: '',
  });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let data;
      if (isRegister) {
        data = await register(form);
      } else {
        data = await login(form.identifier, form.password);
      }
      navigate(roleRedirects[data.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהתחברות');
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '40px 24px',
      background: `radial-gradient(circle at 50% 0%, rgba(108, 99, 255, 0.2) 0%, transparent 50%),
                    var(--bg-primary)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-60px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108, 99, 255, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 196, 140, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* Logo & Title Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '44px',
        animation: 'fadeInScale 0.5s ease both',
        position: 'relative',
      }}>
        <div style={{
          width: '86px',
          height: '86px',
          borderRadius: '26px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 22px',
          boxShadow: '0 12px 36px rgba(108, 99, 255, 0.4)',
          fontSize: '38px',
          animation: 'breathe 3s ease-in-out infinite',
          position: 'relative',
        }}>
          🎫
          {/* Subtle ring */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '30px',
            border: '2px solid rgba(108, 99, 255, 0.15)',
            animation: 'pulseSoft 3s ease-in-out infinite',
          }} />
        </div>
        <h1 style={{
          fontSize: '34px',
          fontWeight: 900,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
          marginBottom: '10px',
        }}>
          שובר
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '14px',
          lineHeight: 1.6,
        }}>
          מערכת שוברים דיגיטליים - תרבות לכל
        </p>
      </div>

      {/* Form Container */}
      <div style={{
        animation: 'slideUp 0.5s ease 0.15s both',
        position: 'relative',
      }}>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <Input
                label="שם מלא"
                value={form.name}
                onChange={update('name')}
                placeholder="הכנס שם מלא"
                icon={User}
                required
              />
              <Input
                label="שם משתמש"
                value={form.username}
                onChange={update('username')}
                placeholder="בחר שם משתמש (לדוגמה: musa123)"
                icon={AtSign}
                required
              />
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '10px',
                }}>
                  סוג משתמש
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { value: 'student', label: 'סטודנט', icon: '🎓' },
                    { value: 'business', label: 'בית עסק', icon: '🏪' },
                    { value: 'admin', label: 'מנהל', icon: '👑' },
                  ].map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, role: value })}
                      style={{
                        flex: 1,
                        padding: '14px 8px',
                        borderRadius: 'var(--radius-md)',
                        background: form.role === value
                          ? 'var(--gradient-primary)'
                          : 'var(--bg-input)',
                        color: form.role === value ? '#fff' : 'var(--text-secondary)',
                        border: `1px solid ${form.role === value ? 'transparent' : 'rgba(108,99,255,0.12)'}`,
                        fontSize: '13px',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: form.role === value
                          ? '0 4px 16px rgba(108, 99, 255, 0.35)'
                          : 'none',
                        transform: form.role === value ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <span style={{ display: 'block', fontSize: '20px', marginBottom: '4px' }}>{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {form.role === 'student' && (
                <Input
                  label="מספר סטודנט"
                  value={form.studentId}
                  onChange={update('studentId')}
                  placeholder="מספר סטודנט"
                  icon={GraduationCap}
                />
              )}
              {form.role === 'business' && (
                <Input
                  label="שם בית העסק"
                  value={form.businessName}
                  onChange={update('businessName')}
                  placeholder="שם בית העסק"
                  icon={Building2}
                />
              )}
              <Input
                label="טלפון"
                value={form.phone}
                onChange={update('phone')}
                placeholder="מספר טלפון"
                icon={Phone}
                type="tel"
              />
              <Input
                label="אימייל"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="הכנס אימייל"
                icon={Mail}
                required
              />
            </>
          )}

          {!isRegister && (
            <Input
              label="שם משתמש או אימייל"
              value={form.identifier}
              onChange={update('identifier')}
              placeholder="הכנס שם משתמש או אימייל"
              icon={User}
              required
            />
          )}

          <Input
            label="סיסמה"
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="הכנס סיסמה"
            icon={Lock}
            required
          />

          {error && (
            <div style={{
              color: 'var(--danger)',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(255, 90, 95, 0.1), rgba(255, 90, 95, 0.05))',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 90, 95, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 500,
              animation: 'fadeInScale 0.3s ease',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--danger)',
                flexShrink: 0,
              }} />
              {error}
            </div>
          )}

          <Button fullWidth disabled={loading} style={{
            marginTop: '10px',
            boxShadow: '0 6px 24px rgba(108, 99, 255, 0.3)',
          }}>
            {loading ? '...' : (isRegister ? 'הרשמה' : 'התחברות')}
          </Button>

          {/* Toggle Link */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
          }}>
            <p
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                color: 'var(--primary)',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'var(--transition-base)',
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-block',
                background: 'rgba(108, 99, 255, 0.06)',
                border: '1px solid rgba(108, 99, 255, 0.1)',
              }}
            >
              {isRegister ? 'יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
