import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropzone extends Component {
  constructor() {
    super();
    this.dropRef = React.createRef();
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragIn = this.handleDragIn.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.state = {
      dragging: false,
    };
    this.dragCounter = 0;
  }

  componentDidMount() {
    const div = this.dropRef.current;
    this.dragCounter = 0;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    const div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  // eslint-disable-next-line class-methods-use-this
  handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({
        dragging: true,
      });
    }
  }

  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter -= 1;
    if (this.dragCounter === 0) {
      this.setState({
        dragging: false,
      });
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.onDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div className={'dropzone-wrapper'} ref={this.dropRef}>
        {
          this.state.dragging &&
          <div className={'dropzone'}>
            <div className={'dropzone-content'}>上傳貼圖</div>
          </div>
        }
        {children}
      </div>
    );
  }
}

Dropzone.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onDrop: PropTypes.func,
};

Dropzone.defaultProps = {
  children: [],
  onDrop: () => {},
};

export default Dropzone;
