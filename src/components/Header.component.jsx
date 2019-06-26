/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import AppConfig from '../const/AppConfig.const';


const Header = ({ name, status, onSwitchToOwnStickers, onSwitchToMain }) => (
  <div className="header-wrapper">
    <span className="header-wrappper-name">{name} 您好</span>
    {/* <div style={{ flex: 4 }}></div> */}
    <span className="header-wrapper-button">
      {status === AppConfig.APP_STATUS.OWN_STICKERS || status === AppConfig.APP_STATUS.OWN_TAGS ?
        <FlatButton primary onClick={onSwitchToMain} >
          搜尋貼圖
        </FlatButton> :
        <FlatButton primary onClick={onSwitchToOwnStickers} >
          我的收藏
        </FlatButton>
      }
    </span>
  </div>
);

Header.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
  onSwitchToOwnStickers: PropTypes.func,
  onSwitchToMain: PropTypes.func,
};

Header.defaultProps = {
  name: '',
  status: '',
  onSwitchToOwnStickers: () => {},
  onSwitchToMain: () => {},
};

export default Header;
