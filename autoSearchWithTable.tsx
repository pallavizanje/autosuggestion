import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RecordItem } from "../hooks/useSearchSuggestions";

interface Props {
  results: RecordItem[];
  onSelect: (record: RecordItem) => void;
}

const SearchResultsGrid: React.FC<Props> = ({ results, onSelect }) => {
  const columnDefs: ColDef[] = [
    { headerName: "ID", field: "Matter_id", width: 100 },
    { headerName: "Name", field: "Matter_name", flex: 1 },
    { headerName: "DDM", field: "Dddm_id", flex: 1 },
    { headerName: "Description", field: "Description", flex: 2 },
    {
      headerName: "Action",
      field: "action",
      width: 120,
      cellRenderer: (params: ICellRendererParams) => (
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onSelect(params.data as RecordItem)}
        >
          Select
        </button>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
      <AgGridReact
        rowData={results}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={5}
      />
    </div>
  );
};

export default SearchResultsGrid;



import React from "react";
import { SearchType } from "../hooks/useSearchSuggestions";

interface Props {
  searchType: SearchType;
  searchValue: string;
  onSearchTypeChange: (type: SearchType) => void;
  onSearchValueChange: (value: string) => void;
  onClear: () => void;
}

const SearchBox: React.FC<Props> = ({
  searchType,
  searchValue,
  onSearchTypeChange,
  onSearchValueChange,
  onClear,
}) => {
  return (
    <div className="space-y-4 relative">
      {/* 🔽 Dropdown for search type */}
      <div>
        <label className="mr-2 font-medium">Search By:</label>
        <select
          value={searchType}
          onChange={(e) => onSearchTypeChange(e.target.value as SearchType)}
          className="border rounded p-2"
        >
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="ddm">DDM</option>
        </select>
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 pr-10 border rounded"
          placeholder={`Search by ${searchType}`}
          value={searchValue}
          onChange={(e) => onSearchValueChange(e.target.value)}
        />

        {searchValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
          >
            ❌
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;

import React, { useState, useEffect } from "react";
import SearchBox from "./SearchBox";
import SearchResultsGrid from "./SearchResultsGrid";
import { useSearchSuggestions, RecordItem, SearchType } from "../hooks/useSearchSuggestions";
import { useDebounce } from "../hooks/useDebounce";

const MainComponent: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>("id");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const { data, isFetching } = useSearchSuggestions(searchType, debouncedSearchValue);
  const [results, setResults] = useState<RecordItem[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);

  useEffect(() => {
    if (data && debouncedSearchValue) {
      setResults(data.flatMap((group) => group.record));
    } else {
      setResults([]);
    }
  }, [data, debouncedSearchValue]);

  const handleClear = () => {
    setSearchValue("");
    setResults([]);
    setSelectedRecord(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 border rounded shadow">
      <h1 className="text-xl font-bold">Matter Search</h1>

      <SearchBox
        searchType={searchType}
        searchValue={searchValue}
        onSearchTypeChange={setSearchType}
        onSearchValueChange={setSearchValue}
        onClear={handleClear}
      />

      {isFetching && <p className="text-sm text-gray-400 mt-1">Loading...</p>}

      {!isFetching && results.length > 0 && (
        <SearchResultsGrid results={results} onSelect={setSelectedRecord} />
      )}

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
