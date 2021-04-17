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
  render() {
    const {
      name,
      status,
      handleClick,
    } = this.props;

    return (
      <div
        className="result"
        onClick={handleClick}
      >
        <span className="result__name">
          {this.highlightQueryInName(name)}
        </span>
        <span className="result__status">
          ({status})
        </span>
      </div>
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
}

Result.propTypes = propTypes;
Result.defaultProps = defaultProps;

export default Result;
