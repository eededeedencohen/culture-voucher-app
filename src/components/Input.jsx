export default function Input({ label, type = 'text', value, onChange, placeholder, icon: Icon, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          letterSpacing: '0.01em',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              transition: 'color var(--transition-fast)',
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '15px 16px',
            paddingRight: Icon ? '44px' : '16px',
            background: 'var(--bg-input)',
            border: '1.5px solid rgba(108, 99, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontWeight: 500,
            transition: 'all var(--transition-base)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = 'var(--shadow-input-focus)';
            e.target.style.background = 'var(--bg-input-focus)';
            const icon = e.target.parentElement?.querySelector('svg');
            if (icon) icon.style.color = 'var(--primary)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(108, 99, 255, 0.1)';
            e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.background = 'var(--bg-input)';
            const icon = e.target.parentElement?.querySelector('svg');
            if (icon) icon.style.color = 'var(--text-muted)';
          }}
          {...props}
        />
      </div>
    </div>
  );
}
