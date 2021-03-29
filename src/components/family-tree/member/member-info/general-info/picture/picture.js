import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './picture.scss';

const propTypes = {
  src: PropTypes.string,
  isCollapsed: PropTypes.bool,
};

const defaultProps = {
  src: null,
  isCollapsed: false,
}

class Picture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    }
  }

  render() {
    const {src, isCollapsed} = this.props;
    const {isLoaded} = this.state;

    return (
      <div className={classnames('picture', {'picture_collapsed': isCollapsed})}>
        { src &&
          <img
            className={classnames('picture__img', {'picture__img_loaded': isLoaded})}
            src={!isCollapsed || isLoaded ? src : null}
            alt="Member"
            draggable="false"
            onLoad={this.handlePictureLoad}
          /> }
      </div>
    );
  }

  handlePictureLoad = () => {
    this.setState({isLoaded: true});
  }
}

Picture.propTypes = propTypes;
Picture.defaultProps = defaultProps;

export default Picture;
