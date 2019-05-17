
import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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
};

const RenamingOverlay = ({ onChange, onSubmit }) => (
  <div className="overlay-wrapper">
    <div className="overlay overlay--input">
      <TextField
        style={styles.textField}
        inputStyle={styles.input}
        hintText={'請用一句話描述這張貼圖...'}
        underlineStyle={styles.underline}
        underlineFocusStyle={styles.underline}
        hintStyle={styles.hint}
        onChange={onChange}
        onKeyPress={({ key }) => { if (key === 'Enter') onSubmit(); }}
      />
      <RaisedButton size={'large'} onClick={onSubmit}>
        上傳
      </RaisedButton>
    </div>
  </div>
);

RenamingOverlay.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

RenamingOverlay.defaultProps = {
  onChange: () => {},
  onSubmit: () => {},
};

export default RenamingOverlay;
