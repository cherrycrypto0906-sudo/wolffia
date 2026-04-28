const DEFAULT_SPREADSHEET_ID = '12F6jLbSPf6KJUQPIXxQ6ar77NTtJqDNHulNVVj1F9Yg';
const IMAGE_FOLDER_NAME = 'Wolffia Uploads';

const SHEETS = {
  survey_leads: {
    name: 'survey_leads',
    headers: [
      'id', 'submittedAt', 'submissionStatus', 'surveyName', 'leadSource', 'name', 'email', 'phone', 'persona', 'challenges', 'desiredBenefit', 'giftInterest', 'note', 'zalo_joined', 'rawPayload'
    ]
  },
  products: {
    name: 'products',
    headers: ['id', 'name', 'price', 'description', 'stock_quantity', 'created_at', 'updated_at']
  },
  customers: {
    name: 'customers',
    headers: ['id', 'name', 'phone', 'zalo', 'email', 'address', 'registered_at', 'created_at', 'updated_at']
  },
  orders: {
    name: 'orders',
    headers: ['id', 'customer_id', 'customer_name', 'phone', 'product_id', 'product_name', 'quantity', 'amount', 'status', 'address', 'transfer_content', 'purchased_at', 'created_at', 'updated_at', 'note']
  }
};

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || 'list';
    const resource = params.resource || 'all';
    const spreadsheet = SpreadsheetApp.openById(DEFAULT_SPREADSHEET_ID);

    if (resource === 'all') {
      return jsonResponse_({
        ok: true,
        data: {
          products: readResource_(spreadsheet, 'products'),
          customers: readResource_(spreadsheet, 'customers'),
          orders: readResource_(spreadsheet, 'orders')
        }
      });
    }

    if (action === 'list') {
      return jsonResponse_({ ok: true, data: readResource_(spreadsheet, resource) });
    }

    return jsonResponse_({ ok: false, message: 'Unsupported GET action' });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error.message, stack: error.stack });
  }
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const action = payload.action || 'create';
    const resource = payload.resource || 'survey_leads';
    const spreadsheet = SpreadsheetApp.openById(DEFAULT_SPREADSHEET_ID);

    if (resource === 'survey_leads') {
      const record = createSurveyLead_(spreadsheet, payload);
      return jsonResponse_({ ok: true, data: record });
    }

    if (resource === 'order_intake') {
      const result = createOrderIntake_(spreadsheet, payload);
      return jsonResponse_({ ok: true, data: result });
    }

    if (action === 'create') {
      const created = createResource_(spreadsheet, resource, payload.record || {});
      return jsonResponse_({ ok: true, data: created });
    }

    if (action === 'update') {
      const updated = updateResource_(spreadsheet, resource, payload.record || {});
      return jsonResponse_({ ok: true, data: updated });
    }

    if (action === 'delete') {
      deleteResource_(spreadsheet, resource, payload.id);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, message: 'Unsupported POST action' });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error.message, stack: error.stack });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing POST body');
  }
  return JSON.parse(e.postData.contents);
}

function createSurveyLead_(spreadsheet, payload) {
  const sheet = ensureSheet_(spreadsheet, 'survey_leads');
  const headers = SHEETS.survey_leads.headers;
  const record = {
    id: payload.id || createId_(),
    submittedAt: payload.submittedAt || new Date().toISOString(),
    submissionStatus: payload.submissionStatus || 'cookbook_survey',
    surveyName: payload.surveyName || 'Wolffia Cookbook Survey',
    leadSource: payload.leadSource || 'landing_page',
    name: payload.name || '',
    email: payload.email || '',
    phone: payload.phone || '',
    persona: payload.persona || '',
    challenges: normalizeChallenges_(payload.challenges),
    desiredBenefit: payload.desiredBenefit || '',
    giftInterest: payload.giftInterest || '',
    note: payload.note || '',
    zalo_joined: payload.zalo_joined ? 'yes' : 'no',
    rawPayload: JSON.stringify(payload)
  };

  appendRecord_(sheet, headers, record);
  return record;
}

function createOrderIntake_(spreadsheet, payload) {
  const productRecord = upsertProductFromOrder_(spreadsheet, payload);
  const customerRecord = upsertCustomerFromOrder_(spreadsheet, payload);
  const orderSheet = ensureSheet_(spreadsheet, 'orders');
  const orderHeaders = SHEETS.orders.headers;
  const quantity = Math.max(1, Number(payload.quantity || 1));
  const amount = Number(payload.depositAmount || 0);
  const orderRecord = {
    id: createId_(),
    customer_id: customerRecord.id,
    customer_name: payload.name || customerRecord.name || '',
    phone: payload.phone || customerRecord.phone || '',
    product_id: productRecord.id,
    product_name: payload.packageName || productRecord.name || '',
    quantity: quantity,
    amount: amount,
    status: payload.status || 'pending_payment',
    address: payload.location || '',
    transfer_content: payload.transferContent || '',
    purchased_at: payload.submittedAt || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    note: payload.note || ''
  };

  appendRecord_(orderSheet, orderHeaders, orderRecord);
  adjustProductStock_(spreadsheet, productRecord.id, -quantity);

  return {
    product: readRecordById_(spreadsheet, 'products', productRecord.id),
    customer: customerRecord,
    order: orderRecord
  };
}

function createResource_(spreadsheet, resource, record) {
  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const now = new Date().toISOString();
  const nextRecord = Object.assign({}, record, {
    id: record.id || createId_(),
    created_at: record.created_at || now,
    updated_at: now
  });
  appendRecord_(sheet, headers, nextRecord);
  return nextRecord;
}

function updateResource_(spreadsheet, resource, record) {
  if (!record.id) {
    throw new Error('Missing record id');
  }

  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const records = readResource_(spreadsheet, resource);
  const index = records.findIndex(function(item) { return item.id === record.id; });

  if (index === -1) {
    throw new Error('Record not found');
  }

  if (resource === 'orders') {
    const previous = records[index];
    if (previous.product_id === record.product_id) {
      const delta = Number(record.quantity || 1) - Number(previous.quantity || 1);
      if (delta !== 0) adjustProductStock_(spreadsheet, record.product_id, -delta);
    } else {
      adjustProductStock_(spreadsheet, previous.product_id, Number(previous.quantity || 1));
      adjustProductStock_(spreadsheet, record.product_id, -Number(record.quantity || 1));
    }
  }

  records[index] = Object.assign({}, records[index], record, { updated_at: new Date().toISOString() });
  writeResource_(sheet, headers, records);
  return records[index];
}

function deleteResource_(spreadsheet, resource, id) {
  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const records = readResource_(spreadsheet, resource);
  const index = records.findIndex(function(item) { return item.id === id; });

  if (index === -1) return;

  if (resource === 'orders') {
    adjustProductStock_(spreadsheet, records[index].product_id, Number(records[index].quantity || 1));
  }

  records.splice(index, 1);
  writeResource_(sheet, headers, records);
}

function upsertProductFromOrder_(spreadsheet, payload) {
  const resource = 'products';
  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const records = readResource_(spreadsheet, resource);
  const match = records.find(function(item) { return item.id === payload.packageId || item.name === payload.packageName; });

  if (match) {
    return match;
  }

  const now = new Date().toISOString();
  const record = {
    id: payload.packageId || createId_(),
    name: payload.packageName || 'San pham',
    price: Number(payload.unitPrice || payload.depositAmount || 0),
    description: payload.packageDescription || '',
    stock_quantity: Number(payload.stock_quantity || 9999),
    created_at: now,
    updated_at: now
  };

  appendRecord_(sheet, headers, record);
  return record;
}

function upsertCustomerFromOrder_(spreadsheet, payload) {
  const resource = 'customers';
  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const records = readResource_(spreadsheet, resource);
  const match = records.find(function(item) { return item.phone === String(payload.phone || '').trim(); });
  const now = new Date().toISOString();

  if (match) {
    const updated = Object.assign({}, match, {
      name: payload.name || match.name,
      address: payload.location || match.address || '',
      updated_at: now
    });

    const index = records.findIndex(function(item) { return item.id === match.id; });
    records[index] = updated;
    writeResource_(sheet, headers, records);
    return updated;
  }

  const record = {
    id: createId_(),
    name: payload.name || '',
    phone: String(payload.phone || '').trim(),
    zalo: payload.zalo || '',
    email: payload.email || '',
    address: payload.location || '',
    registered_at: payload.submittedAt || now,
    created_at: now,
    updated_at: now
  };

  appendRecord_(sheet, headers, record);
  return record;
}

function adjustProductStock_(spreadsheet, productId, delta) {
  if (!productId || !delta) return;
  const resource = 'products';
  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const records = readResource_(spreadsheet, resource);
  const index = records.findIndex(function(item) { return item.id === productId; });
  if (index === -1) return;
  const nextStock = Math.max(0, Number(records[index].stock_quantity || 0) + Number(delta));
  records[index].stock_quantity = nextStock;
  records[index].updated_at = new Date().toISOString();
  writeResource_(sheet, headers, records);
}

function readRecordById_(spreadsheet, resource, id) {
  const records = readResource_(spreadsheet, resource);
  return records.find(function(item) { return item.id === id; }) || null;
}

function ensureSheet_(spreadsheet, resource) {
  const config = SHEETS[resource];
  if (!config) {
    throw new Error('Unknown resource: ' + resource);
  }

  let sheet = spreadsheet.getSheetByName(config.name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
  } else {
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
  }

  return sheet;
}

function readResource_(spreadsheet, resource) {
  const sheet = ensureSheet_(spreadsheet, resource);
  const headers = SHEETS[resource].headers;
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return rows
    .filter(function(row) { return row.some(function(cell) { return cell !== ''; }); })
    .map(function(row) {
      const record = {};
      headers.forEach(function(header, index) {
        record[header] = row[index];
      });
      return record;
    });
}

function writeResource_(sheet, headers, records) {
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (!records.length) return;
  const values = records.map(function(record) {
    return headers.map(function(header) { return record[header] || ''; });
  });
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}

function appendRecord_(sheet, headers, record) {
  const row = headers.map(function(header) { return record[header] || ''; });
  sheet.appendRow(row);
}

function createId_() {
  return Utilities.getUuid();
}

function normalizeChallenges_(challenges) {
  if (Array.isArray(challenges)) return challenges.join(' | ');
  return challenges || '';
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
