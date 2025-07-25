import React, { useState } from 'react';
import { useSearchSuggestions, RecordItem, SearchType } from '../hooks/useSearchSuggestions';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  onSelect: (record: RecordItem) => void;
}

const SearchBox: React.FC<Props> = ({ onSelect }) => {
  const [searchType, setSearchType] = useState<SearchType>('id');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const { data, isFetching } = useSearchSuggestions(searchType, debouncedSearchValue);

  const handleClear = () => setSearchValue('');

  return (
    <div className="space-y-4 relative">
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
          className="w-full p-2 pr-10 border rounded"
          placeholder={`Search by ${searchType}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
          >
            ❌
          </button>
        )}

        {isFetching && <p className="text-sm text-gray-400 mt-1">Loading...</p>}

        {data && data.length > 0 && searchValue && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
            {data.flatMap((group) =>
              group.record.map((rec) => (
                <li
                  key={`${group.Matter_id}-${rec.Matter_id}`}
                  onClick={() => onSelect(rec)}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  <div className="font-medium">{rec.Matter_name}</div>
                  <div className="text-xs text-gray-500">
                    ID: {rec.Matter_id} | DDM: {rec.Dddm_id}
                  </div>
                  <div className="text-xs text-gray-400 italic">
                    {rec.Description}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
import React, { useState } from 'react';
import SearchBox from './SearchBox';
import { RecordItem } from '../hooks/useSearchSuggestions';

const MainComponent: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 border rounded shadow">
      <h1 className="text-xl font-bold">Matter Search</h1>

      <SearchBox onSelect={setSelectedRecord} />

      {selectedRecord && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Selected Record</h2>
          <p><strong>Name:</strong> {selectedRecord.Matter_name}</p>
          <p><strong>ID:</strong> {selectedRecord.Matter_id}</p>
          <p><strong>DDM:</strong> {selectedRecord.Dddm_id}</p>
          <p><strong>Description:</strong> {selectedRecord.Description}</p>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
