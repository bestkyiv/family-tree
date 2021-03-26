import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './toggleButton.scss';

const propTypes = {
  isOn: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  handleSwitch: PropTypes.func.isRequired,
};

const defaultProps = {
  isOn: false,
  isCollapsed: false,
}

class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transitionStarted: false,
    }
    this.toggleButtonRef = React.createRef();
  }

  render() {
    const {
      isOn,
      isCollapsed,
    } = this.props;

    const toggleButtonClasses = classnames('toggle-button', {
      'toggle-button_collapsed': isCollapsed,
      'toggle-button_on': isOn,
    });

    return (
      <div
        ref={this.toggleButtonRef}
        className={toggleButtonClasses}
        onClick={this.handleClick}
        onMouseDown={e => e.stopPropagation()}
        onTransitionEnd={this.handleTransitionEnd}
      >
        {isOn ? '-' : '+'}
      </div>
    );
  }

  handleClick = () => {
    const {handleSwitch} = this.props;

    handleSwitch();
    this.focusAfterTransition();
  };

  handleTransitionEnd = () => {
    this.setState(prevState => {
      if (prevState.transitionStarted) {
        this.toggleButtonRef.current.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
      }
      return {transitionStarted: false};
    });
  }

  focusAfterTransition = () => {
    this.setState({transitionStarted: true});
  }
}

ToggleButton.propTypes = propTypes;
ToggleButton.defaultProps = defaultProps;

export default ToggleButton;
