import React, {
  FunctionComponent,
  useEffect,
  useState,
  ChangeEvent,
} from 'react';
import { useDispatch } from 'react-redux';

import { useMembersList, setHighlightedMemberAction } from 'store/reducer';

import { MemberInfoType, MemberIdType } from 'config/memberType';

import Result from './result/result';

import './search.scss';

const Search: FunctionComponent = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<MemberInfoType[]>([]);
  const membersList = useMembersList();

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('click', () => query !== '' && setResults([]));
  }, [query]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentQuery = e.target.value;

    const currentResults = currentQuery
      ? membersList
        .filter((member: MemberInfoType) => member.name.toLowerCase().includes(currentQuery.toLowerCase()))
        .sort((member1: MemberInfoType, member2: MemberInfoType) => {
          if (member1.details?.recDate && member2.details?.recDate) {
            return member2.details.recDate.diff(member1.details.recDate);
          }

          return member1.name > member2.name ? 1 : -1;
        })
      : [];

    setQuery(currentQuery);
    setResults(currentResults);
  };

  const handleResultClick = (memberId: MemberIdType) => {
    dispatch(setHighlightedMemberAction(memberId));
    setQuery('');
    setResults([]);
  };

  return (
    <div className="search">
      <input
        onChange={handleChange}
        onFocus={handleChange}
        onClick={(e) => e.stopPropagation()}
        className="search__input"
        type="text"
        placeholder="Кого шукаєш?"
        value={query}
      />
      <div className="search__results">
        {results.map((result) => (
          <Result
            key={result.id}
            query={query}
            name={result.name}
            status={result.status}
            onClick={() => handleResultClick(result.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
