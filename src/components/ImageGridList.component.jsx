import React from 'react';
import PropTypes from 'prop-types';
import GridList from 'material-ui/GridList';
import GridListTile from 'material-ui/GridList/GridTile';

const styles = {
  gridList: {
    width: '100%',
    margin: 'auto',
  },
};

const ImageGridList = ({ tileData, onImageLoaded }) => (
  <div>
    <GridList cellHeight={186} spacing={2} style={styles.gridList} cols={3}>
      {tileData.map(({ img, title, cols, actionIcon }) => (
        <GridListTile
          key={img}
          title={title}
          cols={cols || 1}
          actionIcon={actionIcon}
        >
          <img
            className={'grabbable'}
            src={img}
            alt={title}
            onLoad={onImageLoaded}
          />
        </GridListTile>
      ))}
    </GridList>
  </div>
);

ImageGridList.propTypes = {
  tileData: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string.isRequired,
      title: PropTypes.string,
      cols: PropTypes.number,
    }),
  ),
  onImageLoaded: PropTypes.func,
};

ImageGridList.defaultProps = {
  tileData: [],
  onImageLoaded: () => {},
};

export default ImageGridList;
