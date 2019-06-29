/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppConfig from '../const/AppConfig.const';
import LOGIN_MUTATION from '../graphql/login.mutation.js';
import ApolloClientManager from '../util/ApolloClientManager.class.js';

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

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      userID: '',
      password: '',
    };

    this.infoTimeout = undefined;

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
    const { userID, password } = this.state;
    const { showInfo } = this.props;
    ApolloClientManager.makeMutation(
      LOGIN_MUTATION,
      {
        arg: {
          userID,
          password,
        },
      },
      ({ data: { login: loginResp } }) => {
        if (loginResp.success) {
          showInfo('登入成功', false);
          const { onLoginSuccess, onSwitchPage } = this.props;
          onLoginSuccess(loginResp);
          onSwitchPage(AppConfig.PAGES.SEARCH);
        } else {
          showInfo(loginResp.message, true);
        }
      },
      (error) => {
        console.error('Error:', error);
        showInfo('網路連不上', true);
      },
    );
  }

  render() {
    const { onSwitchPage } = this.props;
    return (
      <div className="page-wrapper">
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
            type={'password'}
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
          <FlatButton primary onClick={() => { onSwitchPage(AppConfig.PAGES.REGISTER); }}>
            註冊
          </FlatButton>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  onSwitchPage: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  showInfo: PropTypes.func,
};

LoginPage.defaultProps = {
  onSwitchPage: () => {},
  onLoginSuccess: () => {},
  showInfo: () => {},
};

export default LoginPage;
