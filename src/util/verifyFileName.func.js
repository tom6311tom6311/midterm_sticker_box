import AppConfig from '../const/AppConfig.const';

const verifyFileName = (name) => {
  // check properties
  if (typeof name !== 'string') throw new Error('WRONG_NAME_TYPE');
  if (name.match(/[^\u3447-\uFA29]/ig)) throw new Error('CHINESE_ONLY');
  if (name.length > AppConfig.MAX_NAME_LENGTH) throw new Error('NAME_TOO_LONG');
};

export default verifyFileName;
