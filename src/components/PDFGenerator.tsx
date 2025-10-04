import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';

interface PDFGeneratorProps {
  title: string;
  content: React.ReactNode;
  filename: string;
  onGenerate?: () => void;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  title,
  content,
  filename,
  onGenerate
}) => {
  const generatePDF = async () => {
    try {
      // Create a temporary div to render the content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Render the content to the temp div
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      root.render(content);
      
      document.body.appendChild(tempDiv);
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate canvas from the content
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`${filename}.pdf`);
      
      // Cleanup
      document.body.removeChild(tempDiv);
      root.unmount();
      
      if (onGenerate) {
        onGenerate();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Błąd podczas generowania PDF');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Pobierz PDF
    </button>
  );
};

// Helper function to generate team registration PDF
export const generateTeamRegistrationPDF = (teamData: any, competitors: any[]) => {
  const content = (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1F9347', paddingBottom: '20px' }}>
        <h1 style={{ color: '#1F9347', fontSize: '24px', margin: '0 0 10px 0' }}>
          ZGŁOSZENIE DRUŻYNY
        </h1>
        <h2 style={{ color: '#333', fontSize: '18px', margin: '0' }}>
          {teamData.event_name || 'Zawody Sportowe LZS'}
        </h2>
        <p style={{ color: '#666', fontSize: '14px', margin: '10px 0 0 0' }}>
          Data: {new Date().toLocaleDateString('pl-PL')}
        </p>
        {teamData.event_name?.includes('Strzelectwie') && teamData.event_name?.includes('W Dychę') && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '5px', border: '1px solid #1e40af' }}>
            <p style={{ margin: '0', fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>
              SYSTEM PUNKTACJI DRUŻYNOWEJ:
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#1e40af' }}>
              I miejsce – 15 pkt, II – 13 pkt, III – 11 pkt, IV – 10 pkt, V – 9 pkt, VI – 8 pkt, VII – 7 pkt, VIII – 6 pkt, IX – 5 pkt, X – 4 pkt, XI – 3 pkt, XII – 2 pkt, XIII i dalsze – 1 pkt
            </p>
          </div>
        )}
      </div>

      {/* Team Information */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#1F9347', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
          DANE DRUŻYNY
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold', width: '30%' }}>Nazwa drużyny:</td>
              <td style={{ padding: '8px 0' }}>{teamData.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Typ organizacji:</td>
              <td style={{ padding: '8px 0' }}>{teamData.type}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Opiekun:</td>
              <td style={{ padding: '8px 0' }}>{teamData.supervisor_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Email:</td>
              <td style={{ padding: '8px 0' }}>{teamData.supervisor_email}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Telefon:</td>
              <td style={{ padding: '8px 0' }}>{teamData.supervisor_phone}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Organizacja:</td>
              <td style={{ padding: '8px 0' }}>{teamData.organization}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Adres:</td>
              <td style={{ padding: '8px 0' }}>{teamData.address}, {teamData.city} {teamData.postal_code}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Competitors List */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#1F9347', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
          LISTA ZAWODNIKÓW ({competitors.length} osób)
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Lp.</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Imię i nazwisko</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Rok urodzenia</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Płeć</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Konkurencje</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((competitor, index) => (
              <tr key={competitor.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {competitor.firstName} {competitor.lastName}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{competitor.birthYear}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {competitor.gender === 'M' ? 'Chłopiec' : 'Dziewczyna'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {teamData.event_name?.includes('Strzelectwie') && teamData.event_name?.includes('W Dychę') 
                    ? 'Strzelectwo, Bieg przełajowy, Rzut granatem'
                    : competitor.competitions.join(', ')
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '45%' }}>
            <p style={{ margin: '0 0 40px 0', borderBottom: '1px solid #333' }}></p>
            <p style={{ margin: '0', fontSize: '12px', textAlign: 'center' }}>
              Podpis opiekuna drużyny
            </p>
          </div>
          <div style={{ width: '45%' }}>
            <p style={{ margin: '0 0 40px 0', borderBottom: '1px solid #333' }}></p>
            <p style={{ margin: '0', fontSize: '12px', textAlign: 'center' }}>
              Data i pieczęć organizacji
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
        <p>Dokument wygenerowany automatycznie przez System Zawodów Sportowych LZS</p>
        <p>Data generowania: {new Date().toLocaleString('pl-PL')}</p>
      </div>
    </div>
  );

  return content;
};

// Helper function to generate results PDF
export const generateResultsPDF = (eventName: string, competitionName: string, results: any[]) => {
  const content = (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1F9347', paddingBottom: '20px' }}>
        <h1 style={{ color: '#1F9347', fontSize: '24px', margin: '0 0 10px 0' }}>
          WYNIKI ZAWODÓW
        </h1>
        <h2 style={{ color: '#333', fontSize: '18px', margin: '0' }}>
          {eventName}
        </h2>
        <h3 style={{ color: '#666', fontSize: '16px', margin: '10px 0 0 0' }}>
          {competitionName}
        </h3>
        <p style={{ color: '#666', fontSize: '14px', margin: '10px 0 0 0' }}>
          Data: {new Date().toLocaleDateString('pl-PL')}
        </p>
      </div>

      {/* Results Table */}
      <div style={{ marginBottom: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Miejsce</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Imię i nazwisko</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Drużyna</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Kategoria</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Wynik</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                  {result.position}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {result.name}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {result.team}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {result.category}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                  {result.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
        <p>Dokument wygenerowany automatycznie przez System Zawodów Sportowych LZS</p>
        <p>Data generowania: {new Date().toLocaleString('pl-PL')}</p>
      </div>
    </div>
  );

  return content;
};
