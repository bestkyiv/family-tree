import React, {useState} from 'react';
import classnames from 'classnames';

import './picture.scss';

const Picture = ({src, isCollapsed}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={classnames('picture', {'picture_collapsed': isCollapsed})}>
      { src &&
        <img
          className={classnames('picture__img', {'picture__img_loaded': isLoaded})}
          src={!isCollapsed || isLoaded ? src : null}
          alt="Member"
          draggable="false"
          onLoad={() => setIsLoaded(true)}
        /> }
    </div>
  );
}

export default Picture;
