import React, { useState } from 'react';
import { useSearchSuggestions, RecordType, SearchType } from '../hooks/useSearchSuggestions';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  onSelect: (record: RecordType) => void;
}

const SearchBox: React.FC<Props> = ({ onSelect }) => {
  const [searchType, setSearchType] = useState<SearchType>('id');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 400); // debounce by 400ms

  const { data, isFetching } = useSearchSuggestions(searchType, debouncedSearchValue);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {(['id', 'name', 'ddm'] as SearchType[]).map((type) => (
          <label key={type}>
            <input
              type="radio"
              checked={searchType === type}
              onChange={() => setSearchType(type)}
            />{' '}
            {type.toUpperCase()}
          </label>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder={`Search by ${searchType}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {isFetching && <p className="text-sm text-gray-400 mt-1">Loading...</p>}

        {data?.records?.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
            {data.records.map((rec) => (
              <li
                key={rec.id}
                onClick={() => onSelect(rec)}
                className="p-2 hover:bg-blue-100 cursor-pointer"
              >
                <div className="font-medium">{rec.matter_name}</div>
                <div className="text-xs text-gray-500">
                  ID: {rec.id} | DDM: {rec.ddm}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
