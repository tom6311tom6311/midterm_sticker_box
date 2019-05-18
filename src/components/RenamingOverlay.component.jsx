/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  textField: {
    width: '70%',
    marginRight: '5%',
    fontSize: '20px',
    lineHeight: '20px',
  },
  underline: {
    borderColor: 'grey',
  },
  hint: {
    color: 'grey',
  },
  input: {
    color: 'grey',
  },
  checkBox: {
    width: '6%',
    display: 'inline-block',
  },
};

const RenamingOverlay = ({ onNameChange, onCheckboxChange, onSubmit, onExit }) => (
  <div className="overlay-wrapper">
    <div className="overlay overlay--input">
      <TextField
        style={styles.textField}
        inputStyle={styles.input}
        hintText={'請用一句話描述這張貼圖...'}
        underlineStyle={styles.underline}
        underlineFocusStyle={styles.underline}
        hintStyle={styles.hint}
        onChange={onNameChange}
        onKeyPress={({ key }) => { if (key === 'Enter') onSubmit(); }}
      />
      <RaisedButton size={'large'} onClick={onSubmit}>
        上傳
      </RaisedButton>
    </div>
    <div className="overlay overlay--check">
      <Checkbox
        style={styles.checkBox}
        value="checkBox"
        onCheck={onCheckboxChange}
      />
      <div className={'overlay--check-text'}>我確定這張圖沒有版權問題</div>
    </div>
    <div className={'overlay-close'} onClick={onExit} />
  </div>
);

RenamingOverlay.propTypes = {
  onNameChange: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onExit: PropTypes.func,
};

RenamingOverlay.defaultProps = {
  onNameChange: () => {},
  onCheckboxChange: () => {},
  onSubmit: () => {},
  onExit: () => {},
};

export default RenamingOverlay;
