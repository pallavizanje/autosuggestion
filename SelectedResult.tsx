import React from "react";
import { AutoSuggestItem } from "./AutoSuggest";

type Props = {
  selected: AutoSuggestItem | null;
};

const SelectedResult: React.FC<Props> = ({ selected }) => {
  if (!selected) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Selected Item</h3>
      <pre className="text-sm text-gray-800 bg-white p-2 rounded">
        {JSON.stringify(selected, null, 2)}
      </pre>
    </div>
  );
};

export default SelectedResult;
