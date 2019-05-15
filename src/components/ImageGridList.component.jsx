import React from 'react';
import PropTypes from 'prop-types';
import GridList from 'material-ui/GridList';
import GridListTile from 'material-ui/GridList/GridTile';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    width: '100%',
    height: '80%',
  },
  gridList: {
    margin: 'auto',
    height: '100%',
  },
};

const ImageGridList = ({ tileData, onImageLoaded }) => (
  <div style={styles.root}>
    <GridList cellHeight={190} spacing={2} style={styles.gridList} cols={3}>
      {tileData.map(tile => (
        <GridListTile key={tile.img} cols={tile.cols || 1}>
          <img className={'grabbable'} src={tile.img} alt={tile.title} onLoad={onImageLoaded} />
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
