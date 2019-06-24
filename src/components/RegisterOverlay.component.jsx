import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  textField: {
    width: '100%',
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

class RegisterOverlay extends Component {
  constructor() {
    super();
    this.state = {
      userID: '',
      password: '',
      verifyPassword: '',
      name: '',
    };

    this.onUserIDChanged = this.onUserIDChanged.bind(this);
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onVerifyPasswordChanged = this.onVerifyPasswordChanged.bind(this);
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onClickRegisterButton = this.onClickRegisterButton.bind(this);
  }

  onUserIDChanged({ target: { value: userID } }) {
    this.setState(prevState => ({
      ...prevState,
      userID,
    }));
  }

  onPasswordChanged({ target: { value: password } }) {
    this.setState(prevState => ({
      ...prevState,
      password,
    }));
  }

  onVerifyPasswordChanged({ target: { value: verifyPassword } }) {
    this.setState(prevState => ({
      ...prevState,
      verifyPassword,
    }));
  }

  onNameChanged({ target: { value: name } }) {
    this.setState(prevState => ({
      ...prevState,
      name,
    }));
  }

  onClickRegisterButton() {
    const { onRegister } = this.props;
    const { userID, password, verifyPassword, name } = this.state;
    if (password === verifyPassword) {
      onRegister(userID, name, password);
    } else {
      this.setState(prevState => ({
        ...prevState,
        password: '',
        verifyPassword: '',
      }));
    }
  }

  render() {
    const { onSwitchToLogin } = this.props;
    return (
      <div className="overlay-wrapper overlay-wrapper__full">
        <div className="overlay overlay--title">註冊</div>
        <div className="overlay overlay--input__full">
          <TextField
            style={styles.textField}
            inputStyle={styles.input}
            hintText={'請輸入帳號'}
            underlineStyle={styles.underline}
            underlineFocusStyle={styles.underline}
            hintStyle={styles.hint}
            onChange={this.onUserIDChanged}
          />
          <TextField
            style={styles.textField}
            inputStyle={styles.input}
            hintText={'請輸入密碼'}
            underlineStyle={styles.underline}
            underlineFocusStyle={styles.underline}
            hintStyle={styles.hint}
            onChange={this.onPasswordChanged}
          />
          <TextField
            style={styles.textField}
            inputStyle={styles.input}
            hintText={'請重複輸入密碼'}
            underlineStyle={styles.underline}
            underlineFocusStyle={styles.underline}
            hintStyle={styles.hint}
            onChange={this.onVerifyPasswordChanged}
          />
          <TextField
            style={styles.textField}
            inputStyle={styles.input}
            hintText={'請輸入使用者名稱'}
            underlineStyle={styles.underline}
            underlineFocusStyle={styles.underline}
            hintStyle={styles.hint}
            onChange={this.onNameChanged}
          />
          <div className="overlay--button-wrapper">
            <RaisedButton size={'large'} onClick={this.onClickRegisterButton}>
              註冊
            </RaisedButton>
          </div>
        </div>
        <div className="overlay overlay--breadcrumb">
          <FlatButton primary onClick={onSwitchToLogin}>
            登入
          </FlatButton>
        </div>
      </div>
    );
  }
}

RegisterOverlay.propTypes = {
  onRegister: PropTypes.func,
  onSwitchToLogin: PropTypes.func,
};

RegisterOverlay.defaultProps = {
  onRegister: () => {},
  onSwitchToLogin: () => {},
};

export default RegisterOverlay;
