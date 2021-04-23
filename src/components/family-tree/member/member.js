import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import MemberInfo from './member-info/memberInfo';
import ToggleButton from './toggle-button/toggleButton';

import './member.scss';

const propTypes = {
  info: PropTypes.object,
  hasParent: PropTypes.bool,
  highlighted: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  showChildren: PropTypes.bool,
};

const defaultProps = {
  active: false,
  hasParent: false,
  isCollapsed: false,
  highlighted: false,
  showChildren: false,
}

class Member extends Component {
  state = {
    childrenCollapsed: true,
  };

  componentDidUpdate(prevProps) {
    // Приховати дітей якщо мембер приховується
    if (!prevProps.isCollapsed && this.props.isCollapsed) {
      this.setState({childrenCollapsed: true});
    }

    if (!prevProps.showChildren && this.props.showChildren) {
      this.setState({childrenCollapsed: false});
    }
  }

  render() {
    const {
      info,
      children,
      hasParent,
      highlighted,
      isCollapsed,
    } = this.props;
    const {childrenCollapsed} = this.state;

    const memberClasses = classnames('member', {
      'member_has-parent': hasParent,
      'member_collapsed': isCollapsed,
    });

    return (
      <div
        id={info.id.toString()}
        className={memberClasses}
      >
        <MemberInfo
          {...info}
          highlighted={highlighted}
          isCollapsed={isCollapsed}
        />
        {children && (
          <>
            <ToggleButton
              isOn={!childrenCollapsed}
              isCollapsed={isCollapsed}
              handleSwitch={this.switchChildrenCollapse}
            />
            <div className="member__children">
              {children.map(child => React.cloneElement(child, {
                hasParent: true,
                isCollapsed: isCollapsed || childrenCollapsed,
              }))}
            </div>
          </>
        )}
      </div>
    );
  }

  switchChildrenCollapse = () => {
    this.setState(prevState => ({
      childrenCollapsed: !prevState.childrenCollapsed
    }));
  }
}

Member.propTypes = propTypes;
Member.defaultProps = defaultProps;

export default Member;
