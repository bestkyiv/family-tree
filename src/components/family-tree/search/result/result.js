import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

import { statusesType } from 'config/statuses';

import './result.scss';

const propTypes = {
  query: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  status: statusesType.isRequired,
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

const defaultProps = {
  active: false,
};

class Result extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  render() {
    const {
      name,
      status,
      handleClick,
    } = this.props;

    return (
      <button
        ref={this.buttonRef}
        className="result"
        onClick={handleClick}
        onKeyUp={this.handleKeyUp}
      >
        <span className="result__name">
          {this.highlightQueryInName(name)}
        </span>
        <span className="result__status">
          ({status})
        </span>
      </button>
    );
  }

  highlightQueryInName = name => {
    const {query} = this.props;

    const parts = name.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, partId) => (
      <Fragment key={partId}>
        {part.toLowerCase() === query.toLowerCase() ? <b>{part}</b> : part}
      </Fragment>
    ));
  }

  handleKeyUp = event => {
    if (event.key === 'ArrowUp') {
      if (this.buttonRef.current.previousElementSibling) {
        this.buttonRef.current.previousElementSibling.focus();
      }
    }
    else if (event.key === 'ArrowDown') {
      if (this.buttonRef.current.nextElementSibling) {
        this.buttonRef.current.nextElementSibling.focus();
      }
    }
  }
}

Result.propTypes = propTypes;
Result.defaultProps = defaultProps;

export default Result;
