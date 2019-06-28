/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloClient } from 'apollo-boost';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppConfig from '../const/AppConfig.const';
import ApolloClientManager from '../util/ApolloClientManager.class';
import LoginPage from './LoginPage.container';
import RegisterPage from './RegisterPage.container';
import SearchPage from './SearchPage.container';
import MyBoxPage from './MyBoxPage.container';
import InfoBand from '../components/InfoBand.component';


class Main extends Component {
  constructor() {
    super();
    this.state = {
      page: AppConfig.PAGES.LOGIN,
      user: {
        userID: '',
        name: '',
        sessionID: '',
      },
      infoText: '',
      isErrorInfo: false,
    };
    this.onSwitchPage = this.onSwitchPage.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.showInfo = this.showInfo.bind(this);
  }

  componentDidMount() {
    const { apolloClient } = this.props;
    ApolloClientManager.updateClient(apolloClient);
  }

  onSwitchPage(toPage) {
    this.setState(prevState => ({
      ...prevState,
      page: toPage,
    }));
  }

  onLoginSuccess({
    name,
    userID,
    ownTagIDs,
    subscribedTagIDs,
    sessionID,
  }) {
    this.setState(prevState => ({
      ...prevState,
      user: {
        ...prevState.user,
        name,
        userID,
        ownTagIDs,
        subscribedTagIDs,
        sessionID,
      },
    }));
  }

  showInfo(infoText, isErrorInfo) {
    this.setState(prevState => ({
      ...prevState,
      infoText,
      isErrorInfo,
    }));
    if (this.infoTimeout !== undefined) {
      clearTimeout(this.infoTimeout);
    }
    this.infoTimeout = setTimeout(() => {
      this.setState(prevState => ({
        ...prevState,
        infoText: '',
        isErrorInfo: false,
      }));
      this.infoTimeout = undefined;
    }, AppConfig.INFO_TIMEOUT);
  }

  render() {
    const { user, page, infoText, isErrorInfo } = this.state;
    let pageComponent = <div />;
    switch (page) {
      case AppConfig.PAGES.LOGIN:
        pageComponent = <LoginPage onSwitchPage={this.onSwitchPage} onLoginSuccess={this.onLoginSuccess} showInfo={this.showInfo} />;
        break;
      case AppConfig.PAGES.REGISTER:
        pageComponent = <RegisterPage onSwitchPage={this.onSwitchPage} onLoginSuccess={this.onLoginSuccess} showInfo={this.showInfo} />;
        break;
      case AppConfig.PAGES.SEARCH:
        pageComponent = <SearchPage onSwitchPage={this.onSwitchPage} user={user} showInfo={this.showInfo} />;
        break;
      case AppConfig.PAGES.MY_BOX:
        pageComponent = <MyBoxPage onSwitchPage={this.onSwitchPage} user={user} showInfo={this.showInfo} />;
        break;
      default:
        pageComponent = <div />;
        break;
    }
    return (
      <MuiThemeProvider>
        <div className={'main'}>
          <InfoBand infoText={infoText} isError={isErrorInfo} />
          {pageComponent}
        </div>
      </MuiThemeProvider>
    );
  }
}

Main.propTypes = {
  apolloClient: PropTypes.instanceOf(ApolloClient),
};

Main.defaultProps = {
  apolloClient: {},
};

export default Main;
