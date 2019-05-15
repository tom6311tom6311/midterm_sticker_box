import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchBar from '../components/SearchBar.component';
import LoadingOverlay from '../components/LoadingOverlay.component';
import DisconnectedOverlay from '../components/DisconnectedOverlay.component';
import ImageGridList from '../components/ImageGridList.component';
import AppConfig from '../const/AppConfig.const';
import timeoutTask from '../util/timeoutTask.util';

const mainContainerStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isDisconnected: false,
      searchTerm: '',
      tileData: [],
    };
    this.loadTimeout = undefined;
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onSearchTermChanged = this.onSearchTermChanged.bind(this);
    this.makeQuery = this.makeQuery.bind(this);
  }

  componentDidMount() {
    this.makeQuery();
  }

  onImageLoaded() {
    if (this.loadTimeout !== undefined) {
      clearTimeout(this.loadTimeout);
    }
    this.loadTimeout = setTimeout(() => {
      this.setState(prevState => ({
        ...prevState,
        isLoading: false,
      }));
    }, AppConfig.LOAD_TIMEOUT);
  }

  onSearchTermChanged({ target: { value: searchTerm } }) {
    this.setState(prevState => ({
      ...prevState,
      searchTerm,
    }));
    console.log(searchTerm);
  }

  makeQuery() {
    this.setState(prevState => ({
      ...prevState,
      isDisconnected: false,
      isLoading: true,
    }));
    timeoutTask(
      // eslint-disable-next-line no-undef
      fetch(`${AppConfig.SERVER_URL}/img_list?searchTerm=${this.state.searchTerm}`),
      AppConfig.CONN_TIMEOUT,
    )
      .then(res => res.json())
      .then(({ imgList }) => {
        console.log('lala');
        this.setState(prevState => ({
          ...prevState,
          tileData: imgList.map(name => ({
            img: `${AppConfig.SERVER_URL}/imgs/${name}`,
            title: name,
            cols: 1,
          })),
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState(prevState => ({
          ...prevState,
          isLoading: false,
          isDisconnected: true,
        }));
      });
  }

  render() {
    const { isLoading, isDisconnected, tileData } = this.state;
    return (
      <MuiThemeProvider>
        <div style={mainContainerStyle}>
          <SearchBar
            onChange={this.onSearchTermChanged}
            onSubmit={this.makeQuery}
          />
          { isLoading ? <LoadingOverlay /> : '' }
          { isDisconnected ? <DisconnectedOverlay /> : '' }
          <ImageGridList
            isLoading={isLoading}
            tileData={tileData}
            onImageLoaded={this.onImageLoaded}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
