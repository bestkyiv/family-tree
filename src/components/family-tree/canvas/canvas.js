import React, {useState} from 'react';
import classnames from 'classnames';

import './canvas.scss';

const Canvas = ({children}) => {
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [grabCoords, setGrabCoords] = useState({x: null, y: null});

  const canvasRef = React.createRef();

  const startDragging = e => {
    setIsGrabbed(true);
    setGrabCoords({x: e.pageX, y: e.pageY});
    setPosition({
      x: canvasRef.current.scrollLeft,
      y: canvasRef.current.scrollTop,
    });
  }

  const stopDragging = () => {
    setIsGrabbed(false);
    setGrabCoords({x: null, y: null});
  }

  const onDragging = e => {
    if (!isGrabbed) return;

    const offsetX = position.x + grabCoords.x - e.pageX;
    const offsetY = position.y + grabCoords.y - e.pageY;
    canvasRef.current.scroll(offsetX, offsetY);
  }

  return (
    <div
      ref={canvasRef}
      className={classnames('canvas', {'canvas_grabbed': isGrabbed})}
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onMouseMove={onDragging}
    >
      {children}
    </div>
  );
}

export default Canvas;
