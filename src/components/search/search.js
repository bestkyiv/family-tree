import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Result from './result/result';

import './search.scss';

const propTypes = {
  membersList: PropTypes.array,
  highlightMember: PropTypes.func.isRequired,
};

const defaultProps = {
  membersList: [],
}

const initialState = {
  query: '',
  results: [],
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    document.addEventListener('click', this.resetState);
  }

  resetState = () => {
    this.setState(initialState);
  }

  render() {
    const {highlightMember} = this.props;
    const {query, results} = this.state;

    return (
      <div
        className="search"
        onClick={e => e.stopPropagation()}
      >
        <input
          onChange={this.handleChange}
          className="search__input"
          type="text"
          placeholder="Кого шукаєш?"
          value={query}
        />
        <div className="search__results">
          {results.map(result => (
            <Result
              key={result.id}
              query={query}
              name={result.name}
              status={result.status}
              active={result.active}
              handleClick={() => {
                highlightMember(result.id);
                this.resetState();
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  handleChange = e => {
    const {membersList} = this.props;

    const query = e.target.value ?? '';
    const results = query ? membersList.filter(member => member.name.toLowerCase().includes(query.toLowerCase())) : [];

    this.sortResults();

    this.setState({query, results});
  }

  sortResults = () => {
    const {results} = this.state;

    results.sort((member1, member2) => {
      if (member1.recDate && member2.recDate)
        if (member1.recDate.getTime() !== member2.recDate.getTime())
          return member1.recDate < member2.recDate ? 1 : -1;

      return member1.name > member2.name ? 1 : -1;
    });
  }
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
