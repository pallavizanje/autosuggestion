
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type SearchType = 'id' | 'name' | 'ddm';

export interface RecordType {
  matter_name: string;
  id: string;
  ddm: string;
  description: string;
}

interface ApiResponse {
  matter_id: string;
  records: RecordType[];
}

export const useSearchSuggestions = (type: SearchType, value: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['suggestions', type, value],
    queryFn: async () => {
      const res = await axios.get<ApiResponse>(`/api/search/${type}`, {
        params: { value },
      });
      return res.data;
    },
    enabled: !!value.trim(),
    staleTime: 30000,
  });
};



import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type SearchType = 'id' | 'name' | 'ddm';

export interface RecordType {
  matter_name: string;
  id: string;
  ddm: string;
  description: string;
}

interface ApiResponse {
  matter_id: string;
  records: RecordType[];
}

export const useSearchSuggestions = (type: SearchType, value: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['suggestions', type, value],
    queryFn: async () => {
      const res = await axios.get<ApiResponse>(`/api/search/${type}`, {
        params: { value },
      });
      return res.data;
    },
    enabled: !!value.trim(), // only when user types
    staleTime: 30000,
  });
};
