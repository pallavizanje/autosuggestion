// MainComponent.tsx
import React, { useState } from "react";
import SearchBox from "./SearchBox";
import SearchResultsGrid from "./SearchResultsGrid";

interface SearchResult {
  id: number;
  name: string;
  role: string;
}

const MainComponent: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsFetching(true);
    setSearchText(query);

    // Simulated API call
    setTimeout(() => {
      const mockData: SearchResult[] = [
        { id: 1, name: "Alice", role: "Admin" },
        { id: 2, name: "Bob", role: "User" },
        { id: 3, name: "Charlie", role: "Manager" },
        { id: 4, name: "David", role: "Analyst" },
        { id: 5, name: "Eve", role: "Developer" },
      ].filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      setResults(mockData);
      setIsFetching(false);
    }, 800);
  };

  const handleClear = () => {
    setResults([]);
    setSearchText("");
  };

  return (
    <div className="p-4 space-y-4">
      <SearchBox
        onSearch={handleSearch}
        onClear={handleClear}
        searchText={searchText}
      />
      {isFetching && (
        <p className="text-sm text-gray-400 mt-1">Loading...</p>
      )}
      {results.length > 0 && !isFetching && (
        <SearchResultsGrid results={results} />
      )}
    </div>
  );
};

export default MainComponent;

// SearchBox.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  searchText: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onClear, searchText }) => {
  const [input, setInput] = useState(searchText);

  const handleSearchClick = () => {
    if (input.trim() !== "") {
      onSearch(input);
    }
  };

  const handleClearClick = () => {
    setInput("");
    onClear();
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search..."
        className="border rounded p-2 w-64"
      />
      <button
        onClick={handleSearchClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      {input && (
        <button
          onClick={handleClearClick}
          className="text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
// SearchResultsGrid.tsx
import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface SearchResult {
  id: number;
  name: string;
  role: string;
}

interface Props {
  results: SearchResult[];
}

const SearchResultsGrid: React.FC<Props> = ({ results }) => {
  const columnDefs: ColDef[] = [
    { headerName: "ID", field: "id", width: 90 },
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Role", field: "role", flex: 1 },
    {
      headerName: "Select",
      field: "select",
      cellRenderer: () => (
        <select className="border rounded p-1">
          <option value="">Select</option>
          <option value="view">View</option>
          <option value="edit">Edit</option>
          <option value="delete">Delete</option>
        </select>
      ),
      width: 150,
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

