/* eslint-disable max-len */
import React, { Component } from 'react';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { FloatingActionButton } from 'material-ui';
import { Tabs, Tab } from 'material-ui/Tabs';
import AppConfig from '../const/AppConfig.const';
import OWN_STICKERS_QUERY from '../graphql/ownStickers.query.js';
import OWN_TAGS_QUERY from '../graphql/ownTags.query.js';
import UPLOAD_STICKERS_MUTATION from '../graphql/uploadStickers.mutation';
import verifyImageFile from '../util/verifyImageFile.func';
import verifyFileDes from '../util/verifyFileDes.func';
import ApolloClientManager from '../util/ApolloClientManager.class';
import LoadingOverlay from '../components/LoadingOverlay.component';
import DescribingOverlay from '../components/DescribingOverlay.component';
import ImageGridList from '../components/ImageGridList.component';
import Dropzone from '../components/Dropzone.component';
import EditStickerBtn from '../components/EditStickerBtn.component';
import EditTagBtn from '../components/EditTagBtn.component';
import UPDATE_STICKERS_MUTATION from '../graphql/updateSticker.mutation';
import KICK_SUBSCRIBERS_MUTATION from '../graphql/kickSubscribers.mutation.js';

const TABS = {
  OWNSTICKERS: 'OWNSTICKERS',
  OWNTAGS: 'OWNTAGS',
};

class MyBoxPage extends Component {
  constructor() {
    super();
    this.state = {
      appStatus: AppConfig.APP_STATUS.READY,
      uploadFileDes: '',
      tileData: [],
      tagData: [],
      copyrightAgree: false,
      tab: TABS.OWNSTICKERS,
    };

    this.loadTimeout = undefined;
    this.infoTimeout = undefined;
    this.uploadFile = {};

    this.onSwitchToOwnStickers = this.onSwitchToOwnStickers.bind(this);
    this.onSwitchToOwnTags = this.onSwitchToOwnTags.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onUploadFileDesChanged = this.onUploadFileDesChanged.bind(this);
    this.onCopyrightCheckboxChanged = this.onCopyrightCheckboxChanged.bind(this);
    this.onFileDroppedIn = this.onFileDroppedIn.bind(this);
    this.setLoadTimeout = this.setLoadTimeout.bind(this);
    this.ownStickersQuery = this.ownStickersQuery.bind(this);
    this.verifyDesAndCopyright = this.verifyDesAndCopyright.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.exitOverlay = this.exitOverlay.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.updateSticker = this.updateSticker.bind(this);
  }

  componentDidMount() {
    this.ownStickersQuery();
  }

  onSwitchToOwnStickers() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.OWN_STICKERS,
    }));
  }

  onSwitchToOwnTags() {
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.OWN_TAGS,
    }));
  }

  onImageLoaded() {
    if (this.loadTimeout !== undefined) {
      clearTimeout(this.loadTimeout);
    }
    this.setLoadTimeout();
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

  ownStickersQuery() {
    const { showInfo, user: { userID } } = this.props;
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout(AppConfig.APP_STATUS.READY);
    ApolloClientManager.makeQuery(
      OWN_STICKERS_QUERY,
      {
        ownerID: userID,
      },
      ({ data: { ownStickers: stickerList } }) => {
        this.setState(prevState => ({
          ...prevState,
          tileData: stickerList.map(({ stickerID, type, tagIDs, description }) => ({
            img: `${AppConfig.SERVER_URL.HTTP}/imgs/${stickerID}.${type}`,
            title: description,
            cols: 1,
            actionIcon: (
              <EditStickerBtn
                stickerID={stickerID}
                updateSticker={this.updateSticker}
                tagIDs={tagIDs}
                description={description}
              />
            ),
          })),
        }));
      },
      (error) => {
        console.error('Error:', error);
        showInfo('網路連不上', true);
      },
    );
  }

  updateSticker(sticker, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    const { stickerID, description, tagIDs } = sticker;
    if (description) {
      try {
        verifyFileDes(description);
      } catch (err) {
        showInfo(`檔案敘述有問題：${err.message}`, true);
        return;
      }
    }
    ApolloClientManager.makeMutation(
      UPDATE_STICKERS_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          stickerID,
          description,
          tagIDs,
        },
      },
      ({ data: { updateSticker: { success, message } } }) => {
        if (success) {
          showInfo('儲存成功', false);
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

  updateTag(tag, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    const { tagID, kickUserIDs } = tag;
    ApolloClientManager.makeMutation(
      KICK_SUBSCRIBERS_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          tagID,
          kickUserIDs,
        },
      },
      ({ data: { kickSubscribers: { success, message } } }) => {
        if (success) {
          showInfo('用戶踢除成功', false);
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

  ownTagsQuery() {
    const { user, showInfo } = this.props;
    ApolloClientManager.makeQuery(
      OWN_TAGS_QUERY,
      {
        ownerID: user.userID,
      },
      ({ data: { ownTags: tagList } }) => {
        this.setState(prevState => ({
          ...prevState,
          tagData: tagList,
        }));
      },
      (error) => {
        console.error('Error:', error);
        showInfo('網路連不上', true);
      },
    );
  }

  handleTabChange(value) {
    this.setState({
      tab: value,
    });
    if (value === TABS.OWNTAGS) {
      this.ownTagsQuery();
    }
  }

  render() {
    const { appStatus, tileData, tagData } = this.state;
    const { onSwitchPage } = this.props;
    return (
      <div className={'page-wrapper'}>
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
        <Tabs
          className={'page-tabs'}
          value={this.state.tab}
          onChange={this.handleTabChange}
        >
          <Tab
            label="My stickers"
            value={TABS.OWNSTICKERS}
          >
            <Dropzone onDrop={this.onFileDroppedIn}>
              <ImageGridList
                tileData={tileData}
                onImageLoaded={this.onImageLoaded}
              />
            </Dropzone>
          </Tab>
          <Tab
            className={'page-tab'}
            label="My tags"
            value={TABS.OWNTAGS}
          >
            {tagData.map(({ tagID, key, subscriberIDs }) => (
              <EditTagBtn
                tagID={tagID}
                key={tagID}
                tagKey={key}
                subscriberIDs={subscriberIDs}
                updateTag={this.updateTag}
              />
            ))}
          </Tab>
        </Tabs>
        <div className="overlay overlay--breadcrumb">
          <FloatingActionButton onClick={() => { onSwitchPage(AppConfig.PAGES.SEARCH); }}>
            <i className="fas fa-search" />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

MyBoxPage.propTypes = {
  user: PropTypes.shape({
    userID: PropTypes.string,
    name: PropTypes.string,
    sessionID: PropTypes.string,
  }),
  onSwitchPage: PropTypes.func,
  showInfo: PropTypes.func,
};

MyBoxPage.defaultProps = {
  user: {
    userID: '',
    name: '',
    sessionID: '',
  },
  onSwitchPage: () => {},
  showInfo: () => {},
};

export default MyBoxPage;
