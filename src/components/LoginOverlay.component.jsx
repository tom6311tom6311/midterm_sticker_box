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

class LoginOverlay extends Component {
  constructor() {
    super();
    this.state = {
      userID: '',
      password: '',
    };
    this.onUserIDChanged = this.onUserIDChanged.bind(this);
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onClickLoginButton = this.onClickLoginButton.bind(this);
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

  onClickLoginButton() {
    const { onLogin } = this.props;
    const { userID, password } = this.state;
    onLogin(userID, password);
  }

  render() {
    const { onLogin, onSwitchToRegister } = this.props;
    return (
      <div className="overlay-wrapper overlay-wrapper__full">
        <div className="overlay overlay--title">登入</div>
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
          <div className="overlay--button-wrapper">
            <RaisedButton size={'large'} onClick={this.onClickLoginButton}>
              登入
            </RaisedButton>
          </div>
        </div>
        <div className="overlay overlay--breadcrumb">
          <FlatButton primary={true} onClick={onSwitchToRegister}>
            註冊
          </FlatButton>
        </div>
      </div>
    );
  }
}

LoginOverlay.propTypes = {
  onLogin: PropTypes.func,
  onSwitchToRegister: PropTypes.func,
};

LoginOverlay.defaultProps = {
  onLogin: () => {},
  onSwitchToRegister: () => {},
};

export default LoginOverlay;
