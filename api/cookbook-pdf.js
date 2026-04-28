const createPdfBuffer = () => {
  const objects = [];

  const addObject = (content) => {
    objects.push(content);
  };

  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  addObject('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>');

  const stream = [
    'BT',
    '/F1 24 Tf',
    '72 760 Td',
    '(Wolffia Cookbook) Tj',
    '0 -34 Td',
    '/F1 14 Tf',
    '(Cam on ban da tham gia nhom Zalo va nhan qua tu Diep Chau.) Tj',
    '0 -26 Td',
    '(Day la file PDF mau de tai ngay tren website.) Tj',
    '0 -26 Td',
    '(Ban co the thay bang cookbook chi tiet hon bat cu luc nao.) Tj',
    'ET',
  ].join('\n');

  addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pdfBuffer = createPdfBuffer();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="wolffia-cookbook.pdf"');
  return res.status(200).send(pdfBuffer);
}
