import React from "react";

export type StartListEntry = {
  startNumber: number | string;
  name: string;
  team: string;
  category?: string;
};

type Props = {
  eventName: string;
  competitionName: string;
  generatedAt?: string;
  entries: StartListEntry[];
};

export default function StartList({ eventName, competitionName, generatedAt, entries }: Props) {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', lineHeight: 1.5, color: '#111827', width: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #1F9347' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1F9347' }}>LISTA STARTOWA</div>
          <div style={{ fontSize: 14, color: '#374151' }}>{eventName}</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>{competitionName}</div>
        </div>
        <img src={`${import.meta.env.BASE_URL}lzs-logo.png`} alt="LZS" style={{ height: 48 }} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ backgroundColor: '#F3F4F6' }}>
            <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB', width: 80 }}>Nr start.</th>
            <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB' }}>Imię i nazwisko</th>
            <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB' }}>Szkoła/Drużyna</th>
            <th style={{ textAlign: 'left', padding: '10px 8px', border: '1px solid #E5E7EB', width: 140 }}>Kategoria</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td style={{ padding: '8px', border: '1px solid #E5E7EB', fontWeight: 600 }}>{e.startNumber}</td>
              <td style={{ padding: '8px', border: '1px solid #E5E7EB' }}>{e.name}</td>
              <td style={{ padding: '8px', border: '1px solid #E5E7EB' }}>{e.team}</td>
              <td style={{ padding: '8px', border: '1px solid #E5E7EB' }}>{e.category || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 11, color: '#6B7280' }}>
        <div>Wygenerowano: {generatedAt || new Date().toLocaleString('pl-PL')}</div>
        <div style={{ color: '#1F9347' }}>Pomorska Arena • LZS</div>
      </div>
    </div>
  );
}


