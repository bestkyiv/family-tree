import React, { FunctionComponent, useState } from 'react';
import classnames from 'classnames';

import './picture.scss';

type Props = {
  src?: string,
  isCollapsed: boolean,
};

const Picture: FunctionComponent<Props> = ({ src, isCollapsed }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={classnames('picture', { picture_collapsed: isCollapsed })}>
      {src && (
        <img
          className={classnames('picture__img', { picture__img_loaded: isLoaded })}
          src={!isCollapsed || isLoaded ? src : undefined}
          alt="Member"
          draggable="false"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default Picture;
