import React, {Component} from 'react';
import classnames from 'classnames';

import './canvas.scss';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {x: 0, y: 0},
      grabbed: false,
      grabCoords: {x: null, y: null},
    };
    this.canvasRef = React.createRef();
  }

  render() {
    const {children} = this.props;

    return (
      <div
        ref={this.canvasRef}
        className={classnames('canvas', {
          'canvas_grabbed': this.state.grabbed,
        })}
        onMouseDown={this.startDragging}
        onMouseUp={this.stopDragging}
        onMouseLeave={this.stopDragging}
        onMouseMove={this.onDragging}
      >
        {children}
      </div>
    );
  }

  startDragging = e => {
    this.setState({
      grabbed: true,
      grabCoords: {
        x: e.pageX,
        y: e.pageY,
      },
      position: {
        x: this.canvasRef.current.scrollLeft,
        y: this.canvasRef.current.scrollTop,
      }
    });
  }

  stopDragging = e => {
    this.setState({
      grabbed: false,
      grabCoords: {x: null, y: null}
    });
  }

  onDragging = e => {
    const {position, grabCoords, grabbed} = this.state;

    if (!grabbed) return;

    const offsetX = position.x + grabCoords.x - e.pageX;
    const offsetY = position.y + grabCoords.y - e.pageY;
    this.canvasRef.current.scroll(offsetX, offsetY);
  }
}

export default Canvas;
