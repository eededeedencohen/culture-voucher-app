import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { voucherAPI } from '../services/api';
import { useAudio } from '../hooks/useAudio';
import { useVibrate } from '../hooks/useVibrate';
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
  const { scanVibrate, redeemVibrate, errorVibrate } = useVibrate();
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
        scanVibrate();
      } else if (lastEvent.type === 'redeemed') {
        setRealtimeStatus('redeemed');
        clearInterval(intervalRef.current);
        playSuccess();
        redeemVibrate();
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
      errorVibrate();
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
      {/* Page Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px',
        animation: 'fadeIn 0.4s ease both',
      }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: 'rgba(108, 99, 255, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <QrCode size={22} color="var(--primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900 }}>מימוש שובר</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>צור ברקוד והצג לבית העסק</p>
        </div>
      </div>

      {/* REDEEMED - Success Screen */}
      {realtimeStatus === 'redeemed' ? (
        <div style={{ animation: 'slideUp 0.5s ease both', textAlign: 'center' }}>
          <Card style={{
            padding: '48px 24px',
            background: 'linear-gradient(135deg, rgba(0, 196, 140, 0.08) 0%, rgba(0, 210, 255, 0.06) 100%)',
            border: '1px solid rgba(0, 196, 140, 0.2)',
            animation: 'slideUp 0.5s ease both',
          }}>
            <div style={{
              width: '88px', height: '88px', borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'successPop 0.6s ease both',
              boxShadow: '0 8px 32px rgba(0, 196, 140, 0.3)',
            }}>
              <CheckCircle size={42} color="#fff" />
            </div>
            <h2 style={{
              fontSize: '22px', fontWeight: 900, marginBottom: '8px',
              animation: 'fadeIn 0.5s ease 0.3s both',
            }}>
              השובר מומש בהצלחה!
            </h2>
            <p style={{
              fontSize: '42px', fontWeight: 900, lineHeight: 1.1,
              background: 'var(--gradient-success)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              margin: '20px 0',
              animation: 'fadeInScale 0.5s ease 0.4s both',
            }}>
              ₪{barcodeData?.amount}
            </p>
            <p style={{
              color: 'var(--text-muted)', fontSize: '14px',
              animation: 'fadeIn 0.5s ease 0.5s both',
            }}>
              בית העסק אישר את המימוש
            </p>
          </Card>
          <div style={{ animation: 'slideUp 0.4s ease 0.3s both' }}>
            <Button fullWidth onClick={() => {
              setBarcodeData(null); setRealtimeStatus(null);
              voucherAPI.getAll().then(({ data }) => {
                setVouchers(data.filter(v => v.status === 'assigned'));
              });
            }} style={{ marginTop: '24px' }}>
              חזרה לשוברים
            </Button>
          </div>
        </div>
      ) : !barcodeData ? (
        <>
          {vouchers.length > 0 ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '16px',
                animation: 'slideUp 0.35s ease both',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)', animation: 'pulseSoft 1.5s ease infinite',
                }} />
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  בחר שובר למימוש
                </p>
              </div>
              {vouchers.map((v, i) => (
                <div key={v._id} style={{ animation: `slideUp 0.35s ease ${0.05 + i * 0.05}s both` }}>
                  <Card
                    onClick={() => setSelectedVoucher(v._id)}
                    glow={selectedVoucher === v._id}
                    style={{
                      marginBottom: '12px',
                      padding: '16px 18px',
                      border: selectedVoucher === v._id
                        ? '2px solid var(--primary)'
                        : '1px solid rgba(108, 99, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'var(--transition-base)',
                      background: selectedVoucher === v._id
                        ? 'linear-gradient(135deg, rgba(108, 99, 255, 0.06) 0%, rgba(0, 210, 255, 0.04) 100%)'
                        : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: selectedVoucher === v._id
                            ? 'rgba(108, 99, 255, 0.15)'
                            : 'rgba(108, 99, 255, 0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'var(--transition-base)',
                        }}>
                          <QrCode size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '15px' }}>{v.description || v.code}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{v.code}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '24px', fontWeight: 900,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>₪{v.amount}</span>
                    </div>
                  </Card>
                </div>
              ))}

              <div style={{ animation: `slideUp 0.35s ease ${0.05 + vouchers.length * 0.05}s both` }}>
                <Button fullWidth onClick={handleGenerate} disabled={loading || !selectedVoucher}
                  style={{ marginTop: '20px' }}>
                  {loading ? 'יוצר ברקוד...' : '✨ צור ברקוד למימוש'}
                </Button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)',
              animation: 'fadeIn 0.5s ease both',
            }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: 'var(--radius-full)',
                background: 'rgba(108, 99, 255, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', animation: 'float 3s ease-in-out infinite',
              }}>
                <QrCode size={42} color="var(--primary)" style={{ opacity: 0.3 }} />
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                אין שוברים זמינים למימוש
              </p>
              <p style={{ fontSize: '14px' }}>שוברים שיוקצו לך יופיעו כאן</p>
            </div>
          )}

          {error && (
            <div style={{
              animation: 'slideUp 0.3s ease both',
              marginTop: '16px',
            }}>
              <p style={{
                color: 'var(--danger)', fontSize: '13px', textAlign: 'center',
                padding: '12px 16px',
                background: 'var(--danger-light)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 90, 95, 0.15)',
                fontWeight: 600,
              }}>{error}</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ animation: 'slideUp 0.4s ease both' }}>
          {/* Scanned notification */}
          {realtimeStatus === 'scanned' && (
            <Card style={{
              marginBottom: '16px',
              padding: '14px 18px',
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(108, 99, 255, 0.06) 100%)',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              animation: 'fadeInScale 0.4s ease both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'rgba(0, 210, 255, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulseSoft 1.5s ease infinite',
                }}>
                  <ScanLine size={16} color="var(--accent)" />
                </div>
                <p style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 700 }}>
                  הברקוד נסרק! ממתין לאישור בית העסק...
                </p>
              </div>
            </Card>
          )}

          {/* Timer */}
          <Card glow style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '24px 20px',
            animation: isExpiring ? 'breathe 1.5s ease infinite' : 'slideUp 0.4s ease 0.05s both',
            background: isExpiring
              ? 'linear-gradient(135deg, rgba(255, 90, 95, 0.06) 0%, rgba(255, 150, 50, 0.04) 100%)'
              : 'linear-gradient(135deg, rgba(108, 99, 255, 0.06) 0%, rgba(0, 210, 255, 0.04) 100%)',
            border: isExpiring
              ? '1px solid rgba(255, 90, 95, 0.15)'
              : '1px solid rgba(108, 99, 255, 0.12)',
            transition: 'var(--transition-base)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', marginBottom: '14px',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: isExpiring ? 'var(--danger-light)' : 'rgba(108, 99, 255, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'var(--transition-base)',
              }}>
                {isExpiring
                  ? <AlertTriangle size={16} color="var(--danger)" />
                  : <Clock size={16} color="var(--primary)" />
                }
              </div>
              <span style={{
                fontSize: '13px', fontWeight: 600,
                color: isExpiring ? 'var(--danger)' : 'var(--text-secondary)',
              }}>
                {timeLeft > 0 ? 'זמן נותר' : 'פג תוקף!'}
              </span>
            </div>
            <p style={{
              fontSize: '52px', fontWeight: 900, lineHeight: 1.1,
              background: isExpiring
                ? 'linear-gradient(135deg, var(--danger), #ff9632)'
                : timeLeft > 0
                  ? 'var(--gradient-primary)'
                  : 'linear-gradient(135deg, var(--danger), #ff9632)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '2px',
            }}>
              {formatTime(timeLeft)}
            </p>
            <div style={{
              height: '6px', background: 'var(--bg-overlay)',
              borderRadius: 'var(--radius-full)', marginTop: '18px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 'var(--radius-full)',
                width: `${timePercent}%`,
                background: isExpiring ? 'linear-gradient(90deg, var(--danger), #ff9632)' : 'var(--gradient-primary)',
                transition: 'width 1s linear',
                boxShadow: isExpiring
                  ? '0 0 8px rgba(255, 90, 95, 0.4)'
                  : '0 0 8px rgba(108, 99, 255, 0.3)',
              }} />
            </div>
          </Card>

          {/* QR Code */}
          {timeLeft > 0 && (
            <Card style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '36px 24px 28px', background: '#fff',
              position: 'relative', overflow: 'hidden',
              animation: 'slideUp 0.4s ease 0.1s both',
              boxShadow: 'var(--shadow-card), 0 0 40px rgba(108, 99, 255, 0.06)',
            }}>
              {/* Glass overlay top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: 'var(--gradient-primary)', opacity: 0.7,
              }} />
              {/* Scan line */}
              <div style={{
                position: 'absolute', left: '8%', right: '8%',
                height: '2px', background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-glow)',
                animation: 'scanLine 2.5s ease-in-out infinite', zIndex: 1,
                borderRadius: 'var(--radius-full)',
              }} />
              {/* QR container with subtle border */}
              <div style={{
                padding: '12px', borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '2px solid rgba(108, 99, 255, 0.08)',
              }}>
                <QRCodeSVG
                  value={barcodeData.barcode}
                  size={240} level="H" includeMargin
                  fgColor="#1A1932" bgColor="#ffffff"
                />
              </div>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{
                  fontSize: '28px', fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px',
                }}>
                  ₪{barcodeData.amount}
                </p>
                <p style={{
                  fontSize: '12px', color: '#6B6D8A', marginTop: '6px', fontWeight: 500,
                }}>
                  הצג לבית העסק לסריקה
                </p>
              </div>
            </Card>
          )}

          <div style={{ animation: 'slideUp 0.4s ease 0.15s both' }}>
            <Button fullWidth variant="ghost" onClick={() => { setBarcodeData(null); setRealtimeStatus(null); }}
              style={{ marginTop: '24px' }}>
              חזרה
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
