/**
 * PDF export utility for session plans
 */

import jsPDF from 'jspdf';

export interface PDFExportOptions {
  sessionPlan: string;
  ageGroup: string;
  challenge: string;
  sessionFocus: string;
  sessionDuration: number;
  numPlayers: number;
  numCoaches: number;
}

/**
 * Export session plan to PDF
 */
export async function exportSessionPlanToPDF(options: PDFExportOptions): Promise<void> {
  const {
    sessionPlan,
    ageGroup,
    challenge,
    sessionFocus,
    sessionDuration,
    numPlayers,
    numCoaches,
  } = options;

  // Create PDF document (A4 size)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with wrapping
  const addText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.35;

    for (const line of lines) {
      checkPageBreak(lineHeight + 2);
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    }

    yPosition += 2; // Extra spacing after paragraph
  };

  // Add header with logo/title
  pdf.setFillColor(37, 99, 235); // Blue-600
  pdf.rect(0, 0, pageWidth, 25, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🏉 Trojans Coaching Assistant', margin, 12);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('RFU Regulation 15 Compliant Session Plan', margin, 19);

  yPosition = 35;

  // Session details box
  pdf.setFillColor(243, 244, 246); // Gray-100
  pdf.setDrawColor(209, 213, 219); // Gray-300
  pdf.rect(margin, yPosition - 5, contentWidth, 25, 'FD');

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Age Group: ${ageGroup}`, margin + 5, yPosition);
  pdf.text(`Session Focus: ${sessionFocus}`, margin + 5, yPosition + 6);
  pdf.text(`Duration: ${sessionDuration} min | Players: ${numPlayers} | Coaches: ${numCoaches}`, margin + 5, yPosition + 12);

  yPosition += 30;

  // Coaching challenge
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235); // Blue-600
  pdf.text('Coaching Challenge:', margin, yPosition);
  yPosition += 6;

  addText(challenge, 10, 'normal', [55, 65, 81]); // Gray-700
  yPosition += 3;

  // Add divider line
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Session Plan heading
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('Session Plan', margin, yPosition);
  yPosition += 8;

  // Process session plan content
  const lines = sessionPlan.split('\n');

  for (let line of lines) {
    line = line.trim();

    if (!line) {
      yPosition += 2;
      continue;
    }

    // Check for markdown headers
    if (line.startsWith('##')) {
      yPosition += 4;
      checkPageBreak(12);

      const headerText = line.replace(/^##\s*/, '');
      pdf.setFillColor(239, 246, 255); // Blue-50
      pdf.rect(margin, yPosition - 4, contentWidth, 10, 'F');

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(29, 78, 216); // Blue-700
      pdf.text(headerText, margin + 2, yPosition + 2);
      yPosition += 12;

    } else if (line.startsWith('#')) {
      yPosition += 3;
      checkPageBreak(10);

      const headerText = line.replace(/^#\s*/, '');
      addText(headerText, 11, 'bold', [37, 99, 235]);
      yPosition += 2;

    } else if (line.match(/^\d+\./)) {
      // Numbered list
      checkPageBreak(8);
      addText(line, 10, 'bold', [0, 0, 0]);

    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      // Bullet list
      checkPageBreak(6);
      const bulletText = line.replace(/^[-•]\s*/, '');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81);

      const textLines = pdf.splitTextToSize(`• ${bulletText}`, contentWidth - 5);
      for (const textLine of textLines) {
        checkPageBreak(4);
        pdf.text(textLine, margin + 3, yPosition);
        yPosition += 4;
      }

    } else {
      // Regular text
      addText(line, 10, 'normal', [55, 65, 81]);
    }
  }

  // Add footer with timestamp
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175); // Gray-400
    pdf.setFont('helvetica', 'normal');

    const footerText = `Generated ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} | Trojans RFC | Page ${i} of ${totalPages}`;
    pdf.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Trojans-Session-${ageGroup}-${timestamp}.pdf`;

  // Save PDF
  pdf.save(filename);
}
