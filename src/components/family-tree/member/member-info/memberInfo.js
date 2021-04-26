import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { statusesType } from 'config/statuses';

import GeneralInfo from './general-info/generalInfo';
import Details from './details/details'

import './memberInfo.scss';

const propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  status: statusesType.isRequired,
  details: PropTypes.object,
  activity: PropTypes.object,
  isCollapsed: PropTypes.bool,
  highlighted: PropTypes.bool,
};

const defaultProps = {
  isCollapsed: false,
  highlighted: false,
}

class MemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areDetailsShown: false,
      isHistoryShown: false,
      transitionStarted: false,
    }
    this.memberInfoRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // Приховати деталі якщо мембер приховується
    if (!prevProps.isCollapsed && this.props.isCollapsed) {
      this.setState({
        areDetailsShown: false,
        isHistoryShown: false,
      });
    }

    // Приховати історію якщо ховаються деталі
    if (prevState.areDetailsShown && !this.state.areDetailsShown) {
      this.setState({isHistoryShown: false});
    }

    // Навести фокус на мембера, якщо він став виділеним
    if (!prevProps.highlighted && this.props.highlighted) {
      this.focusAfterTransition();
    }
  }

  render() {
    const {
      picture,
      name,
      status,
      details,
      activity,
      history,
      isCollapsed,
      highlighted,
    } = this.props;
    const {
      areDetailsShown,
      isHistoryShown,
    } = this.state;

    const memberInfoClasses = classnames('member-info', {
      'member-info_collapsed': isCollapsed,
      'member-info_details-shown': areDetailsShown,
      'member-info_highlighted': highlighted,
    });

    return (
      <div
        ref={this.memberInfoRef}
        className={memberInfoClasses}
        onClick={this.showDetails}
        onTransitionEnd={this.handleTransitionEnd}
        onMouseDown={e => e.stopPropagation()}
        onKeyPress={e => e.key === 'Enter' && !areDetailsShown ? this.showDetails() : null}
        tabIndex={0}
      >
        <div className="member-info__content">
          <GeneralInfo
            picture={picture}
            name={name}
            status={status}
            isCollapsed={isCollapsed}
            activity={activity}
            highlighted={highlighted}
            handleClick={this.showDetails}
          />
          <Details
            {...details}
            isCollapsed={isCollapsed || !areDetailsShown}
          />
        </div>
        {history.length > 0 && (
          <div className="member-info__history">
            <button
                className={classnames('member-info__history-toggle', {
                  'member-info__history-toggle_collapsed': isCollapsed || !areDetailsShown,
                })}
                onClick={() => this.setState(prevState => ({isHistoryShown: !prevState.isHistoryShown}))}
            >
              {isHistoryShown ? 'Приховати історію' : 'Показати історію'}
            </button>
            <ul className={classnames('member-info__history-content', {
              'member-info__history-content_shown': isHistoryShown,
            })}>
              {history.map((item, itemId) => <li key={itemId}>{item}</li>)}
            </ul>
          </div>
        )}
        <button
          className="member-info__close-details-button"
          onClick={this.hideDetails}
        >x</button>
      </div>
    );
  }

  focusAfterTransition = () => {
    this.setState({transitionStarted: true});
    this.memberInfoRef.current.focus();
  }

  handleTransitionEnd = () => {
    this.setState(prevState => {
      if (prevState.transitionStarted) {
        this.memberInfoRef.current.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
      }
      return {transitionStarted: false};
    });
  }

  showDetails = () => {
    this.setState({areDetailsShown: true});
    this.focusAfterTransition();
  }

  hideDetails = e => {
    e.stopPropagation();
    this.setState({areDetailsShown: false});
  }
}

MemberInfo.propTypes = propTypes;
MemberInfo.defaultProps = defaultProps;

export default MemberInfo;
