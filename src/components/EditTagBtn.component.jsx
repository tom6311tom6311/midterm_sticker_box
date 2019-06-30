import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatButton, FontIcon, Dialog } from 'material-ui';

class EditTagBtn extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      subscriberIDs: [],
    };
    this.onOpen = this.onOpen.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onQuit = this.onQuit.bind(this);
    this.toggleSubscriber = this.toggleSubscriber.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
  }

  componentWillMount() {
    const { subscriberIDs } = this.props;
    this.setState(prevState => ({
      ...prevState,
      subscriberIDs,
    }));
  }

  onOpen() {
    this.setState({
      open: true,
    });
  }

  onSave() {
    const { tagID, subscriberIDs, makeKickMutation } = this.props;
    const { subscriberIDs: tmpSubscriberIDs } = this.state;
    makeKickMutation(
      {
        tagID,
        kickUserIDs: subscriberIDs.filter(id => tmpSubscriberIDs.indexOf(id) === -1),
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

  toggleSubscriber(sid) {
    const { subscriberIDs } = this.state;
    if (subscriberIDs.indexOf(sid) !== -1) {
      this.setState(prevState => ({
        ...prevState,
        subscriberIDs: prevState.subscriberIDs.filter(id => id !== sid),
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        subscriberIDs: [...prevState.subscriberIDs, sid],
      }));
    }
  }

  deleteTag() {
    const { tagID, makeDeleteTagMutation } = this.props;
    makeDeleteTagMutation(
      {
        tagID,
      },
      () => {
        this.setState({
          open: false,
        });
      },
    );
  }


  render() {
    const { tagKey, subscriberIDs } = this.props;
    const { open, subscriberIDs: tmpSubscriberIDs } = this.state;
    const actions = [
      <FlatButton
        label="刪除標籤"
        secondary
        onClick={this.deleteTag}
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
      <div style={{ display: 'inline-block', border: '1px solid #666', borderRadius: '8px', padding: '4px', margin: '6px' }}>
        <FlatButton
          style={{ height: '48px' }}
          labelStyle={{ fontSize: '24px' }}
          label={`#${tagKey}`}
          onClick={this.onOpen}
        >
          <Dialog
            title={`編輯標籤：#${tagKey}`}
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={this.onQuit}
          >
            <h3>訂閱者</h3>
            {subscriberIDs.map((sid) => {
              const color = tmpSubscriberIDs.indexOf(sid) !== -1 ? 'grey' : 'red';
              return (
                <FlatButton
                  key={sid}
                  style={{ margin: '4px' }}
                  label={sid}
                  labelStyle={{ color }}
                  icon={(
                    <FontIcon
                      className={'fas fa-user-times'}
                      color={color}
                    />
                  )}
                  onClick={() => { this.toggleSubscriber(sid); }}
                />
              );
            })}
          </Dialog>
        </FlatButton>
      </div>
    );
  }
}

EditTagBtn.propTypes = {
  tagID: PropTypes.string,
  tagKey: PropTypes.string,
  subscriberIDs: PropTypes.arrayOf(PropTypes.string),
  makeKickMutation: PropTypes.func,
  makeDeleteTagMutation: PropTypes.func,
};

EditTagBtn.defaultProps = {
  tagID: '',
  tagKey: '',
  subscriberIDs: [],
  makeKickMutation: () => {},
  makeDeleteTagMutation: () => {},
};

export default EditTagBtn;
