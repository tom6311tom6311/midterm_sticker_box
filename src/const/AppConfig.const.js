const AppConfig = {
  SERVER_URL: 'http://localhost:5000',
  LOAD_TIMEOUT: 1000, // ms
  INFO_TIMEOUT: 2000, // ms
  ALLOWED_MEDIA_TYPE: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_NAME_LENGTH: 20,
  COMPRESS_QUALITY: 0.6,
  APP_STATUS: {
    READY: 'READY',
    LOADING: 'LOADING',
    // DISCONNECTED: 'DISCONNECTED',
    RENAMING: 'RENAMING',
    COMPRESSING: 'COMPRESSING',
    UPLOADING: 'UPLOADING',
  },
};

export default AppConfig;
