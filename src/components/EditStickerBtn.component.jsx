import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, FlatButton, FontIcon, Dialog, TextField } from 'material-ui';

class EditStickerBtn extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      tmpDesc: '',
    };
    this.onOpen = this.onOpen.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onQuit = this.onQuit.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
  }

  componentWillMount() {
    const { description } = this.props;
    this.setState(prevState => ({
      ...prevState,
      tmpDesc: description,
    }));
  }

  onOpen() {
    this.setState({
      open: true,
    });
  }

  onSave() {
    const { stickerID, updateSticker } = this.props;
    const { tmpDesc } = this.state;
    updateSticker(
      {
        stickerID,
        description: tmpDesc,
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

  onDescChange({ target: { value: tmpDesc } }) {
    this.setState(prevState => ({
      ...prevState,
      tmpDesc,
    }));
  }

  render() {
    const { tagIDs } = this.props;
    const { open, tmpDesc } = this.state;
    const actions = [
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
          {tagIDs}
        </Dialog>
      </IconButton>
    );
  }
}

EditStickerBtn.propTypes = {
  stickerID: PropTypes.string,
  updateSticker: PropTypes.func,
  tagIDs: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
};

EditStickerBtn.defaultProps = {
  stickerID: '',
  updateSticker: () => {},
  tagIDs: [],
  description: PropTypes.string,
};

export default EditStickerBtn;
