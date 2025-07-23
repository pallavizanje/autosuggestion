import React, { useState } from "react";
import AutoSuggest, { AutoSuggestItem } from "./components/AutoSuggest";
import SelectedResult from "./components/SelectedResult";
import { fetchSuggestions } from "./api/mockApi";

const App: React.FC = () => {
  const [selected, setSelected] = useState<AutoSuggestItem | null>(null);

  return (
    <div className="p-6">
      <AutoSuggest
        dataFetcher={fetchSuggestions}
        onSelect={setSelected}
        displayFields={{
          label: "result.name",
          subLabel: "result.ddmname",
          id: "id",
        }}
        placeholder="Search by name, ID, or DDM name"
      />
      <SelectedResult selected={selected} />
    </div>
  );
};

export default App;
