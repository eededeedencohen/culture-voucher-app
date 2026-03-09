import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Users, Mail, Phone, GraduationCap } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getStudents()
      .then(({ data }) => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Users size={24} color="var(--primary)" />
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>סטודנטים</h1>
        <span style={{
          background: 'var(--primary)',
          color: '#fff',
          borderRadius: '20px',
          padding: '2px 12px',
          fontSize: '13px',
          fontWeight: 700,
        }}>
          {students.length}
        </span>
      </div>

      {students.map((s, i) => (
        <Card key={s._id} style={{
          marginBottom: '12px',
          animation: `slideUp 0.3s ease ${i * 0.05}s both`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '18px', flexShrink: 0,
            }}>
              {s.name?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{s.name}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={12} /> {s.email}
                </span>
                {s.studentId && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GraduationCap size={12} /> {s.studentId}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {students.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</p>
          <p>אין סטודנטים רשומים</p>
        </div>
      )}
    </div>
  );
}
