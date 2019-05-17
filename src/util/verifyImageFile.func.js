import AppConfig from '../const/AppConfig.const';

const verifyImageFile = (file) => {
  // check properties
  if (file === undefined || file === null) throw new Error('FILE_NOT_DEFINED');
  if (file.name === undefined) throw new Error('FILE_NAME_NOT_DEFINED');
  if (file.path === undefined) throw new Error('FILE_PATH_NOT_DEFINED');
  if (file.type === undefined) throw new Error('FILE_TYPE_NOT_DEFINED');
  // check media type
  if (!AppConfig.ALLOWED_MEDIA_TYPE.some(type => file.type === type)) throw new Error('INVALID_MEDIA_TYPE');
};

export default verifyImageFile;
