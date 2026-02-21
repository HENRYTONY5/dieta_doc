const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const inputPath = path.resolve(__dirname, '..', 'docs', 'Chat_Primeros_Auxilios_Documentacion_Ingenieria.md');
const outputPath = path.resolve(__dirname, '..', 'docs', 'Chat_Primeros_Auxilios_Documentacion_Ingenieria.pdf');

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split(/\r?\n/);

const DOC_TITLE = 'Documento Técnico de Ingeniería de Software';
const DOC_SUBTITLE = 'Chat de Primeros Auxilios';
const DOC_VERSION = 'Versión 1.1';
const DOC_DATE = '2026-02-20';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 64, bottom: 64, left: 56, right: 56 },
  info: {
    Title: 'Documentación de Ingeniería - Chat de Primeros Auxilios',
    Author: 'hola_doc',
    Subject: 'Arquitectura de software',
  },
});

doc.pipe(fs.createWriteStream(outputPath));
const stripMarkdown = (value) =>
  value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');

const drawCover = () => {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;

  doc.rect(0, 0, doc.page.width, 170).fill('#0f172a');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(26).text(DOC_TITLE, left, 60, {
    width: right - left,
    align: 'left',
  });
  doc.fillColor('#cbd5e1').font('Helvetica').fontSize(16).text(DOC_SUBTITLE, left, 116, {
    width: right - left,
    align: 'left',
  });

  doc.fillColor('#111827').font('Helvetica-Bold').fontSize(12).text('Proyecto', left, 230);
  doc.font('Helvetica').fontSize(12).text('hola_doc', left + 110, 230);

  doc.font('Helvetica-Bold').fontSize(12).text('Versión', left, 255);
  doc.font('Helvetica').fontSize(12).text(DOC_VERSION, left + 110, 255);

  doc.font('Helvetica-Bold').fontSize(12).text('Fecha', left, 280);
  doc.font('Helvetica').fontSize(12).text(DOC_DATE, left + 110, 280);

  doc.font('Helvetica-Bold').fontSize(12).text('Documento', left, 305);
  doc.font('Helvetica').fontSize(12).text('Especificación técnica del módulo de chat de primeros auxilios', left + 110, 305, {
    width: right - (left + 110),
  });

  doc.moveTo(left, 352).lineTo(right, 352).strokeColor('#cbd5e1').lineWidth(1).stroke();

  doc.fillColor('#334155').font('Helvetica-Oblique').fontSize(10).text('Confidencialidad: uso interno de ingeniería, QA y arquitectura.', left, doc.page.height - 90, {
    width: right - left,
  });
};

drawCover();
doc.addPage();
doc.y = doc.page.margins.top;

doc.fillColor('#111827').font('Helvetica').fontSize(11);

for (const rawLine of lines) {
  const line = rawLine.replace(/\t/g, '  ');
  const cleanLine = stripMarkdown(line).trim();

  if (line.startsWith('# ')) {
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#0f172a').text(stripMarkdown(line.replace(/^#\s*/, '')), {
      align: 'left',
      lineGap: 2,
    });
    doc.fillColor('#111827').font('Helvetica').fontSize(11);
    continue;
  }

  if (line.startsWith('## ')) {
    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(15).fillColor('#0f172a').text(stripMarkdown(line.replace(/^##\s*/, '')), {
      align: 'left',
      lineGap: 2,
    });
    doc.fillColor('#111827').font('Helvetica').fontSize(11);
    continue;
  }

  if (line.startsWith('### ')) {
    doc.moveDown(0.45);
    doc.font('Helvetica-Bold').fontSize(12.5).fillColor('#1e293b').text(stripMarkdown(line.replace(/^###\s*/, '')), {
      align: 'left',
      lineGap: 1.5,
    });
    doc.fillColor('#111827').font('Helvetica').fontSize(11);
    continue;
  }

  if (cleanLine === '---') {
    const y = doc.y + 4;
    doc.moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .strokeColor('#cbd5e1')
      .lineWidth(0.8)
      .stroke();
    doc.moveDown(0.6);
    continue;
  }

  if (cleanLine === '') {
    doc.moveDown(0.3);
    continue;
  }

  const isBullet = /^\s*[-*]\s+/.test(line);
  const isNumbered = /^\s*\d+[\.)]\s+/.test(line);
  const isTableRow = /^\|.*\|$/.test(cleanLine);

  doc.fontSize(11).fillColor('#111827').font('Helvetica');

  if (isTableRow) {
    doc.font('Helvetica').fontSize(10.5).fillColor('#0f172a').text(cleanLine.replace(/\|/g, '  |  '), {
      lineGap: 1.2,
      align: 'left',
    });
    continue;
  }

  if (isBullet || isNumbered) {
    doc.text(stripMarkdown(line.trim()), {
      indent: 14,
      lineGap: 1.6,
      align: 'left',
    });
    continue;
  }

  doc.text(stripMarkdown(line), {
    lineGap: 1.6,
    align: 'left',
  });
}

doc.end();
console.log(`PDF generado: ${outputPath}`);
