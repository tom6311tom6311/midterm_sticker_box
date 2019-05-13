import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header.container';
import ImageGridList from '../components/ImageGridList.component';

const mainContainerStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

class Main extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div style={mainContainerStyle}>
          <Header />
          {/* <SearchBox /> */}
          {/* <ImagePreview src={'https://source.unsplash.com/random/800x600'} /> */}
          {/* <ThumbSlider /> */}
          <ImageGridList />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
