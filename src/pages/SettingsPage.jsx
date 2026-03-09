import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { Settings, Clock, Building2, DollarSign, Check } from 'lucide-react';

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
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Settings size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>הגדרות</h1>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Building2 size={18} color="var(--accent)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>פרטי ארגון</h3>
        </div>
        <Input
          label="שם הארגון"
          value={settings?.organizationName || ''}
          onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
          icon={Building2}
        />
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Clock size={18} color="var(--warning)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>הגדרות ברקוד</h3>
        </div>
        <Input
          label="זמן תוקף ברקוד (דקות)"
          type="number"
          value={settings?.barcodeExpiryMinutes || 5}
          onChange={(e) => setSettings({ ...settings, barcodeExpiryMinutes: e.target.value })}
          icon={Clock}
          min="1"
          max="60"
        />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px' }}>
          כמה דקות הברקוד יהיה תקף לאחר יצירתו
        </p>
      </Card>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <DollarSign size={18} color="var(--success)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>תקציב</h3>
        </div>
        <Input
          label="תקציב כולל (₪)"
          type="number"
          value={settings?.totalBudget || 0}
          onChange={(e) => setSettings({ ...settings, totalBudget: e.target.value })}
          icon={DollarSign}
        />
      </Card>

      <Button fullWidth onClick={handleSave} disabled={saving}
        variant={saved ? 'success' : 'primary'}>
        {saved ? <><Check size={18} /> נשמר בהצלחה!</> : (saving ? 'שומר...' : 'שמור הגדרות')}
      </Button>
    </div>
  );
}
