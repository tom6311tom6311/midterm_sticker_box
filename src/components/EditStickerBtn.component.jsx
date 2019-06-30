import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, FlatButton, FontIcon, Dialog, TextField } from 'material-ui';

class EditStickerBtn extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      tmpDesc: '',
      tmpStickerTagIDs: [],
    };
    this.onOpen = this.onOpen.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onQuit = this.onQuit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
    this.toggleTag = this.toggleTag.bind(this);
  }

  componentWillMount() {
    const { description, stickerTags } = this.props;
    this.setState(prevState => ({
      ...prevState,
      tmpDesc: description,
      tmpStickerTagIDs: stickerTags.map(({ tagID }) => tagID),
    }));
  }

  onOpen() {
    this.setState({
      open: true,
    });
  }

  onSave() {
    const { stickerID, updateSticker } = this.props;
    const { tmpDesc, tmpStickerTagIDs } = this.state;
    updateSticker(
      {
        stickerID,
        description: tmpDesc,
        tagIDs: tmpStickerTagIDs,
      },
      () => {
        this.setState({
          open: false,
        });
      },
    );
  }

  onQuit() {
    this.setState({
      open: false,
    });
  }

  onDelete() {
    const { stickerID, deleteSticker } = this.props;
    deleteSticker(
      stickerID,
      () => {
        this.setState({
          open: false,
        });
      },
    );
  }

  onDescChange({ target: { value: tmpDesc } }) {
    this.setState(prevState => ({
      ...prevState,
      tmpDesc,
    }));
  }

  toggleTag(tagID) {
    const { tmpStickerTagIDs } = this.state;
    if (tmpStickerTagIDs.indexOf(tagID) !== -1) {
      this.setState(prevState => ({
        ...prevState,
        tmpStickerTagIDs: prevState.tmpStickerTagIDs.filter(id => id !== tagID),
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        tmpStickerTagIDs: [...prevState.tmpStickerTagIDs, tagID],
      }));
    }
  }

  render() {
    const { allTags } = this.props;
    const { open, tmpDesc, tmpStickerTagIDs } = this.state;
    const actions = [
      <FlatButton
        label="刪除貼圖"
        secondary
        onClick={this.onDelete}
      />,
      <FlatButton
        label="取消"
        primary
        onClick={this.onQuit}
      />,
      <FlatButton
        label="儲存"
        primary
        keyboardFocused
        onClick={this.onSave}
      />,
    ];
    return (
      <IconButton>
        <FontIcon
          className={'far fa-edit edit-icon'}
          color={'grey'}
          hoverColor={'white'}
          onClick={this.onOpen}
        />
        <Dialog
          title="編輯貼圖"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.onQuit}
        >
          <TextField
            floatingLabelText="描述"
            value={tmpDesc}
            onChange={this.onDescChange}
          />
          <h3>已訂閱標籤(綠色為已標註，灰色為未標註)</h3>
          {allTags.map(({ tagID, ownerID, key }) => {
            const color = tmpStickerTagIDs.indexOf(tagID) !== -1 ? 'green' : 'gray';
            return (
              <FlatButton
                key={tagID}
                style={{ margin: '4px' }}
                label={`${key}(${ownerID})`}
                labelStyle={{ color }}
                icon={(
                  <FontIcon
                    className={'fas fa-tags'}
                    color={color}
                  />
                )}
                onClick={() => { this.toggleTag(tagID); }}
              />
            );
          })}
        </Dialog>
      </IconButton>
    );
  }
}

EditStickerBtn.propTypes = {
  stickerID: PropTypes.string,
  updateSticker: PropTypes.func,
  deleteSticker: PropTypes.func,
  stickerTags: PropTypes.arrayOf(PropTypes.shape({
    tagID: PropTypes.string,
    ownerID: PropTypes.string,
    key: PropTypes.string,
  })),
  allTags: PropTypes.arrayOf(PropTypes.shape({
    tagID: PropTypes.string,
    ownerID: PropTypes.string,
    key: PropTypes.string,
  })),
  description: PropTypes.string,
};

EditStickerBtn.defaultProps = {
  stickerID: '',
  updateSticker: () => {},
  deleteSticker: () => {},
  stickerTags: [],
  allTags: [],
  description: PropTypes.string,
};

export default EditStickerBtn;
