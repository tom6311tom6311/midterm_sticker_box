const AppConfig = {
  SERVER_URL: {
    HTTP: 'http://localhost:4000',
    WS: 'ws://localhost:4000',
  },
  LOAD_TIMEOUT: 1000, // ms
  INFO_TIMEOUT: 2000, // ms
  ALLOWED_MEDIA_TYPE: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_DESCRIPTION_LENGTH: 30,
  COMPRESS_QUALITY: 0.6,
  PAGES: {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    SEARCH: 'SEARCH',
    MY_BOX: 'MY_BOX',
  },
  APP_STATUS: {
    READY: 'READY',
    LOADING: 'LOADING',
    DESCRIBING: 'DESCRIBING',
    COMPRESSING: 'COMPRESSING',
    UPLOADING: 'UPLOADING',
  },
};

export default AppConfig;
