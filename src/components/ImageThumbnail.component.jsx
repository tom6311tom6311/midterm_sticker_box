import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

const style = {
  padding: 10,
  margin: 10,
};

const ImageThumbail = ({ src }) => (
  <Paper style={style} zDepth={1}>
    <img src={src} height={100} alt={'img'} />
  </Paper>
);

ImageThumbail.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImageThumbail;
