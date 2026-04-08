const DEFAULT_SPREADSHEET_ID = '12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg';
const DEFAULT_SHEET_NAME = '';
const IMAGE_FOLDER_NAME = 'Wolffia Uploads';

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = resolveSheet_(payload);
    const headers = ensureHeaders_(sheet);
    const screenshotInfo = saveScreenshotIfPresent_(payload);
    const row = buildRow_(headers, payload, screenshotInfo);

    sheet.appendRow(row);

    return jsonResponse_({
      ok: true,
      message: 'Saved successfully',
      spreadsheetId: sheet.getParent().getId(),
      sheetName: sheet.getName(),
      screenshotUrl: screenshotInfo.fileUrl || ''
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error.message,
      stack: error.stack
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Wolffia form endpoint is running'
  });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing POST body');
  }

  const data = JSON.parse(e.postData.contents);

  if (!data.name || !data.phone) {
    throw new Error('Missing required customer info');
  }

  return data;
}

function resolveSheet_(payload) {
  const spreadsheetId = extractSpreadsheetId_(payload.destinationSheet) || DEFAULT_SPREADSHEET_ID;
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const requestedSheetName = payload.sheetName || DEFAULT_SHEET_NAME;

  if (requestedSheetName) {
    const namedSheet = spreadsheet.getSheetByName(requestedSheetName);
    if (namedSheet) return namedSheet;
  }

  return spreadsheet.getSheets()[0];
}

function ensureHeaders_(sheet) {
  const headers = [
    'submittedAt',
    'submissionStatus',
    'surveyName',
    'leadSource',
    'name',
    'phone',
    'persona',
    'challenges',
    'desiredBenefit',
    'giftInterest',
    'note',
    'destinationSheet',
    'sheetName',
    'screenshotFileName',
    'screenshotMimeType',
    'screenshotFileSize',
    'screenshotUploadedAt',
    'screenshotUrl',
    'screenshotFormula',
    'driveFileId',
    'rawPayload'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return headers;
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return headers;
}

function saveScreenshotIfPresent_(payload) {
  if (!payload.screenshotBase64 || typeof payload.screenshotBase64 !== 'string') {
    return {
      fileId: '',
      fileUrl: '',
      imageFormula: ''
    };
  }

  const base64Data = payload.screenshotBase64.split(',').pop();
  const mimeType = payload.screenshotMimeType || 'image/jpeg';
  const extension = mimeType.split('/').pop() || 'jpg';
  const filename = payload.screenshotFileName || buildScreenshotName_(payload, extension);
  const folder = getOrCreateFolder_(IMAGE_FOLDER_NAME);
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, filename);
  const file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    imageFormula: '=IMAGE("' + file.getUrl() + '")'
  };
}

function buildScreenshotName_(payload, extension) {
  const safeName = sanitizeFileName_(payload.name || 'khach-hang');
  const safePhone = sanitizeFileName_(payload.phone || 'phone');
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  return 'upload-' + safeName + '-' + safePhone + '-' + timestamp + '.' + extension;
}

function sanitizeFileName_(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toLowerCase();
}

function getOrCreateFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function buildRow_(headers, payload, screenshotInfo) {
  const rawPayload = JSON.stringify(payload);

  const values = {
    submittedAt: payload.submittedAt || new Date().toISOString(),
    submissionStatus: payload.submissionStatus || '',
    surveyName: payload.surveyName || '',
    leadSource: payload.leadSource || '',
    name: payload.name || '',
    phone: payload.phone || '',
    persona: payload.persona || '',
    challenges: normalizeChallenges_(payload.challenges),
    desiredBenefit: payload.desiredBenefit || '',
    giftInterest: payload.giftInterest || '',
    note: payload.note || '',
    destinationSheet: payload.destinationSheet || '',
    sheetName: payload.sheetName || '',
    screenshotFileName: payload.screenshotFileName || '',
    screenshotMimeType: payload.screenshotMimeType || '',
    screenshotFileSize: payload.screenshotFileSize || '',
    screenshotUploadedAt: payload.screenshotUploadedAt || '',
    screenshotUrl: screenshotInfo.fileUrl,
    screenshotFormula: screenshotInfo.imageFormula,
    driveFileId: screenshotInfo.fileId,
    rawPayload: rawPayload
  };

  return headers.map(function(header) {
    return values[header] || '';
  });
}

function normalizeChallenges_(challenges) {
  if (Array.isArray(challenges)) {
    return challenges.join(' | ');
  }

  if (typeof challenges === 'string') {
    return challenges;
  }

  return '';
}

function extractSpreadsheetId_(sheetUrl) {
  if (!sheetUrl) return '';

  const match = String(sheetUrl).match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : '';
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
