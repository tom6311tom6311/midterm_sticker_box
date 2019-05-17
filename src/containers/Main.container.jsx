import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Compressor from 'compressorjs';
import SearchBar from '../components/SearchBar.component';
import LoadingOverlay from '../components/LoadingOverlay.component';
import RenamingOverlay from '../components/RenamingOverlay.component';
import InfoBand from '../components/InfoBand.component';
import ImageGridList from '../components/ImageGridList.component';
import AppConfig from '../const/AppConfig.const';
import Dropzone from '../components/Dropzone.component';
import verifyImageFile from '../util/verifyImageFile.func';
import verifyFileName from '../util/verifyFileName.func';

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
      appStatus: AppConfig.APP_STATUS.LOADING,
      infoText: '',
      isErrorInfo: false,
      searchTerm: '',
      uploadFileName: '',
      tileData: [],
    };

    this.loadTimeout = undefined;
    this.infoTimeout = undefined;
    this.uploadFile = {};

    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onSearchTermChanged = this.onSearchTermChanged.bind(this);
    this.onUploadFileNameChanged = this.onUploadFileNameChanged.bind(this);
    this.onFileDroppedIn = this.onFileDroppedIn.bind(this);
    this.setLoadTimeout = this.setLoadTimeout.bind(this);
    this.makeQuery = this.makeQuery.bind(this);
    this.verifyName = this.verifyName.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.showInfo = this.showInfo.bind(this);
  }

  componentDidMount() {
    this.makeQuery();
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
      }));
    }, AppConfig.LOAD_TIMEOUT);
  }

  makeQuery() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout();
    // eslint-disable-next-line no-undef
    fetch(`${AppConfig.SERVER_URL}/imgs?searchTerm=${this.state.searchTerm}`)
      .then(res => res.json())
      .then(({ imgList }) => {
        this.setState(prevState => ({
          ...prevState,
          tileData: imgList.map(name => ({
            img: `${AppConfig.SERVER_URL}/imgs/${name}`,
            title: name,
            cols: 1,
          })),
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
        this.showInfo('網路連不上', true);
      });
  }

  verifyName() {
    let errorMessage = '';
    try {
      verifyFileName(this.state.uploadFileName);
    } catch (err) {
      console.error(err);
      errorMessage = err.message;
      this.showInfo(`檔名有問題：${errorMessage}`, true);
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
        if (status === 'OK') {
          this.setState(prevState => ({
            ...prevState,
            appStatus: AppConfig.APP_STATUS.READY,
          }));
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

  render() {
    const { appStatus, infoText, isErrorInfo, tileData } = this.state;
    return (
      <MuiThemeProvider>
        <div style={mainContainerStyle}>
          <SearchBar
            onChange={this.onSearchTermChanged}
            onSubmit={this.makeQuery}
          />
          { appStatus === AppConfig.APP_STATUS.LOADING ? <LoadingOverlay /> : '' }
          { appStatus === AppConfig.APP_STATUS.RENAMING ? <RenamingOverlay onChange={this.onUploadFileNameChanged} onSubmit={this.verifyName} /> : '' }
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

export default Main;
