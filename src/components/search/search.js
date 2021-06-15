import React, {useState} from 'react';
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
        //   if (child1.details.recDate.getTime() !== child2.details.recDate.getTime())
        //     return child1.details.recDate > child2.details.recDate ? 1 : -1;
        return member2.details.recDate.diff(member1.details.recDate);

      return member1.name > member2.name ? 1 : -1;
    });

    setQuery(query);
    setResults(sortedResults);
  };

  const getHighlightedMemberAncestorsIds = id => {
    const ancestorsIds = [];
    let currentMember = membersList.filter(member => member.id === id)[0];

    if (currentMember) {
      while (currentMember.parent) {
        const parentName = currentMember.parent;
        currentMember = membersList.filter(member => member.name === parentName)[0];
        ancestorsIds.push(currentMember.id);
      }
    }

    return ancestorsIds;
  };

  const highlightMember = id => {
    const ancestorsIds = getHighlightedMemberAncestorsIds(id);
    dispatch(setHighlightedMemberAction({id, ancestorsIds}));
  }

  const resetSearch = () => {
    if (query !== '') {
      setQuery('');
      setResults([]);
    }
  };

  document.addEventListener('click', resetSearch);

  return (
    <div
      className="search"
      onClick={e => e.stopPropagation()}
    >
      <input
        onChange={handleChange}
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
              highlightMember(result.id);
              resetSearch();
            }}
          />
        ))}
      </div>
    </div>
  );
}


export default Search;
