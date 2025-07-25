import React, { useState } from 'react';
import SearchBox from './SearchBox';
import { RecordType } from '../hooks/useSearchSuggestions';

const MainComponent: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 border rounded shadow">
      <h1 className="text-xl font-bold">Matter Search</h1>

      <SearchBox onSelect={setSelectedRecord} />

      {selectedRecord && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Selected Record</h2>
          <p><strong>Name:</strong> {selectedRecord.matter_name}</p>
          <p><strong>ID:</strong> {selectedRecord.id}</p>
          <p><strong>DDM:</strong> {selectedRecord.ddm}</p>
          <p><strong>Description:</strong> {selectedRecord.description}</p>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
