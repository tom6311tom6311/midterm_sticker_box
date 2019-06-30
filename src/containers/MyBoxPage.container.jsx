/* eslint-disable max-len */
import React, { Component } from 'react';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { FloatingActionButton } from 'material-ui';
import { Tabs, Tab } from 'material-ui/Tabs';
import AppConfig from '../const/AppConfig.const';
import OWN_STICKERS_AND_SUBSCRIBED_TAGS_QUERY from '../graphql/ownStickersAndSubscribedTags.query.js';
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
import DELETE_TAG_MUTATION from '../graphql/deleteTag.mutation';
import DELETE_STICKER_MUTATION from '../graphql/deleteSticker.mutation';
import CREATE_TAG_MUTATION from '../graphql/createTag.mutation';
import CANCEL_SUBSCRIBE_TAG_MUTATION from '../graphql/cancelSubscribeTag.mutation';
import CreateTagBtn from '../components/CreateTagBtn.component';
import EditSubscribedTagBtn from '../components/EditSubscribedTagBtn.component';

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
      ownTagData: [],
      subscribedTagData: [],
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
    this.ownStickersAndSubscribedTagsQuery = this.ownStickersAndSubscribedTagsQuery.bind(this);
    this.verifyDesAndCopyright = this.verifyDesAndCopyright.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.exitOverlay = this.exitOverlay.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.updateSticker = this.updateSticker.bind(this);
    this.deleteSticker = this.deleteSticker.bind(this);
    this.makeKickMutation = this.makeKickMutation.bind(this);
    this.makeDeleteTagMutation = this.makeDeleteTagMutation.bind(this);
    this.makeCreateTagMutation = this.makeCreateTagMutation.bind(this);
    this.makeCancelSubscribeMutation = this.makeCancelSubscribeMutation.bind(this);
  }

  componentDidMount() {
    this.ownStickersAndSubscribedTagsQuery();
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

  ownStickersAndSubscribedTagsQuery() {
    const { showInfo, user: { userID } } = this.props;
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout(AppConfig.APP_STATUS.READY);
    ApolloClientManager.makeQuery(
      OWN_STICKERS_AND_SUBSCRIBED_TAGS_QUERY,
      {
        userID,
      },
      ({ data: { ownStickers: stickerList, subscribedTags: subscribedTagData } }) => {
        this.setState(prevState => ({
          ...prevState,
          subscribedTagData,
          tileData: stickerList.map(({ stickerID, type, tags: stickerTags, description }) => ({
            img: `${AppConfig.SERVER_URL.HTTP}/imgs/${stickerID}.${type}`,
            title: description,
            cols: 1,
            actionIcon: (
              <EditStickerBtn
                stickerID={stickerID}
                updateSticker={this.updateSticker}
                deleteSticker={this.deleteSticker}
                stickerTags={stickerTags}
                allTags={subscribedTagData}
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
          this.ownStickersAndSubscribedTagsQuery();
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

  deleteSticker(stickerID, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    ApolloClientManager.makeMutation(
      DELETE_STICKER_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          stickerID,
        },
      },
      ({ data: { deleteSticker: { success, message } } }) => {
        if (success) {
          showInfo('刪除成功', false);
          this.ownStickersAndSubscribedTagsQuery();
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

  makeKickMutation(tag, callback = () => {}) {
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
          showInfo('更新成功', false);
          callback();
          this.ownTagsQuery();
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

  makeDeleteTagMutation(tagID, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    ApolloClientManager.makeMutation(
      DELETE_TAG_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          tagID,
        },
      },
      ({ data: { deleteTag: { success, message } } }) => {
        if (success) {
          showInfo('更新成功', false);
          callback();
          this.ownTagsQuery();
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

  makeCreateTagMutation(key, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    ApolloClientManager.makeMutation(
      CREATE_TAG_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          tagID: uuid(),
          key,
        },
      },
      ({ data: { createTag: { success, message } } }) => {
        if (success) {
          showInfo('新增成功', false);
          callback();
          this.ownTagsQuery();
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

  makeCancelSubscribeMutation(tagID, callback = () => {}) {
    const { showInfo, user: { userID, sessionID } } = this.props;
    ApolloClientManager.makeMutation(
      CANCEL_SUBSCRIBE_TAG_MUTATION,
      {
        arg: {
          userID,
          sessionID,
          tagID,
        },
      },
      ({ data: { cancelSubscribeTag: { success, message } } }) => {
        if (success) {
          showInfo('已取消訂閱', false);
          callback();
          this.ownStickersAndSubscribedTagsQuery();
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
    const { user: { userID }, showInfo } = this.props;
    ApolloClientManager.makeQuery(
      OWN_TAGS_QUERY,
      {
        ownerID: userID,
      },
      ({ data: { ownTags: ownTagData } }) => {
        this.setState(prevState => ({
          ...prevState,
          ownTagData,
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
    this.ownStickersAndSubscribedTagsQuery();
  }

  render() {
    const { appStatus, tileData, ownTagData, subscribedTagData } = this.state;
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
            label="我的貼圖"
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
            label="我的標籤"
            value={TABS.OWNTAGS}
          >
            <h3 style={{ marginLeft: '8px' }}>我管理的標籤</h3>
            {ownTagData.map(({ tagID, key, subscriberIDs }) => (
              <EditTagBtn
                tagID={tagID}
                key={tagID}
                tagKey={key}
                subscriberIDs={subscriberIDs}
                makeKickMutation={this.makeKickMutation}
                makeDeleteTagMutation={this.makeDeleteTagMutation}
              />
            ))}
            {(
              <CreateTagBtn
                makeCreateTagMutation={this.makeCreateTagMutation}
              />
            )}
            <h3 style={{ marginLeft: '8px' }}>我訂閱的標籤</h3>
            {subscribedTagData.map(({ tagID, ownerID, key }) => (
              <EditSubscribedTagBtn
                tagID={tagID}
                key={tagID}
                ownerID={ownerID}
                tagKey={key}
                makeCancelSubscribeMutation={this.makeCancelSubscribeMutation}
              />
            ))}
          </Tab>
        </Tabs>
        <div className="overlay overlay--breadcrumb">
          <FloatingActionButton onClick={() => { onSwitchPage(AppConfig.PAGES.SEARCH); }} tooltip="搜尋頁">
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
