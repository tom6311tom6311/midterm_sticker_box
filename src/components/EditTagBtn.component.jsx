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
    this.kickSubscriber = this.kickSubscriber.bind(this);
    // this.deleteTag = this.deleteTag.bind(this);
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
    // const { subscriberIDs, tagKey, tagID, updateTag } = this.props;
    // const {  } = this.state;
    // updateTag(
    //   {
    //     tagID,
    //     kickUserIDs: ,
    //   },
    //   () => {
    //     this.setState({
    //       open: false,
    //     });
    //   },
    // );
  }

  onQuit() {
    this.setState({
      open: false,
    });
  }

  kickSubscriber(sid) {
    this.setState(prevState => ({
      ...prevState,
      subscriberIDs: prevState.subscriberIDs.filter(id => id !== sid),
    }));
  }

  // deleteTag(userID, sessionID, tagID) {
  //   ApolloClientManager.makeMutation(
  //     DELETE_TAG_MUTATION,
  //     {
  //       arg: {
  //         userID,
  //         sessionID,
  //         tagID,
  //       },
  //     },
  //     ({ data: { deleteTag: info } }) => {
  //       if (info.success) {
  //         showInfo('標籤刪除成功', false);
  //       } else {
  //         showInfo(info.message, true);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //       showInfo('網路連不上', true);
  //     },
  //   );
  // }


  render() {
    const { tagKey, subscriberIDs } = this.props;
    const { open, subscriberIDs: tmpSubscriberIDs } = this.state;
    const actions = [
      <FlatButton
        label="儲存"
        primary
        keyboardFocused
        onClick={this.onSave}
      />,
    ];
    return (
      <div>
        <FontIcon
          className={'fas fa-tags'}
          color={'grey'}
          hoverColor={'white'}
          onClick={this.onOpen}
        />
        <FlatButton labelStyle={{ fontSize: '50px', height: '70px', padding: '5px', border: '2px solid #73AD21', borderRadius: '5px' }} label={tagKey} onClick={this.onOpen} >
          <Dialog
            title="Edit Tag"
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={this.onQuit}
          >
            <div>
              <h3>訂閱觀眾</h3>
              {subscriberIDs.map(sid => (
                <div>
                  <FlatButton label={sid} />
                  <FontIcon
                    className={'fas fa-user-times'}
                    color={tmpSubscriberIDs.indexOf(sid) !== -1 ? 'grey' : 'red'}
                    hoverColor={'white'}
                    onClick={() => { this.kickSubscriber(sid); }}
                  />
                </div>
              ))}
            </div>
            <div>
              {/* <FlatButton label={'刪除標籤'} onClick={this.deleteTag} /> */}
            </div>
          </Dialog>
        </FlatButton>
      </div>
    );
  }
}

EditTagBtn.propTypes = {
  subscriberIDs: PropTypes.arrayOf(PropTypes.string),
  tagKey: PropTypes.string,
};

EditTagBtn.defaultProps = {
  subscriberIDs: [],
  tagKey: '',
};

export default EditTagBtn;
