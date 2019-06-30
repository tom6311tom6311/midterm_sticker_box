/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppConfig from '../const/AppConfig.const';
import REGISTER_MUTATION from '../graphql/register.mutation.js';
import ApolloClientManager from '../util/ApolloClientManager.class';
import InfoBand from '../components/InfoBand.component';

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

class RegisterPage extends Component {
  constructor() {
    super();
    this.state = {
      userID: '',
      password: '',
      verifyPassword: '',
      name: '',
    };

    this.infoTimeout = undefined;

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
    const { showInfo } = this.props;
    const { userID, password, verifyPassword, name } = this.state;
    if (password !== verifyPassword) {
      this.setState(prevState => ({
        ...prevState,
        password: '',
        verifyPassword: '',
      }));
      showInfo('密碼兩次打得不一樣喔', true);
    } else {
      ApolloClientManager.makeMutation(
        REGISTER_MUTATION,
        {
          arg: {
            userID,
            name,
            password,
          },
        },
        ({ data: { register: { success, message, sessionID } } }) => {
          if (success) {
            showInfo('註冊成功，直接登入', false);
            const { onLoginSuccess, onSwitchPage } = this.props;
            onLoginSuccess({
              name,
              userID,
              sessionID,
            });
            onSwitchPage(AppConfig.PAGES.SEARCH);
          } else {
            showInfo(message, true);
          }
        },
        (error) => {
          console.error('Error:', error);
          showInfo('網路連不上', true);
        },
      );
    }
  }


  render() {
    const { onSwitchPage } = this.props;
    const { infoText, isErrorInfo } = this.state;
    return (
      <div className="page-wrapper">
        <InfoBand infoText={infoText} isError={isErrorInfo} />
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
          <TextField
            style={styles.textField}
            inputStyle={styles.input}
            type={'password'}
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
          <FlatButton primary onClick={() => { onSwitchPage(AppConfig.PAGES.LOGIN); }}>
            登入
          </FlatButton>
        </div>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  onSwitchPage: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  showInfo: PropTypes.func,
};

RegisterPage.defaultProps = {
  onSwitchPage: () => {},
  onLoginSuccess: () => {},
  showInfo: () => {},
};

export default RegisterPage;
