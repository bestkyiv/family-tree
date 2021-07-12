import React, { FunctionComponent, useState, MouseEvent } from 'react';
import classnames from 'classnames';

import './canvas.scss';

type Coords = {
  x: number | null,
  y: number | null,
}

const Canvas: FunctionComponent = ({ children }) => {
  const [position, setPosition] = useState<Coords>({ x: 0, y: 0 });
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [grabCoords, setGrabCoords] = useState<Coords>({ x: null, y: null });

  const canvasRef = React.createRef<HTMLDivElement>();

  const startDragging = (e: MouseEvent) => {
    setIsGrabbed(true);
    setGrabCoords({ x: e.pageX, y: e.pageY });
    setPosition({
      x: (canvasRef.current as HTMLElement).scrollLeft,
      y: (canvasRef.current as HTMLElement).scrollTop,
    });
  };

  const stopDragging = () => {
    if (!isGrabbed) return;

    setIsGrabbed(false);
    setGrabCoords({ x: null, y: null });
  };

  const onDragging = (e: MouseEvent) => {
    if (!isGrabbed) return;

    if (position.x !== null && position.y !== null && grabCoords.x !== null && grabCoords.y !== null) {
      const offsetX = position.x + grabCoords.x - e.pageX;
      const offsetY = position.y + grabCoords.y - e.pageY;
      (canvasRef.current as HTMLElement).scroll(offsetX, offsetY);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={classnames('canvas', { canvas_grabbed: isGrabbed })}
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onMouseMove={onDragging}
      role="scrollbar"
      tabIndex={0}
      aria-controls="family-tree"
      aria-valuenow={0}
    >
      {children}
    </div>
  );
};

export default Canvas;
