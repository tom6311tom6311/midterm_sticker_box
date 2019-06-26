/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import Header from './Header.component';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class OwnOverlay extends Component {
  constructor() {
    super();
    this.state = {
      tab: 'stickers',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      tab: value,
    });
    if (value === 'stickers') {
      this.props.onSwitchToOwnStickers();
    } else {
      this.props.onSwitchToOwnTags();
    }
  }

  render() {
    const { onSwitchToOwnStickers, onSwitchToMain, name, status } = this.props;
    return (
      <div className="overlay-wrapper overlay-wrapper__full">
        <Header name={name} status={status} onSwitchToOwnStickers={onSwitchToOwnStickers} onSwitchToMain={onSwitchToMain} />
        <Tabs
          value={this.state.tab}
          onChange={this.handleChange}
        >
          <Tab label="My stickers" value="stickers">
            <div>
              <h2 style={styles.headline}>Controllable Tab A</h2>
              <p>
                Tabs are also controllable if you want to programmatically pass them their values.
                This allows for more functionality in Tabs such as not
                having any Tab selected or assigning them different values.
              </p>
            </div>
          </Tab>
          <Tab label="My tags" value="tags">
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
      </div>
    );
  }
}

OwnOverlay.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
  onSwitchToOwnStickers: PropTypes.func,
  onSwitchToOwnTags: PropTypes.func,
  onSwitchToMain: PropTypes.func,
};

OwnOverlay.defaultProps = {
  name: '',
  status: '',
  onSwitchToOwnStickers: () => {},
  onSwitchToOwnTags: () => {},
  onSwitchToMain: () => {},
};

export default OwnOverlay;

