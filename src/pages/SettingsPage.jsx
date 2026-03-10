import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { Settings, Clock, Building2, DollarSign, Check, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsAPI.get()
      .then(({ data }) => setSettings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update({
        organizationName: settings.organizationName,
        barcodeExpiryMinutes: Number(settings.barcodeExpiryMinutes),
        totalBudget: Number(settings.totalBudget),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: 'rgba(108, 99, 255, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Settings size={22} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900 }}>הגדרות</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>הגדרות מערכת ותצורה</p>
        </div>
      </div>

      <Card style={{
        marginBottom: '14px', animation: 'slideUp 0.35s ease both',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(0, 210, 255, 0.03) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(0, 210, 255, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={16} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>פרטי ארגון</h3>
        </div>
        <Input label="שם הארגון" value={settings?.organizationName || ''} onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })} icon={Building2} />
      </Card>

      <Card style={{
        marginBottom: '14px', animation: 'slideUp 0.35s ease 0.07s both',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(255, 185, 70, 0.03) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'var(--warning-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock size={16} color="var(--warning)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>הגדרות ברקוד</h3>
        </div>
        <Input label="זמן תוקף ברקוד (דקות)" type="number" value={settings?.barcodeExpiryMinutes || 5} onChange={(e) => setSettings({ ...settings, barcodeExpiryMinutes: e.target.value })} icon={Clock} min="1" max="60" />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Shield size={10} /> כמה דקות הברקוד יהיה תקף לאחר יצירתו
        </p>
      </Card>

      <Card style={{
        marginBottom: '24px', animation: 'slideUp 0.35s ease 0.14s both',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(0, 196, 140, 0.03) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'var(--success-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DollarSign size={16} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>תקציב</h3>
        </div>
        <Input label="תקציב כולל (₪)" type="number" value={settings?.totalBudget || 0} onChange={(e) => setSettings({ ...settings, totalBudget: e.target.value })} icon={DollarSign} />
      </Card>

      <div style={{ animation: 'slideUp 0.35s ease 0.2s both' }}>
        <Button fullWidth onClick={handleSave} disabled={saving} variant={saved ? 'success' : 'primary'}>
          {saved ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Check size={18} /> נשמר בהצלחה!</span> : (saving ? 'שומר...' : 'שמור הגדרות')}
        </Button>
      </div>
    </div>
  );
}
