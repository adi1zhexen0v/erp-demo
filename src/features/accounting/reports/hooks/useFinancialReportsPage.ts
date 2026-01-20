import { useState, useMemo, useCallback } from "react";
import {
  useGetPLReportQuery,
  useGetBalanceSheetQuery,
  useGetCashFlowQuery,
  useGetTrialBalanceQuery,
  useGetDepreciationReportQuery,
} from "../api";
import { getPeriodDates } from "../utils";

const CURRENT_YEAR = new Date().getFullYear();

export function useFinancialReportsPage() {
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [month, setMonth] = useState<number | null>(null);
  const [appliedYear, setAppliedYear] = useState<number>(CURRENT_YEAR);
  const [appliedMonth, setAppliedMonth] = useState<number | null>(null);

  const appliedPeriodDates = useMemo(() => getPeriodDates(appliedYear, appliedMonth), [appliedYear, appliedMonth]);

  const { start_date, end_date } = appliedPeriodDates;

  const plReportQuery = useGetPLReportQuery({ start_date, end_date });
  const balanceSheetQuery = useGetBalanceSheetQuery({
    as_of_date: end_date,
    period_start_date: start_date,
  });
  const cashFlowQuery = useGetCashFlowQuery({ start_date, end_date });
  const trialBalanceQuery = useGetTrialBalanceQuery({ start_date, end_date });
  const depreciationReportQuery = useGetDepreciationReportQuery({ report_date: end_date });

  const hasPeriodChanged = useMemo(() => {
    return year !== appliedYear || month !== appliedMonth;
  }, [year, month, appliedYear, appliedMonth]);

  const handleRefresh = useCallback(async () => {
    setAppliedYear(year);
    setAppliedMonth(month);
  }, [year, month]);

  const periodDates = useMemo(() => getPeriodDates(year, month), [year, month]);

  const isFetchingAny =
    plReportQuery.isFetching ||
    balanceSheetQuery.isFetching ||
    cashFlowQuery.isFetching ||
    trialBalanceQuery.isFetching ||
    depreciationReportQuery.isFetching;

  return {
    year,
    month,
    setYear,
    setMonth,
    appliedYear,
    appliedMonth,
    periodDates,
    appliedPeriodDates,
    plReport: plReportQuery.data,
    balanceSheet: balanceSheetQuery.data,
    cashFlow: cashFlowQuery.data,
    trialBalance: trialBalanceQuery.data,
    depreciationReport: depreciationReportQuery.data,
    isLoadingPLReport: plReportQuery.isLoading,
    isLoadingBalanceSheet: balanceSheetQuery.isLoading,
    isLoadingCashFlow: cashFlowQuery.isLoading,
    isLoadingTrialBalance: trialBalanceQuery.isLoading,
    isLoadingDepreciationReport: depreciationReportQuery.isLoading,
    isFetchingAny,
    plReportError: plReportQuery.isError,
    balanceSheetError: balanceSheetQuery.isError,
    cashFlowError: cashFlowQuery.isError,
    trialBalanceError: trialBalanceQuery.isError,
    depreciationReportError: depreciationReportQuery.isError,
    hasPeriodChanged,
    handleRefresh,
    refetchPLReport: plReportQuery.refetch,
    refetchBalanceSheet: balanceSheetQuery.refetch,
    refetchCashFlow: cashFlowQuery.refetch,
    refetchTrialBalance: trialBalanceQuery.refetch,
    refetchDepreciationReport: depreciationReportQuery.refetch,
  };
}

