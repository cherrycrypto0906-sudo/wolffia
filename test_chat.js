import handler from './api/chat.js';

const req = {
  method: 'POST',
  body: {
    messages: [{ role: 'user', content: 'cái này ăn như thế nào?' }]
  }
};

const res = {
  setHeader: () => {},
  status: (code) => {
    console.log('Status:', code);
    return {
      json: (data) => console.log('Data:', data)
    };
  }
};

handler(req, res).catch(console.error);
