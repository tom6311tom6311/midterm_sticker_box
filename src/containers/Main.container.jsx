import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';
import { ApolloClient } from 'apollo-boost';
import IMG_SEARCH_QUERY from '../graphql/imgSearch.query.js';
import LoginOverlay from '../components/LoginOverlay.component';
import RegisterOverlay from '../components/RegisterOverlay.component';
import SearchBar from '../components/SearchBar.component';
import LoadingOverlay from '../components/LoadingOverlay.component';
import RenamingOverlay from '../components/RenamingOverlay.component';
import InfoBand from '../components/InfoBand.component';
import ImageGridList from '../components/ImageGridList.component';
import AppConfig from '../const/AppConfig.const';
import Dropzone from '../components/Dropzone.component';
import verifyImageFile from '../util/verifyImageFile.func';
import verifyFileName from '../util/verifyFileName.func';
import LOGIN_MUTATION from '../graphql/login.mutation.js';
import REGISTER_MUTATION from '../graphql/register.mutation';

const mainContainerStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

class Main extends Component {
  constructor() {
    super();
    this.state = {
      appStatus: AppConfig.APP_STATUS.LOGIN,
      userID: '',
      infoText: '',
      isErrorInfo: false,
      searchTerm: '',
      uploadFileName: '',
      tileData: [],
      copyrightAgree: false,
    };

    this.loadTimeout = undefined;
    this.infoTimeout = undefined;
    this.uploadFile = {};

    this.onLogin = this.onLogin.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.onSwitchToRegister = this.onSwitchToRegister.bind(this);
    this.onSwitchToLogin = this.onSwitchToLogin.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onSearchTermChanged = this.onSearchTermChanged.bind(this);
    this.onUploadFileNameChanged = this.onUploadFileNameChanged.bind(this);
    this.onCopyrightCheckboxChanged = this.onCopyrightCheckboxChanged.bind(this);
    this.onFileDroppedIn = this.onFileDroppedIn.bind(this);
    this.setLoadTimeout = this.setLoadTimeout.bind(this);
    this.makeQuery = this.makeQuery.bind(this);
    this.verifyNameAndCopyright = this.verifyNameAndCopyright.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.exitOverlay = this.exitOverlay.bind(this);
  }

  componentDidMount() {
    // this.makeQuery();
  }

  onLogin(userID, password) {
    const { apolloClient } = this.props;
    apolloClient
      .mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          arg: {
            userID,
            password,
          },
        },
      })
      .then(({ data: { login: { success, message } } }) => {
        if (success) {
          this.setState(prevState => ({
            ...prevState,
            userID,
          }));
          this.makeQuery();
        } else {
          this.showInfo(message, true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.showInfo('網路連不上', true);
      });
  }

  onRegister(userID, name, password) {
    const { apolloClient } = this.props;
    apolloClient
    .mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        userID,
        name,
        password,
      },
    })
    .then(({ data: { success, message } }) => {
      if (success) {
        this.setState(prevState => ({
          ...prevState,
          userID,
        }));
        this.makeQuery();
      } else {
        this.showInfo(message, true);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      this.showInfo('網路連不上', true);
    });
  }

  onSwitchToRegister() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.REGISTER,
    }));
  }

  onSwitchToLogin() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOGIN,
    }));
  }

  onImageLoaded() {
    if (this.loadTimeout !== undefined) {
      clearTimeout(this.loadTimeout);
    }
    this.setLoadTimeout();
  }

  onSearchTermChanged({ target: { value: searchTerm } }) {
    this.setState(prevState => ({
      ...prevState,
      searchTerm,
    }));
  }

  onUploadFileNameChanged({ target: { value: uploadFileName } }) {
    this.setState(prevState => ({
      ...prevState,
      uploadFileName,
    }));
  }

  onCopyrightCheckboxChanged({ target: { checked: copyrightAgree } }) {
    this.setState(prevState => ({
      ...prevState,
      copyrightAgree,
    }));
  }

  onFileDroppedIn(files) {
    let errorMessage = '';
    try {
      verifyImageFile(files[0]);
    } catch (err) {
      console.error(err);
      errorMessage = err.message;
      this.showInfo(`圖檔有問題：${errorMessage}`, true);
    }
    if (errorMessage === '') {
      this.setState(prevState => ({
        ...prevState,
        appStatus: AppConfig.APP_STATUS.RENAMING,
      }));
      this.uploadFile = files[0];
    }
  }

  setLoadTimeout() {
    this.loadTimeout = setTimeout(() => {
      this.setState(prevState => ({
        ...prevState,
        appStatus: AppConfig.APP_STATUS.READY,
        uploadFileName: '',
        copyrightAgree: false,
      }));
    }, AppConfig.LOAD_TIMEOUT);
  }

  makeQuery() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout();
    const { apolloClient } = this.props;
    apolloClient
      .query({
        query: IMG_SEARCH_QUERY,
        variables: {
          searchTerm: this.state.searchTerm,
        },
      })
      .then(({ data: { imgSearch: stickerList } }) => {
        this.setState(prevState => ({
          ...prevState,
          tileData: stickerList.map(({ stickerID, type, description }) => ({
            img: `${AppConfig.SERVER_URL.HTTP}/imgs/${stickerID}.${type}`,
            title: description,
            cols: 1,
          })),
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
        this.showInfo('網路連不上', true);
      });
  }

  verifyNameAndCopyright() {
    let errorMessage = '';
    try {
      verifyFileName(this.state.uploadFileName);
    } catch (err) {
      console.error(err);
      errorMessage = err.message;
      this.showInfo(`檔名有問題：${errorMessage}`, true);
    }
    if (!this.state.copyrightAgree) {
      errorMessage = 'COPYRIGHT_NOT_AGREE';
      this.showInfo('您必須確保沒版權問題才能上傳', true);
    }
    if (errorMessage === '') {
      this.compressImage();
    }
  }

  compressImage() {
    this.showInfo('檔案壓縮中', false);
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.COMPRESSING,
    }));
    // eslint-disable-next-line no-new
    new Compressor(this.uploadFile, {
      quality: AppConfig.COMPRESS_QUALITY,
      success: (compressedBlob) => {
        // eslint-disable-next-line no-undef
        // eslint-disable-next-line no-undef
        this.uploadFile = new File(
          [compressedBlob],
          `${this.state.uploadFileName}.${this.uploadFile.type.substr(this.uploadFile.type.length - 3)}`,
          {
            type: this.uploadFile.type,
            path: this.uploadFile.path,
          },
        );
        this.uploadImage();
      },
      error: (error) => {
        console.error('Error:', error);
        this.showInfo(`壓縮出問題：${error}`, true);
      },
    });
  }

  uploadImage() {
    this.showInfo('檔案上傳中', false);
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.UPLOADING,
    }));
    this.setLoadTimeout();

    // eslint-disable-next-line no-undef
    const data = new FormData();
    data.append('newImg', this.uploadFile);
    // eslint-disable-next-line no-undef
    fetch(
      `${AppConfig.SERVER_URL}/imgs/`,
      {
        method: 'POST',
        body: data,
      },
    )
      .then(res => res.json())
      .then(({ status }) => {
        this.setState(prevState => ({
          ...prevState,
          appStatus: AppConfig.APP_STATUS.READY,
          uploadFileName: '',
          copyrightAgree: false,
        }));
        if (status === 'OK') {
          this.showInfo('檔案上傳成功！', false);
        } else {
          this.showInfo('檔案上傳失敗', true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.showInfo('檔案上傳失敗', true);
      });
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

  exitOverlay() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.READY,
      uploadFileName: '',
      copyrightAgree: false,
    }));
  }

  render() {
    const { appStatus, infoText, isErrorInfo, tileData } = this.state;
    return (
      <MuiThemeProvider>
        <div style={mainContainerStyle}>
          { appStatus === AppConfig.APP_STATUS.LOGIN ? <LoginOverlay onLogin={(userID, password) => this.onLogin(userID, password)} onSwitchToRegister={this.onSwitchToRegister} /> : '' }
          { appStatus === AppConfig.APP_STATUS.REGISTER ? <RegisterOverlay onRegister={this.onRegister} onSwitchToLogin={this.onSwitchToLogin} /> : '' }
          <SearchBar
            onChange={this.onSearchTermChanged}
            onSubmit={this.makeQuery}
          />
          { appStatus === AppConfig.APP_STATUS.LOADING ? <LoadingOverlay /> : '' }
          {
            appStatus === AppConfig.APP_STATUS.RENAMING ?
              <RenamingOverlay
                onNameChange={this.onUploadFileNameChanged}
                onCheckboxChange={this.onCopyrightCheckboxChanged}
                onSubmit={this.verifyNameAndCopyright}
                onExit={this.exitOverlay}
              /> :
              ''
          }
          <InfoBand infoText={infoText} isError={isErrorInfo} />
          <Dropzone onDrop={this.onFileDroppedIn}>
            <ImageGridList
              tileData={tileData}
              onImageLoaded={this.onImageLoaded}
            />
          </Dropzone>
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
