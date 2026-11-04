import { existsSync } from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

function markdownToText(markdown) {
  return markdown
    .replace(/```[^\n]*\n?([\s\S]*?)```/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '- ')
    .replace(/^\s*\d+\.\s+/gm, '- ')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*>\s?/gm, '')
    .trim();
}

function formatPublicationDate(date) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(`${date}T12:00:00+01:00`));
}

export function generateDevotionalPdf(item) {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: 'A4', margin: 56, info: { Title: item.title, Author: 'Salem Africa' } });
    const chunks = [];
    document.on('data', (chunk) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);

    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
      if (existsSync(logoPath)) document.image(logoPath, 56, 38, { fit: [42, 42] });
      document
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#b82e2c')
        .text('SALEM AFRICA', 108, 43);
      document
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#64615e')
        .text('Daily Devotion', 108, 62);
      document.moveTo(56, 92).lineTo(539, 92).lineWidth(1).strokeColor('#e0dfdc').stroke();
      document.y = 112;
      document.font('Helvetica-Bold').fontSize(24).fillColor('#171719').text(item.title, { lineGap: 3 });
      document.moveDown(0.4);
      document.font('Helvetica').fontSize(10).fillColor('#64615e');
      const date = item.publication_date ?? item.created_at.slice(0, 10);
      document.text(formatPublicationDate(date));
      if (typeof item.data.author === 'string' && item.data.author.trim()) document.text(`By ${item.data.author.trim()}`);

      const addSection = (heading, value) => {
        document.moveDown(1);
        if (document.y > document.page.height - document.page.margins.bottom - 48) document.addPage();
        document.font('Helvetica-Bold').fontSize(13).fillColor('#b82e2c').text(heading);
        document.moveDown(0.3);
        document.font('Helvetica').fontSize(11).fillColor('#292827').text(value, {
          width: 483,
          lineGap: 4,
          paragraphGap: 4,
        });
      };

      addSection('Scripture', `${typeof item.data.bibleReference === 'string' ? item.data.bibleReference : ''}\n\n${typeof item.data.scriptureText === 'string' ? item.data.scriptureText : ''}`);
      addSection('Devotional Message', markdownToText(typeof item.data.message === 'string' ? item.data.message : ''));
      addSection('Prayer', markdownToText(typeof item.data.prayer === 'string' ? item.data.prayer : ''));
      if (typeof item.data.furtherReading === 'string' && item.data.furtherReading.trim()) {
        addSection('Further Reading', item.data.furtherReading.trim());
      }
      document.end();
    } catch (error) {
      document.destroy(error);
      reject(error);
    }
  });
}
