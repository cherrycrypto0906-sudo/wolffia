export const FORM_DESTINATION = process.env.FORM_DESTINATION?.trim() || '';

export const assertBackendConfig = () => {
  if (!FORM_DESTINATION) {
    throw new Error('Missing FORM_DESTINATION environment variable');
  }
};
