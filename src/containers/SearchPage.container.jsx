/* eslint-disable max-len */
import React, { Component } from 'react';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { FloatingActionButton } from 'material-ui';
import AppConfig from '../const/AppConfig.const';
import IMG_SEARCH_QUERY from '../graphql/imgSearch.query.js';
import UPLOAD_STICKERS_MUTATION from '../graphql/uploadStickers.mutation';
import SUBSCRIBE_TAG_MUTATION from '../graphql/subscribeTag.mutation';
import verifyImageFile from '../util/verifyImageFile.func';
import verifyFileDes from '../util/verifyFileDes.func';
import ApolloClientManager from '../util/ApolloClientManager.class';
import SearchBar from '../components/SearchBar.component';
import LoadingOverlay from '../components/LoadingOverlay.component';
import DescribingOverlay from '../components/DescribingOverlay.component';
import ImageGridList from '../components/ImageGridList.component';
import Dropzone from '../components/Dropzone.component';

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      appStatus: AppConfig.APP_STATUS.READY,
      uploadFileDes: '',
      tileData: [],
      copyrightAgree: false,
    };

    this.loadTimeout = undefined;
    this.infoTimeout = undefined;
    this.uploadFile = {};

    this.onUploadFileDesChanged = this.onUploadFileDesChanged.bind(this);
    this.onCopyrightCheckboxChanged = this.onCopyrightCheckboxChanged.bind(this);
    this.onFileDroppedIn = this.onFileDroppedIn.bind(this);
    this.setLoadTimeout = this.setLoadTimeout.bind(this);
    this.makeImgSearchQuery = this.makeImgSearchQuery.bind(this);
    this.makeSubscribeMutation = this.makeSubscribeMutation.bind(this);
    this.verifyDesAndCopyright = this.verifyDesAndCopyright.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.exitOverlay = this.exitOverlay.bind(this);
  }

  componentDidMount() {
    this.makeImgSearchQuery();
  }

  onUploadFileDesChanged({ target: { value: uploadFileDes } }) {
    this.setState(prevState => ({
      ...prevState,
      uploadFileDes,
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
        appStatus: AppConfig.APP_STATUS.DESCRIBING,
      }));
      this.uploadFile = files[0];
    }
  }

  setLoadTimeout(finishAppStatus) {
    this.loadTimeout = setTimeout(() => {
      this.setState(prevState => ({
        ...prevState,
        appStatus: finishAppStatus,
        uploadFileDes: '',
        copyrightAgree: false,
      }));
    }, AppConfig.LOAD_TIMEOUT);
  }

  makeImgSearchQuery(searchTerm) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout(AppConfig.APP_STATUS.READY);
    ApolloClientManager.makeQuery(
      IMG_SEARCH_QUERY,
      {
        arg: {
          userID,
          sessionID,
          searchTerm: searchTerm || '',
        },
      },
      ({ data: { imgSearch: { success, message, searchResult } } }) => {
        if (success) {
          this.setState(prevState => ({
            ...prevState,
            tileData: searchResult.map(({ tagID, tagKey, stickers }) => ({
              tagID,
              tagKey,
              imgGridData: stickers.map(({ stickerID, type, description }) => ({
                img: `${AppConfig.SERVER_URL.HTTP}/imgs/${stickerID}.${type}`,
                title: description,
                cols: 1,
              })),
            })),
          }));
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

  makeSubscribeMutation(tagID, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout(AppConfig.APP_STATUS.READY);
    ApolloClientManager.makeMutation(
      SUBSCRIBE_TAG_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          tagID,
        },
      },
      ({ data: { subscribeTag: { success, message } } }) => {
        if (success) {
          showInfo('訂閱成功', false);
          callback();
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

  verifyDesAndCopyright() {
    const { showInfo } = this.props;
    let errorMessage = '';
    try {
      verifyFileDes(this.state.uploadFileDes);
    } catch (err) {
      console.error(err);
      errorMessage = err.message;
      showInfo(`檔案敘述有問題：${errorMessage}`, true);
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
        const stickerID = uuid();
        // eslint-disable-next-line no-undef
        this.uploadFile = new File(
          [compressedBlob],
          `${stickerID}.${this.uploadFile.type.substr(this.uploadFile.type.length - 3)}`,
          {
            type: this.uploadFile.type,
            path: this.uploadFile.path,
          },
        );
        this.uploadImage(stickerID);
      },
      error: (error) => {
        console.error('Error:', error);
        showInfo(`壓縮出問題：${error}`, true);
      },
    });
  }

  uploadImage(stickerID) {
    const { showInfo, user } = this.props;
    const { uploadFileDes } = this.state;
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
      `${AppConfig.SERVER_URL.HTTP}/imgs/`,
      {
        method: 'POST',
        body: data,
      },
    )
      .then(res => res.json())
      .then(({ status }) => {
        if (status === 'OK') {
          showInfo('檔案上傳成功！', false);
          ApolloClientManager.makeMutation(
            UPLOAD_STICKERS_MUTATION,
            {
              arg: {
                userID: user.userID,
                sessionID: user.sessionID,
                stickerID,
                description: uploadFileDes,
                type: `${this.uploadFile.type.substr(this.uploadFile.type.length - 3)}`,
              },
            },
            ({ data: { uploadSticker: { success, message } } }) => {
              if (success) {
                showInfo('資料庫更新成功', false);
              } else {
                showInfo(message, true);
              }
            },
            (error) => {
              console.error('Error:', error);
              showInfo('資料庫更新過程網路連不上', true);
            },
          );
        } else {
          showInfo('檔案上傳失敗', true);
        }
        this.setState(prevState => ({
          ...prevState,
          appStatus: AppConfig.APP_STATUS.READY,
          uploadFileDes: '',
          copyrightAgree: false,
        }));
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
      uploadFileDes: '',
      copyrightAgree: false,
    }));
  }

  render() {
    const { onSwitchPage } = this.props;
    const { appStatus, tileData } = this.state;
    return (
      <div className={'page-wrapper'}>
        <SearchBar
          onSearch={this.makeImgSearchQuery}
          onSubscribe={this.makeSubscribeMutation}
        />
        { appStatus === AppConfig.APP_STATUS.LOADING ? <LoadingOverlay /> : '' }
        {
          appStatus === AppConfig.APP_STATUS.DESCRIBING ?
            <DescribingOverlay
              onDesChange={this.onUploadFileDesChanged}
              onCheckboxChange={this.onCopyrightCheckboxChanged}
              onSubmit={this.verifyDesAndCopyright}
              onExit={this.exitOverlay}
            /> :
            ''
        }
        <Dropzone onDrop={this.onFileDroppedIn}>
          <div style={{ width: '600px', height: '620px', overflow: 'auto' }}>
            {tileData.map(({ tagKey, imgGridData }) => (
              <div style={{ width: '100%' }}>
                <h3 style={{ marginLeft: '8px', color: '#666' }}>{`#${tagKey}`}</h3>
                <ImageGridList
                  tileData={imgGridData}
                  onImageLoaded={this.onImageLoaded}
                />
              </div>
            ))}
          </div>
        </Dropzone>
        <div className="overlay overlay--breadcrumb">
          <FloatingActionButton onClick={() => { onSwitchPage(AppConfig.PAGES.MY_BOX); }} tooltip="我的空間">
            <i className="fas fa-folder-open" />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

SearchPage.propTypes = {
  user: PropTypes.shape({
    userID: PropTypes.string,
    name: PropTypes.string,
    sessionID: PropTypes.string,
  }),
  onSwitchPage: PropTypes.func,
  showInfo: PropTypes.func,
};

SearchPage.defaultProps = {
  user: {
    userID: '',
    name: '',
    sessionID: '',
  },
  onSwitchPage: () => {},
  showInfo: () => {},
};

export default SearchPage;
