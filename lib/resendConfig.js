export const getResendApiKey = async () => {
  return process.env.RESEND_API_KEY?.trim() || '';
};
