import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { useQuery } from "@tanstack/react-query";

export type AutoSuggestItem = {
  id: number | string;
  [key: string]: any;
};

type Props<T extends AutoSuggestItem> = {
  dataFetcher: (query: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  displayFields: {
    label: string;
    subLabel?: string;
    id?: string;
  };
  placeholder?: string;
  debounceMs?: number;
};

const resolvePath = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const AutoSuggest = <T extends AutoSuggestItem>({
  dataFetcher,
  onSelect,
  displayFields,
  placeholder = "Search...",
  debounceMs = 300,
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), debounceMs);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["autosuggest", debouncedTerm],
    queryFn: () => dataFetcher(debouncedTerm),
    enabled: debouncedTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const handleClear = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setHighlightIndex(-1);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    const labelValue = resolvePath(item, displayFields.label);
    setSearchTerm(labelValue || "");
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      handleSelect(suggestions[highlightIndex]);
    }
  };

  useEffect(() => {
    if (suggestionsRef.current && highlightIndex >= 0) {
      const activeItem = suggestionsRef.current.children[highlightIndex] as HTMLElement;
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  return (
    <div className="w-full max-w-md mx-auto relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 px-4 py-2 rounded shadow pr-10"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
        >
          ×
        </button>
      )}

      {isLoading && (
        <div className="text-sm mt-1 text-gray-600">Loading...</div>
      )}

      {!isLoading && debouncedTerm.trim() && (
        <ul
          ref={suggestionsRef}
          className="border border-gray-300 rounded mt-1 bg-white max-h-40 overflow-auto shadow"
        >
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`px-4 py-2 cursor-pointer flex justify-between items-center text-sm ${
                  highlightIndex === index
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="flex-1">
                  {resolvePath(item, displayFields.label)}
                </span>
                {displayFields.subLabel && (
                  <span className="w-24 text-gray-500 text-right">
                    {resolvePath(item, displayFields.subLabel)}
                  </span>
                )}
                {displayFields.id && (
                  <span className="w-16 text-gray-400 text-right">
                    {resolvePath(item, displayFields.id)}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500 italic">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggest;
