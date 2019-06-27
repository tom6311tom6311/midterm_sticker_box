/* eslint-disable max-len */
import React, { Component } from 'react';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import ApolloClientManager from '../util/ApolloClientManager.class';
import OWN_STICKERS_QUERY from '../graphql/ownStickers.query.js';
import ImageGridList from '../components/ImageGridList.component';
import AppConfig from '../const/AppConfig.const';
import Dropzone from '../components/Dropzone.component';
import verifyImageFile from '../util/verifyImageFile.func';
import verifyFileName from '../util/verifyFileName.func';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const TABS = {
  OWNSTICKERS: 'OWNSTICKERS',
  OWNTAGS: 'OWNTAGS',
};

const mainContainerStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      appStatus: AppConfig.APP_STATUS.READY,
      uploadFileName: '',
      tileData: [],
      copyrightAgree: false,
      tab: TABS.OWNSTICKERS,
    };

    this.loadTimeout = undefined;
    this.infoTimeout = undefined;
    this.uploadFile = {};

    this.onSwitchToOwnStickers = this.onSwitchToOwnStickers.bind(this);
    this.onSwitchToOwnTags = this.onSwitchToOwnTags.bind(this);
    this.onSwitchToMain = this.onSwitchToMain.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onUploadFileNameChanged = this.onUploadFileNameChanged.bind(this);
    this.onCopyrightCheckboxChanged = this.onCopyrightCheckboxChanged.bind(this);
    this.onFileDroppedIn = this.onFileDroppedIn.bind(this);
    this.setLoadTimeout = this.setLoadTimeout.bind(this);
    this.ownStickersQuery = this.ownStickersQuery.bind(this);
    this.verifyNameAndCopyright = this.verifyNameAndCopyright.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.exitOverlay = this.exitOverlay.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  onSwitchToMain() {
    this.props.onSwitchPage(AppConfig.PAGES.SEARCH);
  }

  onImageLoaded() {
    if (this.loadTimeout !== undefined) {
      clearTimeout(this.loadTimeout);
    }
    this.setLoadTimeout();
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

  ownStickersQuery() {
    const { showInfo } = this.props;
    this.setState(prevState => ({
      ...prevState,
      appStatus: AppConfig.APP_STATUS.LOADING,
    }));
    this.setLoadTimeout(AppConfig.APP_STATUS.READY);
    console.log(this.props.user.userID);
    ApolloClientManager.makeQuery(
      OWN_STICKERS_QUERY,
      {
        ownerID: this.props.user.userID,
      },
      ({ data: { ownStickers: stickerList } }) => {
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

  handleChange(value) {
    this.setState({
      tab: value,
    });
  }

  render() {
    const { tileData } = this.state;
    const { onSwitchPage } = this.props;
    return (
      <div style={mainContainerStyle}>
        <Tabs
          value={this.state.tab}
          onChange={this.handleChange}
        >
          <Tab label="My stickers" value={TABS.OWNSTICKERS}>
            <div>
              <Dropzone onDrop={this.onFileDroppedIn}>
                <ImageGridList
                  tileData={tileData}
                  onImageLoaded={this.onImageLoaded}
                />
              </Dropzone>
            </div>
          </Tab>
          <Tab label="My tags" value={TABS.OWNTAGS}>
            <div>
              <h2 style={styles.headline}>Controllable Tab B</h2>
              <p>
                This is another example of a controllable tab. Remember, if you
                use controllable Tabs, you need to give all of your tabs values or else
                you wont be able to select them.
              </p>
            </div>
          </Tab>
        </Tabs>
        <div className="overlay overlay--breadcrumb">
          <FlatButton primary onClick={() => { onSwitchPage(AppConfig.PAGES.SEARCH); }}>
            搜尋貼圖
          </FlatButton>
        </div>
      </div>
    );
  }
}

SearchPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    userID: PropTypes.string,
  }),
  onSwitchPage: PropTypes.func,
  showInfo: PropTypes.func,
};

SearchPage.defaultProps = {
  user: {
    name: '',
    userID: '',
  },
  onSwitchPage: () => {},
  showInfo: () => {},
};

export default SearchPage;
