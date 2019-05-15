import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const styles = {
  toolbar: {
    backgroundColor: '#4285f4',
    width: '100%',
    height: '20%',
  },
  toolbarGroup: {
    width: '100%',
  },
  textField: {
    width: '80%',
    height: '40%',
    fontSize: '32px',
    lineHeight: '32px',
  },
  underline: {
    borderColor: 'white',
  },
  hint: {
    color: 'white',
  },
  input: {
    color: 'white',
  },
};

const SearchBar = ({ onChange, onSubmit }) => (
  <Toolbar style={styles.toolbar}>
    <ToolbarGroup style={styles.toolbarGroup}>
      <TextField
        style={styles.textField}
        inputStyle={styles.input}
        hintText={'請輸入關鍵字...'}
        underlineStyle={styles.underline}
        underlineFocusStyle={styles.underline}
        hintStyle={styles.hint}
        onChange={onChange}
        onKeyPress={({ key }) => { if (key === 'Enter') onSubmit(); }}
      />
      <RaisedButton size={'large'} onClick={onSubmit}>
        Browse
      </RaisedButton>
    </ToolbarGroup>
  </Toolbar>
);

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

SearchBar.defaultProps = {
  onChange: () => {},
  onSubmit: () => {},
};

export default SearchBar;
