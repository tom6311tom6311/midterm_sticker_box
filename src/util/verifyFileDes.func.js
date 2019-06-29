import AppConfig from '../const/AppConfig.const';

const verifyFileDes = (description) => {
  // check properties
  if (typeof description !== 'string') throw new Error('WRONG_DESCRIPTION_TYPE');
  if (description.match(/[^\u3447-\uFA29]/ig)) throw new Error('CHINESE_ONLY');
  if (description.length > AppConfig.MAX_DESCRIPTION_LENGTH) throw new Error('DESCRIPTION_TOO_LONG');
};

export default verifyFileDes;
