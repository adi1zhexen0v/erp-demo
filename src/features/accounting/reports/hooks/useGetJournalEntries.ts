import { useGetJournalEntriesQuery } from "../api";

interface UseGetJournalEntriesParams {
  start_date: string;
  end_date: string;
}

export function useGetJournalEntries(params: UseGetJournalEntriesParams) {
  const { start_date, end_date } = params;

  const query = useGetJournalEntriesQuery({
    start_date,
    end_date,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

