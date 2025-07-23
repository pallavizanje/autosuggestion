export type DataItem = {
  id: number;
  result: {
    name: string;
    ddmname: string;
  };
};

const MOCK_DATA: DataItem[] = [
  { id: 11212, result: { name: "Testing A", ddmname: "DDM1" } },
  { id: 11213, result: { name: "Alpha Test", ddmname: "DDM2" } },
  { id: 11214, result: { name: "Beta User", ddmname: "DDM3" } },
  { id: 11215, result: { name: "Gamma Code", ddmname: "DDM4" } },
  { id: 11216, result: { name: "TestUser QA", ddmname: "DDM5" } },
];

export const fetchSuggestions = async (search: string): Promise<DataItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = search.toLowerCase();
      const results = MOCK_DATA.filter(
        (item) =>
          item.id.toString().includes(lower) ||
          item.result.name.toLowerCase().includes(lower) ||
          item.result.ddmname.toLowerCase().includes(lower)
      );
      resolve(results);
    }, 500);
  });
};
