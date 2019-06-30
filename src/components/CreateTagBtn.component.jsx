import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton, Dialog, TextField } from 'material-ui';

class CreateTagBtn extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      tmpkey: '',
    };
    this.onOpen = this.onOpen.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onQuit = this.onQuit.bind(this);
    this.onKeyChange = this.onKeyChange.bind(this);
  }

  onOpen() {
    this.setState(prevState => ({
      ...prevState,
      open: true,
    }));
  }

  onCreate() {
    const { makeCreateTagMutation } = this.props;
    const { tmpKey: key } = this.state;
    makeCreateTagMutation(key, this.onQuit);
  }

  onQuit() {
    this.setState({
      open: false,
      key: '',
    });
  }

  onKeyChange({ target: { value: tmpKey } }) {
    this.setState(prevState => ({
      ...prevState,
      tmpKey,
    }));
  }

  render() {
    const { open, tmpKey } = this.state;
    const actions = [
      <FlatButton
        label="取消"
        primary
        onClick={this.onQuit}
      />,
      <FlatButton
        label="新增"
        primary
        keyboardFocused
        onClick={this.onCreate}
      />,
    ];
    return (
      <div style={{ display: 'inline-block', border: '1px solid blue', borderRadius: '8px', padding: '4px', margin: '6px' }}>
        <FlatButton
          style={{ height: '48px', opacity: 0.5 }}
          labelStyle={{ fontSize: '24px', color: 'blue' }}
          label={'新增標籤'}
          onClick={this.onOpen}
        >
          <Dialog
            title={'新增標籤'}
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={this.onQuit}
          >
            <TextField
              floatingLabelText="名稱"
              value={tmpKey}
              onChange={this.onKeyChange}
            />
          </Dialog>
        </FlatButton>
      </div>
    );
  }
}

CreateTagBtn.propTypes = {
  makeCreateTagMutation: PropTypes.func,
};

CreateTagBtn.defaultProps = {
  makeCreateTagMutation: () => {},
};

export default CreateTagBtn;
