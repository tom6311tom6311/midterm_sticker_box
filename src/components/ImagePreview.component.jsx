import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  imagePreviewContainer: {
    display: 'flex',
    width: '100%',
    height: 'calc(100% - 206px)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxHeight: '80%',
    maxWidth: '80%',
  },
};

const ImagePreview = ({ src }) => (
  <div style={styles.imagePreviewContainer}>
    <img
      style={styles.image}
      src={src}
      alt={'img'}
    />
  </div>
);

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImagePreview;
