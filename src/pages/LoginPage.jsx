import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Mail, Lock, User, Phone, Building2, GraduationCap } from 'lucide-react';

const roleRedirects = {
  admin: '/dashboard',
  student: '/my-vouchers',
  business: '/scanner',
};

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    phone: '', businessName: '', studentId: '',
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
        data = await login(form.email, form.password);
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
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: 'var(--shadow-glow)',
          fontSize: '36px',
        }}>
          🎫
        </div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 900,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          שובר
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>
          מערכת שוברים דיגיטליים - תרבות לכל
        </p>
      </div>

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
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 500,
                color: 'var(--text-secondary)', marginBottom: '8px',
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
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: form.role === value ? 'var(--primary)' : 'var(--bg-input)',
                      color: form.role === value ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${form.role === value ? 'var(--primary)' : 'rgba(108,99,255,0.15)'}`,
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    {icon} {label}
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
          </>
        )}

        <Input
          label="אימייל"
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder="הכנס אימייל"
          icon={Mail}
          required
        />
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
          <p style={{
            color: 'var(--danger)',
            fontSize: '13px',
            textAlign: 'center',
            marginBottom: '16px',
            padding: '10px',
            background: 'rgba(255, 90, 95, 0.1)',
            borderRadius: 'var(--radius-sm)',
          }}>
            {error}
          </p>
        )}

        <Button fullWidth disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? '...' : (isRegister ? 'הרשמה' : 'התחברות')}
        </Button>

        <p
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          style={{
            textAlign: 'center',
            color: 'var(--primary)',
            marginTop: '20px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {isRegister ? 'יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
        </p>
      </form>
    </div>
  );
}
