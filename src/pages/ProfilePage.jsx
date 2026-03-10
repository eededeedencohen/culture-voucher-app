import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { User, Lock, CheckCircle, XCircle, Eye, EyeOff, AtSign, Shield, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const roleLabels = { admin: 'מנהל', student: 'סטודנט', business: 'בית עסק' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('הסיסמאות לא תואמות');
      return;
    }

    const payload = {};
    if (name && name !== user.name) payload.name = name;
    if (username !== (user.username || '')) payload.username = username;
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError('לא בוצעו שינויים');
      return;
    }

    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile(payload);
      updateUser({ name: data.name, username: data.username });

      setSuccess('הפרופיל עודכן בהצלחה!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (payload.newPassword) {
        setTimeout(() => {
          logout();
        }, 1500);
        setSuccess('הסיסמה שונתה! מתנתק...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בעדכון');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '28px',
        animation: 'fadeIn 0.4s ease both',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(108, 99, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <User size={22} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>פרופיל</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ניהול הפרטים האישיים שלך</p>
        </div>
      </div>

      {/* User Info Card */}
      <Card glow style={{
        marginBottom: '24px',
        textAlign: 'center',
        padding: '32px 24px',
        animation: 'slideUp 0.4s ease both',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(108, 99, 255, 0.04) 100%)',
      }}>
        {/* Decorative top accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--gradient-primary)',
          borderRadius: '12px 12px 0 0',
        }} />
        {/* Decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          width: '78px',
          height: '78px',
          borderRadius: '22px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          fontSize: '30px',
          fontWeight: 800,
          color: '#fff',
          boxShadow: '0 8px 24px rgba(108, 99, 255, 0.35)',
          animation: 'breathe 3s ease-in-out infinite',
          position: 'relative',
        }}>
          {user?.name?.charAt(0)}
        </div>
        <p style={{
          fontWeight: 800,
          fontSize: '20px',
          marginBottom: '4px',
          letterSpacing: '-0.3px',
        }}>
          {user?.name}
        </p>
        {user?.username && (
          <p style={{
            color: 'var(--primary)',
            fontSize: '13px',
            marginBottom: '6px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}>
            <AtSign size={13} />
            {user.username}
          </p>
        )}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '13px',
          marginBottom: '12px',
        }}>
          {user?.email}
        </p>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '12px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(108, 99, 255, 0.08))',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-full)',
          padding: '5px 16px',
          border: '1px solid rgba(108, 99, 255, 0.15)',
        }}>
          <Shield size={12} />
          {roleLabels[user?.role] || user?.role}
        </span>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        {/* Account Details Card */}
        <Card style={{
          marginBottom: '16px',
          animation: 'slideUp 0.4s ease 0.1s both',
          padding: '22px 20px',
          background: 'var(--bg-card)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(108, 99, 255, 0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <User size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>פרטי חשבון</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>עדכן את שמך ושם המשתמש</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input
              icon={User}
              placeholder="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={AtSign}
              placeholder="שם משתמש (להתחברות קלה)"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
            />
            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '-4px',
              paddingRight: '4px',
            }}>
              שם המשתמש ישמש להתחברות במקום אימייל
            </p>
          </div>
        </Card>

        {/* Password Card */}
        <Card style={{
          marginBottom: '20px',
          animation: 'slideUp 0.4s ease 0.18s both',
          padding: '22px 20px',
          background: 'var(--bg-card)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.15), rgba(255, 170, 0, 0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Lock size={18} color="#ffaa00" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>שינוי סיסמה</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>מומלץ לעדכן סיסמה מעת לעת</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Input
                icon={Lock}
                type={showCurrentPw ? 'text' : 'password'}
                placeholder="סיסמה נוכחית"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-base)',
                  borderRadius: '6px',
                }}
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Input
                icon={Lock}
                type={showNewPw ? 'text' : 'password'}
                placeholder="סיסמה חדשה (לפחות 6 תווים)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-base)',
                  borderRadius: '6px',
                }}
              >
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input
              icon={Lock}
              type="password"
              placeholder="אימות סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card style={{
            marginBottom: '16px',
            background: 'linear-gradient(135deg, rgba(255, 90, 95, 0.1), rgba(255, 90, 95, 0.05))',
            border: '1px solid rgba(255, 90, 95, 0.2)',
            animation: 'fadeInScale 0.3s ease',
            padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(255, 90, 95, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <XCircle size={16} color="var(--danger)" />
              </div>
              <p style={{ color: 'var(--danger)', fontSize: '14px', fontWeight: 500 }}>{error}</p>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {success && (
          <Card style={{
            marginBottom: '16px',
            background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.1), rgba(0, 196, 140, 0.05))',
            border: '1px solid rgba(0, 196, 140, 0.2)',
            animation: 'successPop 0.4s ease',
            padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(0, 196, 140, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <CheckCircle size={16} color="var(--success)" />
              </div>
              <p style={{ color: 'var(--success)', fontSize: '14px', fontWeight: 500 }}>{success}</p>
            </div>
          </Card>
        )}

        <Button fullWidth type="submit" disabled={saving} style={{
          animation: 'slideUp 0.4s ease 0.25s both',
        }}>
          {saving ? 'שומר...' : 'שמור שינויים'}
        </Button>
      </form>
    </div>
  );
}
