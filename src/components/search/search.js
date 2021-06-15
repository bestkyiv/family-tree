import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setHighlightedMemberAction} from 'store/reducer';

import Result from './result/result';

import './search.scss';


const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const membersList = useSelector(state => state.membersList);

  const dispatch = useDispatch();

  const handleChange = e => {
    const query = e.target.value ?? '';
    const currentResults = query ? membersList.filter(member => member.name.toLowerCase().includes(query.toLowerCase())) : [];

    const sortedResults = currentResults.sort((member1, member2) => {
      if (member1.details.recDate.isValid() && member2.details.recDate.isValid())
        return member2.details.recDate.diff(member1.details.recDate);

      return member1.name > member2.name ? 1 : -1;
    });

    setQuery(query);
    setResults(sortedResults);
  };

  useEffect(() => {
    document.addEventListener('mousedown', () => {
      if (query !== '') {
        setResults([]);
      }
    });
  }, [query]);

  return (
    <div
      className="search"
      onClick={e => e.stopPropagation()}
    >
      <input
        onChange={handleChange}
        onFocus={handleChange}
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
            onClick={() => {
              dispatch(setHighlightedMemberAction(result.id));
              setQuery('');
              setResults([]);
            }}
          />
        ))}
      </div>
    </div>
  );
}


export default Search;
