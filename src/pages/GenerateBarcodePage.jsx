import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { voucherAPI } from '../services/api';
import { useAudio } from '../hooks/useAudio';
import { useSocket } from '../contexts/SocketContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { QrCode, Clock, AlertTriangle, CheckCircle, ScanLine } from 'lucide-react';

export default function GenerateBarcodePage() {
  const [searchParams] = useSearchParams();
  const voucherId = searchParams.get('id');
  const [barcodeData, setBarcodeData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(voucherId);
  const [realtimeStatus, setRealtimeStatus] = useState(null); // 'scanned' | 'redeemed'
  const { playSuccess, playError, playScan } = useAudio();
  const { lastEvent, clearEvent } = useSocket();
  const intervalRef = useRef(null);

  useEffect(() => {
    voucherAPI.getAll()
      .then(({ data }) => {
        const assignedVouchers = data.filter(v => v.status === 'assigned');
        setVouchers(assignedVouchers);
        if (!selectedVoucher && assignedVouchers.length > 0) {
          setSelectedVoucher(assignedVouchers[0]._id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Listen for real-time events from business
  useEffect(() => {
    if (!lastEvent || !barcodeData) return;

    if (lastEvent.voucherId === barcodeData.voucherId) {
      if (lastEvent.type === 'scanned') {
        setRealtimeStatus('scanned');
        playScan();
      } else if (lastEvent.type === 'redeemed') {
        setRealtimeStatus('redeemed');
        clearInterval(intervalRef.current);
        playSuccess();
      }
      clearEvent();
    }
  }, [lastEvent]);

  useEffect(() => {
    if (timeLeft <= 0 && barcodeData && realtimeStatus !== 'redeemed') {
      setBarcodeData(null);
      setRealtimeStatus(null);
      playError();
    }
  }, [timeLeft]);

  const handleGenerate = async () => {
    if (!selectedVoucher) return;
    setLoading(true);
    setError('');
    setRealtimeStatus(null);
    try {
      const { data } = await voucherAPI.generateBarcode(selectedVoucher);
      setBarcodeData(data);
      playSuccess();

      const expiry = new Date(data.expiresAt).getTime();
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) clearInterval(intervalRef.current);
      }, 1000);
      setTimeLeft(data.expiryMinutes * 60);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ביצירת ברקוד');
      playError();
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timePercent = barcodeData ? (timeLeft / (barcodeData.expiryMinutes * 60)) * 100 : 0;
  const isExpiring = timeLeft > 0 && timeLeft < 30;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <QrCode size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>מימוש שובר</h1>
      </div>

      {/* REDEEMED - Success Screen */}
      {realtimeStatus === 'redeemed' ? (
        <div style={{ animation: 'slideUp 0.4s ease', textAlign: 'center' }}>
          <Card style={{
            padding: '40px 20px',
            background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 196, 140, 0.3)',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--gradient-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', animation: 'pulse 1s ease 2',
            }}>
              <CheckCircle size={40} color="#fff" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
              השובר מומש בהצלחה!
            </h2>
            <p style={{
              fontSize: '36px', fontWeight: 900,
              background: 'var(--gradient-success)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              margin: '16px 0',
            }}>
              ₪{barcodeData?.amount}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              בית העסק אישר את המימוש
            </p>
          </Card>
          <Button fullWidth onClick={() => {
            setBarcodeData(null); setRealtimeStatus(null);
            voucherAPI.getAll().then(({ data }) => {
              setVouchers(data.filter(v => v.status === 'assigned'));
            });
          }} style={{ marginTop: '20px' }}>
            חזרה לשוברים
          </Button>
        </div>
      ) : !barcodeData ? (
        <>
          {vouchers.length > 0 ? (
            <>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                בחר שובר למימוש:
              </p>
              {vouchers.map((v) => (
                <Card
                  key={v._id}
                  onClick={() => setSelectedVoucher(v._id)}
                  glow={selectedVoucher === v._id}
                  style={{
                    marginBottom: '12px',
                    border: selectedVoucher === v._id
                      ? '2px solid var(--primary)'
                      : '1px solid rgba(108, 99, 255, 0.1)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{v.description || v.code}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.code}</p>
                    </div>
                    <span style={{
                      fontSize: '24px', fontWeight: 900,
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>₪{v.amount}</span>
                  </div>
                </Card>
              ))}

              <Button fullWidth onClick={handleGenerate} disabled={loading || !selectedVoucher}
                style={{ marginTop: '16px' }}>
                {loading ? 'יוצר ברקוד...' : '✨ צור ברקוד למימוש'}
              </Button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
              <p>אין שוברים זמינים למימוש</p>
            </div>
          )}

          {error && (
            <p style={{
              color: 'var(--danger)', fontSize: '13px', textAlign: 'center',
              marginTop: '16px', padding: '10px',
              background: 'rgba(255, 90, 95, 0.1)', borderRadius: 'var(--radius-sm)',
            }}>{error}</p>
          )}
        </>
      ) : (
        <div style={{ animation: 'slideUp 0.4s ease' }}>
          {/* Scanned notification */}
          {realtimeStatus === 'scanned' && (
            <Card style={{
              marginBottom: '16px',
              background: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              animation: 'pulse 1s ease 2',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <ScanLine size={20} color="var(--accent)" />
                <p style={{ color: 'var(--accent)', fontSize: '15px', fontWeight: 700 }}>
                  הברקוד נסרק! ממתין לאישור בית העסק...
                </p>
              </div>
            </Card>
          )}

          {/* Timer */}
          <Card glow style={{
            textAlign: 'center',
            marginBottom: '20px',
            animation: isExpiring ? 'pulse 1s infinite' : 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', marginBottom: '12px',
            }}>
              {isExpiring ? <AlertTriangle size={20} color="var(--danger)" /> : <Clock size={20} color="var(--primary)" />}
              <span style={{ fontSize: '14px', color: isExpiring ? 'var(--danger)' : 'var(--text-secondary)' }}>
                {timeLeft > 0 ? 'זמן נותר' : 'פג תוקף!'}
              </span>
            </div>
            <p style={{
              fontSize: '48px', fontWeight: 900,
              color: isExpiring ? 'var(--danger)' : timeLeft > 0 ? 'var(--text-primary)' : 'var(--danger)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatTime(timeLeft)}
            </p>
            <div style={{
              height: '6px', background: 'var(--bg-input)',
              borderRadius: '3px', marginTop: '16px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                width: `${timePercent}%`,
                background: isExpiring ? 'var(--gradient-danger)' : 'var(--gradient-primary)',
                transition: 'width 1s linear',
              }} />
            </div>
          </Card>

          {/* QR Code */}
          {timeLeft > 0 && (
            <Card style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '32px 20px', background: '#fff',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: '10%', right: '10%',
                height: '2px', background: 'var(--gradient-primary)',
                boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
                animation: 'scanLine 2s ease-in-out infinite', zIndex: 1,
              }} />
              <QRCodeSVG
                value={barcodeData.barcode}
                size={240} level="H" includeMargin
                fgColor="#1A1932" bgColor="#ffffff"
              />
              <p style={{
                marginTop: '16px', fontSize: '16px', fontWeight: 700,
                color: '#1A1932', letterSpacing: '2px',
              }}>
                ₪{barcodeData.amount}
              </p>
              <p style={{ fontSize: '11px', color: '#6B6D8A', marginTop: '4px' }}>
                הצג לבית העסק לסריקה
              </p>
            </Card>
          )}

          <Button fullWidth variant="ghost" onClick={() => { setBarcodeData(null); setRealtimeStatus(null); }}
            style={{ marginTop: '20px' }}>
            חזרה
          </Button>
        </div>
      )}
    </div>
  );
}
