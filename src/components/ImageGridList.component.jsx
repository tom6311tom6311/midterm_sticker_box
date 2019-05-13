import fs from 'fs';
import React from 'react';
import GridList from 'material-ui/GridList';
import GridListTile from 'material-ui/GridList/GridTile';

const tileData = fs.readdirSync('src/data/stickers/')
  .filter(name => name.endsWith('.png') || name.endsWith('.jpg' || name.endsWith('.gif')))
  .map(name => ({
    img: `data/stickers/${name}`,
    title: name,
    cols: 1,
  }))
  .slice(0, 9);

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

const ImageGridList = () => (
  <div style={styles.root}>
    <GridList cellHeight={190} spacing={2} style={styles.gridList} cols={3}>
      {tileData.map(tile => (
        <GridListTile key={tile.img} cols={tile.cols || 1}>
          <img src={tile.img} alt={tile.title} />
        </GridListTile>
      ))}
    </GridList>
  </div>
);

export default ImageGridList;
