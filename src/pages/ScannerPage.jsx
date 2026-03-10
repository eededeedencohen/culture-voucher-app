import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { voucherAPI } from '../services/api';
import { useAudio } from '../hooks/useAudio';
import { useVibrate } from '../hooks/useVibrate';
import Button from '../components/Button';
import Card from '../components/Card';
import { ScanLine, CheckCircle, XCircle, RotateCcw, Zap, History, Sparkles, User, FileText } from 'lucide-react';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const scannerRef = useRef(null);
  const navigate = useNavigate();
  const { playSuccess, playError, playScan } = useAudio();
  const { scanVibrate, successVibrate, errorVibrate, redeemVibrate } = useVibrate();

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
          scanVibrate();
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
      errorVibrate();
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
      successVibrate();
    } catch (err) {
      setError(err.response?.data?.message || 'ברקוד לא תקין');
      playError();
      errorVibrate();
    }
  };

  const handleRedeem = async () => {
    if (!scanResult?.voucherId) return;
    setRedeeming(true);
    try {
      await voucherAPI.redeem(scanResult.voucherId);
      setRedeemed(true);
      playSuccess();
      redeemVibrate();
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה במימוש');
      playError();
      errorVibrate();
    } finally {
      setRedeeming(false);
    }
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  const cornerStyle = (position) => {
    const base = {
      position: 'absolute',
      width: '36px',
      height: '36px',
    };
    const borderWidth = '3.5px';
    const color = 'var(--primary-light)';
    const radius = '6px';

    switch (position) {
      case 'topRight':
        return { ...base, top: -2, right: -2, borderTop: `${borderWidth} solid ${color}`, borderRight: `${borderWidth} solid ${color}`, borderRadius: `0 ${radius} 0 0` };
      case 'topLeft':
        return { ...base, top: -2, left: -2, borderTop: `${borderWidth} solid ${color}`, borderLeft: `${borderWidth} solid ${color}`, borderRadius: `${radius} 0 0 0` };
      case 'bottomRight':
        return { ...base, bottom: -2, right: -2, borderBottom: `${borderWidth} solid ${color}`, borderRight: `${borderWidth} solid ${color}`, borderRadius: `0 0 ${radius} 0` };
      case 'bottomLeft':
        return { ...base, bottom: -2, left: -2, borderBottom: `${borderWidth} solid ${color}`, borderLeft: `${borderWidth} solid ${color}`, borderRadius: `0 0 0 ${radius}` };
      default:
        return base;
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
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary-ultra-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(108, 99, 255, 0.1)',
        }}>
          <ScanLine size={24} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.2 }}>סריקת שובר</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>סרוק ברקוד למימוש שובר</p>
        </div>
      </div>

      {/* Scanner View */}
      {!scanResult && !redeemed && (
        <div style={{ animation: 'slideUp 0.5s ease' }}>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '20px',
            background: '#000',
            minHeight: '320px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(108, 99, 255, 0.15)',
          }}>
            <div id="scanner-container" style={{ width: '100%' }} />

            {!scanning && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(108, 99, 255, 0.06) 0%, rgba(15, 14, 23, 0.95) 70%)',
              }}>
                <div style={{
                  width: '130px', height: '130px',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid rgba(108, 99, 255, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'breathe 3s ease-in-out infinite',
                  marginBottom: '24px',
                  position: 'relative',
                  background: 'rgba(108, 99, 255, 0.04)',
                }}>
                  {/* Corner accents on idle state */}
                  <div style={{ position: 'absolute', top: -1, right: -1, width: '24px', height: '24px', borderTop: '3px solid var(--primary)', borderRight: '3px solid var(--primary)', borderRadius: '0 var(--radius-xs) 0 0' }} />
                  <div style={{ position: 'absolute', top: -1, left: -1, width: '24px', height: '24px', borderTop: '3px solid var(--primary)', borderLeft: '3px solid var(--primary)', borderRadius: 'var(--radius-xs) 0 0 0' }} />
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: '24px', height: '24px', borderBottom: '3px solid var(--primary)', borderRight: '3px solid var(--primary)', borderRadius: '0 0 var(--radius-xs) 0' }} />
                  <div style={{ position: 'absolute', bottom: -1, left: -1, width: '24px', height: '24px', borderBottom: '3px solid var(--primary)', borderLeft: '3px solid var(--primary)', borderRadius: '0 0 0 var(--radius-xs)' }} />
                  <ScanLine size={48} color="var(--primary)" style={{ animation: 'float 3s ease-in-out infinite' }} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                  לחץ להתחיל סריקה
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>
                  כוון את המצלמה לברקוד השובר
                </p>
              </div>
            )}

            {scanning && (
              <>
                <div style={{
                  position: 'absolute', inset: '12%',
                  border: '2px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}>
                  <div style={cornerStyle('topRight')} />
                  <div style={cornerStyle('topLeft')} />
                  <div style={cornerStyle('bottomRight')} />
                  <div style={cornerStyle('bottomLeft')} />

                  <div style={{
                    position: 'absolute',
                    left: '5%', right: '5%',
                    height: '2.5px',
                    background: 'var(--gradient-primary)',
                    boxShadow: '0 0 20px rgba(108, 99, 255, 0.9), 0 0 40px rgba(108, 99, 255, 0.4)',
                    borderRadius: 'var(--radius-full)',
                    animation: 'scanLine 2s ease-in-out infinite',
                  }} />
                </div>

                {/* Scanning indicator pill */}
                <div style={{
                  position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(10, 10, 26, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius-full)',
                  padding: '10px 20px',
                  zIndex: 10,
                  border: '1px solid rgba(108, 99, 255, 0.25)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                  animation: 'fadeIn 0.5s ease',
                }}>
                  <div style={{
                    width: '8px', height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary)',
                    animation: 'pulseSoft 1.2s infinite',
                  }} />
                  <span style={{ fontSize: '13px', color: 'var(--primary-light)', fontWeight: 600 }}>סורק...</span>
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
            <div style={{
              marginTop: '16px',
              animation: 'slideUp 0.3s ease',
            }}>
              <Card style={{
                background: 'var(--danger-light)',
                border: '1px solid rgba(255, 90, 95, 0.25)',
                boxShadow: 'var(--shadow-glow-danger)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 90, 95, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <XCircle size={20} color="var(--danger)" />
                  </div>
                  <p style={{ color: 'var(--danger)', fontSize: '14px', fontWeight: 600 }}>{error}</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Scan Result */}
      {scanResult && !redeemed && (
        <div style={{ animation: 'slideUp 0.5s var(--transition-spring)' }}>
          <Card glow style={{
            textAlign: 'center',
            padding: '36px 24px',
            border: '1px solid rgba(0, 196, 140, 0.25)',
            boxShadow: 'var(--shadow-glow-success)',
          }}>
            {/* Success icon */}
            <div style={{
              width: '72px', height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'successPop 0.6s ease',
            }}>
              <CheckCircle size={36} color="var(--success)" />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>שובר תקין!</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>פרטי השובר אומתו בהצלחה</p>

            {/* Amount display */}
            <div style={{
              background: 'var(--primary-ultra-light)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              margin: '0 0 24px',
              border: '1px solid rgba(108, 99, 255, 0.12)',
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>סכום השובר</p>
              <p style={{
                fontSize: '52px', fontWeight: 900, lineHeight: 1,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'fadeInScale 0.5s ease 0.2s both',
              }}>
                ₪{scanResult.amount}
              </p>
            </div>

            {/* Details section */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '10px',
              textAlign: 'right',
            }}>
              {scanResult.description && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(108, 99, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={16} color="var(--primary)" />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {scanResult.description}
                  </p>
                </div>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(0, 196, 140, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={16} color="var(--success)" />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  סטודנט: {scanResult.studentName}
                </p>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', animation: 'fadeIn 0.5s ease 0.3s both' }}>
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
        <div style={{ animation: 'slideUp 0.5s var(--transition-spring)', textAlign: 'center' }}>
          <Card style={{
            padding: '44px 24px',
            background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.08) 0%, rgba(0, 210, 255, 0.08) 100%)',
            border: '1px solid rgba(0, 196, 140, 0.2)',
            boxShadow: 'var(--shadow-glow-success)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative background glow */}
            <div style={{
              position: 'absolute',
              top: '-40%', left: '50%', transform: 'translateX(-50%)',
              width: '200px', height: '200px',
              borderRadius: 'var(--radius-full)',
              background: 'radial-gradient(circle, rgba(0, 196, 140, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              width: '88px', height: '88px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'successPop 0.6s ease',
              boxShadow: '0 8px 32px rgba(0, 196, 140, 0.3)',
              position: 'relative',
            }}>
              <CheckCircle size={44} color="#fff" />
            </div>

            <div style={{ animation: 'fadeIn 0.5s ease 0.3s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={20} color="var(--success)" />
                <h2 style={{ fontSize: '26px', fontWeight: 900 }}>
                  מומש בהצלחה!
                </h2>
                <Sparkles size={20} color="var(--success)" />
              </div>

              <div style={{
                background: 'rgba(0, 196, 140, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                margin: '20px 0',
                border: '1px solid rgba(0, 196, 140, 0.12)',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>סכום שמומש</p>
                <p style={{
                  fontSize: '44px', fontWeight: 900, lineHeight: 1,
                  background: 'var(--gradient-success)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'fadeInScale 0.5s ease 0.5s both',
                }}>
                  ₪{scanResult?.amount}
                </p>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                השובר מומש ונרשם במערכת
              </p>
            </div>
          </Card>

          <div style={{
            display: 'flex', gap: '12px', marginTop: '20px',
            animation: 'fadeIn 0.5s ease 0.5s both',
          }}>
            <Button fullWidth onClick={() => navigate('/history')}>
              <History size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              היסטוריית מימושים
            </Button>
            <Button fullWidth variant="ghost" onClick={() => { setScanResult(null); setRedeemed(false); setError(''); }}>
              <RotateCcw size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              סרוק שובר נוסף
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
