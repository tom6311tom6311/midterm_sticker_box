import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton, Dialog } from 'material-ui';

class EditSubscribedTagBtn extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.onOpen = this.onOpen.bind(this);
    this.onCancelSubscribe = this.onCancelSubscribe.bind(this);
    this.onQuit = this.onQuit.bind(this);
  }

  onOpen() {
    this.setState({
      open: true,
    });
  }

  onCancelSubscribe() {
    const { tagID, makeCancelSubscribeMutation } = this.props;
    makeCancelSubscribeMutation(
      tagID,
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

  render() {
    const { tagKey, ownerID } = this.props;
    const { open } = this.state;
    const actions = [
      <FlatButton
        label="取消訂閱"
        secondary
        onClick={this.onCancelSubscribe}
      />,
      <FlatButton
        label="確定"
        primary
        keyboardFocused
        onClick={this.onQuit}
      />,
    ];
    return (
      <div style={{ display: 'inline-block', border: '1px solid #666', borderRadius: '8px', padding: '4px', margin: '6px' }}>
        <FlatButton
          style={{ height: '48px' }}
          labelStyle={{ fontSize: '24px' }}
          label={`#${tagKey}`}
          onClick={this.onOpen}
        >
          <Dialog
            title={`標籤：#${tagKey}`}
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={this.onQuit}
          >
            <h3>管理者: {ownerID}</h3>
          </Dialog>
        </FlatButton>
      </div>
    );
  }
}

EditSubscribedTagBtn.propTypes = {
  tagID: PropTypes.string,
  ownerID: PropTypes.string,
  tagKey: PropTypes.string,
  makeCancelSubscribeMutation: PropTypes.func,
};

EditSubscribedTagBtn.defaultProps = {
  tagID: '',
  ownerID: '',
  tagKey: '',
  makeCancelSubscribeMutation: () => {},
};

export default EditSubscribedTagBtn;
