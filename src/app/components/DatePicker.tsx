'use client';
import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  id?: string;
  value: string;           // YYYY-MM-DD
  onChange: (val: string) => void;
  required?: boolean;
  maxYear?: number;
  minYear?: number;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function parseYMD(val: string): { y: number; m: number; d: number } | null {
  if (!val) return null;
  const [y, m, d] = val.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { y, m: m - 1, d };
}

export default function DatePicker({
  id,
  value,
  onChange,
  required,
  maxYear = new Date().getFullYear() - 17,   // must be ≥17 for cadet eligibility
  minYear = 1970,
}: DatePickerProps) {
  const parsed = parseYMD(value);
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.y ?? maxYear);
  const [viewMonth, setViewMonth] = useState(parsed?.m ?? today.getMonth());
  const [pickingYear, setPickingYear] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setPickingYear(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync view when value changes externally
  useEffect(() => {
    if (parsed) { setViewYear(parsed.y); setViewMonth(parsed.m); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const select = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
    setPickingYear(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const displayValue = parsed
    ? `${String(parsed.d).padStart(2,'0')} ${MONTHS[parsed.m]} ${parsed.y}`
    : '';

  const yearList = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  const isSelected = (day: number) =>
    parsed && parsed.y === viewYear && parsed.m === viewMonth && parsed.d === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Hidden native input for form validation */}
      <input
        id={id}
        name="date_of_birth"
        type="text"
        value={value}
        required={required}
        readOnly
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setPickingYear(false); }}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1.5px solid ${open ? '#1A2B6D' : '#E2E8F0'}`,
          borderRadius: '8px',
          fontSize: '14px',
          background: 'white',
          color: displayValue ? '#1A1A2E' : '#9BA8BB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'border 0.2s',
          boxShadow: open ? '0 0 0 3px rgba(26,43,109,0.08)' : 'none',
          textAlign: 'left',
        }}
      >
        <span>{displayValue || 'Select date of birth'}</span>
        <span style={{ fontSize: '16px', color: '#64748B' }}>📅</span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 200,
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 32px rgba(26,43,109,0.18)',
          minWidth: '300px',
          overflow: 'hidden',
          animation: 'fadeInUp 0.18s ease forwards',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1A2B6D 0%, #243693 100%)',
            padding: '18px 20px 14px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Date of Birth
            </div>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.3px' }}>
              {displayValue || '— Select a date —'}
            </div>
          </div>

          {pickingYear ? (
            /* ── Year grid ── */
            <div>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A2B6D' }}>Select Year</span>
                <button type="button" onClick={() => setPickingYear(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '18px' }}>×</button>
              </div>
              <div style={{ maxHeight: '224px', overflowY: 'auto', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px' }}>
                {yearList.map(yr => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => { setViewYear(yr); setPickingYear(false); }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: yr === viewYear ? 800 : 500,
                      background: yr === viewYear ? '#1A2B6D' : 'transparent',
                      color: yr === viewYear ? 'white' : '#374151',
                      transition: 'all 0.15s',
                    }}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Month/Day grid ── */
            <div style={{ padding: '14px 16px 16px' }}>
              {/* Month nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <button type="button" onClick={prevMonth}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#1A2B6D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>

                <button
                  type="button"
                  onClick={() => setPickingYear(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#1A2B6D', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {MONTHS[viewMonth]} {viewYear}
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>▾</span>
                </button>

                <button type="button" onClick={nextMonth}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#1A2B6D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '6px' }}>
                {DAYS.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', padding: '4px 0' }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                {cells.map((day, idx) => (
                  day === null ? (
                    <div key={idx} />
                  ) : (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => select(day)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '50%',
                        border: isToday(day) && !isSelected(day) ? '1.5px solid #C8102E' : 'none',
                        background: isSelected(day) ? '#C8102E' : 'transparent',
                        color: isSelected(day) ? 'white' : isToday(day) ? '#C8102E' : '#374151',
                        fontWeight: isSelected(day) || isToday(day) ? 700 : 400,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected(day)) (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected(day)) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      {day}
                    </button>
                  )
                ))}
              </div>

              {/* Clear button */}
              {value && (
                <div style={{ marginTop: '12px', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { onChange(''); setOpen(false); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}
                  >
                    Clear date
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
