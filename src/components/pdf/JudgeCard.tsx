import React from "react";

export type JudgeCardRow = {
  startNumber: number | string;
  name: string;
  team: string;
  pistol?: number[]; // 5 attempts
  rifle?: number[];  // 5 attempts
  runPlace?: number | null;
  grenade?: { attempt1?: number; attempt2?: number; attempt3?: number; tieDistanceCm?: number | null };
  notes?: string;
};

type Props = {
  eventName: string;
  competitionName: string; // one of: Strzelectwo, Bieg, Rzut granatem
  judgeName?: string;
  rows: JudgeCardRow[];
};

export default function JudgeCard({ eventName, competitionName, judgeName, rows }: Props) {
  const renderHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #1F9347' }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1F9347' }}>KARTA SĘDZIOWSKA</div>
        <div style={{ fontSize: 14, color: '#374151' }}>{eventName}</div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>{competitionName}</div>
      </div>
      <img src={`${import.meta.env.BASE_URL}lzs-logo.png`} alt="LZS" style={{ height: 48 }} />
    </div>
  );

  const tableCommon = (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ backgroundColor: '#F3F4F6' }}>
          <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB', width: 80 }}>Nr start.</th>
          <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB' }}>Imię i nazwisko</th>
          <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB' }}>Szkoła/Drużyna</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );

  const renderShooting = (kind: 'pistol' | 'rifle') => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ backgroundColor: '#F3F4F6' }}>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left', width: 80 }}>Nr</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Zawodnik</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Drużyna</th>
          {[1,2,3,4,5].map(n => (
            <th key={n} style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 48 }}>S{n}</th>
          ))}
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 80 }}>Suma</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Uwagi</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const arr = (kind === 'pistol' ? r.pistol : r.rifle) || [0,0,0,0,0];
          const total = arr.reduce((s, v) => s + (v || 0), 0);
          return (
            <tr key={i}>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', fontWeight: 600 }}>{r.startNumber}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.name}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.team}</td>
              {arr.map((v, idx) => (
                <td key={idx} style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center' }}>{v || ''}</td>
              ))}
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', fontWeight: 700 }}>{total}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.notes || ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderRun = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ backgroundColor: '#F3F4F6' }}>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left', width: 80 }}>Nr</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Zawodnik</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Drużyna</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 80 }}>Miejsce</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Uwagi</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #E5E7EB', padding: '8px', fontWeight: 600 }}>{r.startNumber}</td>
            <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.name}</td>
            <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.team}</td>
            <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center' }}>{r.runPlace || ''}</td>
            <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.notes || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderGrenade = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ backgroundColor: '#F3F4F6' }}>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left', width: 80 }}>Nr</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Zawodnik</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Drużyna</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 70 }}>R1</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 70 }}>R2</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 70 }}>R3</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 120 }}>Suma</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', width: 120 }}>Remis (cm)</th>
          <th style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'left' }}>Uwagi</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const g = r.grenade || {};
          const total = (g.attempt1 || 0) + (g.attempt2 || 0) + (g.attempt3 || 0);
          return (
            <tr key={i}>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', fontWeight: 600 }}>{r.startNumber}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.name}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.team}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center' }}>{g.attempt1 || ''}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center' }}>{g.attempt2 || ''}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center' }}>{g.attempt3 || ''}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center', fontWeight: 700 }}>{total}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px', textAlign: 'center' }}>{g.tieDistanceCm ?? ''}</td>
              <td style={{ border: '1px solid #E5E7EB', padding: '8px' }}>{r.notes || ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', lineHeight: 1.5, color: '#111827', width: '800px' }}>
      {renderHeader()}
      {competitionName.toLowerCase().includes('broń krótka') && renderShooting('pistol')}
      {competitionName.toLowerCase().includes('broń długa') && renderShooting('rifle')}
      {competitionName.toLowerCase().includes('bieg') && renderRun()}
      {competitionName.toLowerCase().includes('granat') && renderGrenade()}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 11, color: '#6B7280' }}>
        <div>Sędzia: {judgeName || '........................................'}</div>
        <div>Data: {new Date().toLocaleDateString('pl-PL')}</div>
      </div>
    </div>
  );
}


