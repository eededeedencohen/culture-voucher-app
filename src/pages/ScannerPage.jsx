import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { voucherAPI } from '../services/api';
import { useAudio } from '../hooks/useAudio';
import Button from '../components/Button';
import Card from '../components/Card';
import { ScanLine, CheckCircle, XCircle, RotateCcw, Zap } from 'lucide-react';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const scannerRef = useRef(null);
  const { playSuccess, playError, playScan } = useAudio();

  const startScanner = async () => {
    setError('');
    setScanResult(null);
    setRedeemed(false);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode('scanner-container');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          playScan();
          await scanner.stop();
          scannerRef.current = null;
          setScanning(false);
          handleScan(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setError('לא ניתן לגשת למצלמה. בדוק הרשאות.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (barcode) => {
    try {
      const { data } = await voucherAPI.scan(barcode);
      setScanResult(data);
      playSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'ברקוד לא תקין');
      playError();
    }
  };

  const handleRedeem = async () => {
    if (!scanResult?.voucherId) return;
    setRedeeming(true);
    try {
      await voucherAPI.redeem(scanResult.voucherId);
      setRedeemed(true);
      playSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה במימוש');
      playError();
    } finally {
      setRedeeming(false);
    }
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <ScanLine size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>סריקת שובר</h1>
      </div>

      {/* Scanner View */}
      {!scanResult && !redeemed && (
        <>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '20px',
            background: '#000',
            minHeight: '320px',
          }}>
            <div id="scanner-container" style={{ width: '100%' }} />

            {!scanning && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15, 14, 23, 0.9)',
              }}>
                <div style={{
                  width: '120px', height: '120px',
                  border: '3px solid var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'glow 2s ease-in-out infinite',
                  marginBottom: '20px',
                }}>
                  <ScanLine size={48} color="var(--primary)" />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  לחץ להתחיל סריקה
                </p>
              </div>
            )}

            {scanning && (
              <>
                {/* Scanning overlay corners */}
                <div style={{
                  position: 'absolute', inset: '15%',
                  border: '2px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}>
                  {/* Top-left corner */}
                  <div style={{ position: 'absolute', top: -2, right: -2, width: '30px', height: '30px', borderTop: '3px solid var(--primary)', borderRight: '3px solid var(--primary)', borderRadius: '0 var(--radius-sm) 0 0' }} />
                  <div style={{ position: 'absolute', top: -2, left: -2, width: '30px', height: '30px', borderTop: '3px solid var(--primary)', borderLeft: '3px solid var(--primary)', borderRadius: 'var(--radius-sm) 0 0 0' }} />
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: '30px', height: '30px', borderBottom: '3px solid var(--primary)', borderRight: '3px solid var(--primary)', borderRadius: '0 0 var(--radius-sm) 0' }} />
                  <div style={{ position: 'absolute', bottom: -2, left: -2, width: '30px', height: '30px', borderBottom: '3px solid var(--primary)', borderLeft: '3px solid var(--primary)', borderRadius: '0 0 0 var(--radius-sm)' }} />

                  {/* Animated scan line */}
                  <div style={{
                    position: 'absolute',
                    left: '5%', right: '5%',
                    height: '2px',
                    background: 'var(--gradient-primary)',
                    boxShadow: '0 0 15px rgba(108, 99, 255, 0.8)',
                    animation: 'scanLine 2s ease-in-out infinite',
                  }} />
                </div>

                {/* Scanning pulse */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(0,0,0,0.7)', borderRadius: '20px', padding: '8px 16px',
                  zIndex: 10,
                }}>
                  <Zap size={14} color="var(--primary)" style={{ animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: '12px', color: 'var(--primary)' }}>סורק...</span>
                </div>
              </>
            )}
          </div>

          {!scanning ? (
            <Button fullWidth onClick={startScanner}>
              <ScanLine size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              התחל סריקה
            </Button>
          ) : (
            <Button fullWidth variant="ghost" onClick={stopScanner}>
              עצור סריקה
            </Button>
          )}

          {error && (
            <Card style={{
              marginTop: '16px',
              background: 'rgba(255, 90, 95, 0.1)',
              border: '1px solid rgba(255, 90, 95, 0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <XCircle size={20} color="var(--danger)" />
                <p style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Scan Result */}
      {scanResult && !redeemed && (
        <div style={{ animation: 'slideUp 0.4s ease' }}>
          <Card glow style={{
            textAlign: 'center',
            padding: '32px 20px',
            border: '1px solid rgba(0, 196, 140, 0.3)',
          }}>
            <CheckCircle size={56} color="var(--success)" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>שובר תקין!</h2>

            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              margin: '20px 0',
            }}>
              <p style={{
                fontSize: '48px', fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ₪{scanResult.amount}
              </p>
            </div>

            {scanResult.description && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {scanResult.description}
              </p>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              סטודנט: {scanResult.studentName}
            </p>
          </Card>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <Button fullWidth variant="success" onClick={handleRedeem} disabled={redeeming}>
              {redeeming ? 'ממש...' : '✅ אשר מימוש'}
            </Button>
            <Button fullWidth variant="ghost" onClick={() => { setScanResult(null); setError(''); }}>
              ביטול
            </Button>
          </div>
        </div>
      )}

      {/* Redeemed Success */}
      {redeemed && (
        <div style={{ animation: 'slideUp 0.4s ease', textAlign: 'center' }}>
          <Card style={{
            padding: '40px 20px',
            background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 196, 140, 0.3)',
          }}>
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'var(--gradient-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'pulse 1s ease 2',
            }}>
              <CheckCircle size={40} color="#fff" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
              מומש בהצלחה!
            </h2>
            <p style={{
              fontSize: '36px', fontWeight: 900,
              background: 'var(--gradient-success)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '16px 0',
            }}>
              ₪{scanResult?.amount}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              השובר מומש בהצלחה
            </p>
          </Card>

          <Button fullWidth onClick={() => { setScanResult(null); setRedeemed(false); setError(''); }}
            style={{ marginTop: '20px' }}>
            <RotateCcw size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
            סרוק שובר נוסף
          </Button>
        </div>
      )}
    </div>
  );
}
