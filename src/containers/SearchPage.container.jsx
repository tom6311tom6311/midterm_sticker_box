/* eslint-disable max-len */
import React, { Component } from 'react';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';
import { FloatingActionButton } from 'material-ui';
import AppConfig from '../const/AppConfig.const';
import IMG_SEARCH_QUERY from '../graphql/imgSearch.query.js';
import verifyImageFile from '../util/verifyImageFile.func';
import verifyFileName from '../util/verifyFileName.func';
import ApolloClientManager from '../util/ApolloClientManager.class';
import SearchBar from '../components/SearchBar.component';
import LoadingOverlay from '../components/LoadingOverlay.component';
import RenamingOverlay from '../components/RenamingOverlay.component';
import ImageGridList from '../components/ImageGridList.component';
import Dropzone from '../components/Dropzone.component';

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      appStatus: AppConfig.APP_STATUS.READY,
      searchTerm: '',
      uploadFileName: '',
      tileData: [],
      copyrightAgree: false,
    };

    this.loadTimeout = undefined;
    this.infoTimeout = undefined;
    this.uploadFile = {};

    this.onSearchTermChanged = this.onSearchTermChanged.bind(this);
    this.onUploadFileNameChanged = this.onUploadFileNameChanged.bind(this);
    this.onCopyrightCheckboxChanged = this.onCopyrightCheckboxChanged.bind(this);
    this.onFileDroppedIn = this.onFileDroppedIn.bind(this);
    this.setLoadTimeout = this.setLoadTimeout.bind(this);
    this.makeQuery = this.makeQuery.bind(this);
    this.verifyNameAndCopyright = this.verifyNameAndCopyright.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.exitOverlay = this.exitOverlay.bind(this);
  }

  componentDidMount() {
    this.makeQuery();
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
    const { showInfo } = this.props;
    let errorMessage = '';
    try {
      verifyImageFile(files[0]);
    } catch (err) {
      console.error(err);
      errorMessage = err.message;
      showInfo(`圖檔有問題：${errorMessage}`, true);
    }
    if (errorMessage === '') {
      this.setState(prevState => ({
        ...prevState,
        appStatus: AppConfig.APP_STATUS.RENAMING,
      }));
      this.uploadFile = files[0];
    }
  }

  setLoadTimeout(finishAppStatus) {
    this.loadTimeout = setTimeout(() => {
      this.setState(prevState => ({
        ...prevState,
        appStatus: finishAppStatus,
        uploadFileName: '',
        copyrightAgree: false,
      }));
    }, AppConfig.LOAD_TIMEOUT);
  }

  makeQuery() {
    const { showInfo } = this.props;
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout(AppConfig.APP_STATUS.READY);
    ApolloClientManager.makeQuery(
      IMG_SEARCH_QUERY,
      {
        searchTerm: this.state.searchTerm,
      },
      ({ data: { imgSearch: stickerList } }) => {
        this.setState(prevState => ({
          ...prevState,
          tileData: stickerList.map(({ stickerID, type, description }) => ({
            img: `${AppConfig.SERVER_URL.HTTP}/imgs/${stickerID}.${type}`,
            title: description,
            cols: 1,
          })),
        }));
      },
      (error) => {
        console.error('Error:', error);
        showInfo('網路連不上', true);
      },
    );
  }

  verifyNameAndCopyright() {
    const { showInfo } = this.props;
    let errorMessage = '';
    try {
      verifyFileName(this.state.uploadFileName);
    } catch (err) {
      console.error(err);
      errorMessage = err.message;
      showInfo(`檔名有問題：${errorMessage}`, true);
    }
    if (!this.state.copyrightAgree) {
      errorMessage = 'COPYRIGHT_NOT_AGREE';
      showInfo('您必須確保沒版權問題才能上傳', true);
    }
    if (errorMessage === '') {
      this.compressImage();
    }
  }

  compressImage() {
    const { showInfo } = this.props;
    showInfo('檔案壓縮中', false);
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
        showInfo(`壓縮出問題：${error}`, true);
      },
    });
  }

  uploadImage() {
    const { showInfo } = this.props;
    showInfo('檔案上傳中', false);
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
          showInfo('檔案上傳成功！', false);
        } else {
          showInfo('檔案上傳失敗', true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        showInfo('檔案上傳失敗', true);
      });
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
    const { onSwitchPage } = this.props;
    const { appStatus, tileData } = this.state;
    return (
      <div className={'page-wrapper'}>
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
        <Dropzone onDrop={this.onFileDroppedIn}>
          <ImageGridList
            tileData={tileData}
            onImageLoaded={this.onImageLoaded}
          />
        </Dropzone>
        <div className="overlay overlay--breadcrumb">
          <FloatingActionButton onClick={() => { onSwitchPage(AppConfig.PAGES.MY_BOX); }}>
            <i className="fas fa-folder-open" />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

SearchPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  onSwitchPage: PropTypes.func,
  showInfo: PropTypes.func,
};

SearchPage.defaultProps = {
  user: {
    name: '',
  },
  onSwitchPage: () => {},
  showInfo: () => {},
};

export default SearchPage;
