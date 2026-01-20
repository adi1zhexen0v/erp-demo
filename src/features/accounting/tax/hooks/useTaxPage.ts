import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import { formatDateYYYYMMDD } from "@/shared/utils";
import {
  useGetCitForm100Query,
  useGetCitForm10001Query,
  useGetCitForm10002Query,
  useGetCitForm10007Query,
  useGetPayrollTaxForm200Query,
  useGetPayrollTaxForm20001Query,
  useGetPayrollTaxForm20005Query,
} from "../api";
import type { TaxType } from "../consts";
import { DEFAULT_CIT_FORM, DEFAULT_PAYROLL_FORM } from "../consts";

export interface UseTaxPageReturn {
  taxType: TaxType;
  setTaxType: (type: TaxType) => void;
  year: number | null;
  setYear: (year: number | null) => void;
  quarter: number | null;
  setQuarter: (quarter: number | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  includeGph: boolean;
  setIncludeGph: (include: boolean) => void;
  activeForm: string;
  setActiveForm: (form: string) => void;
  isReportGenerated: { cit: boolean; payroll: boolean };
  generateReport: (type: TaxType) => void;

  form100Data: ReturnType<typeof useGetCitForm100Query>["data"];
  form100Loading: boolean;
  form100Error: boolean;
  form10001Data: ReturnType<typeof useGetCitForm10001Query>["data"];
  form10001Loading: boolean;
  form10001Error: boolean;
  form10002Data: ReturnType<typeof useGetCitForm10002Query>["data"];
  form10002Loading: boolean;
  form10002Error: boolean;
  form10007Data: ReturnType<typeof useGetCitForm10007Query>["data"];
  form10007Loading: boolean;
  form10007Error: boolean;

  form200Data: ReturnType<typeof useGetPayrollTaxForm200Query>["data"];
  form200Loading: boolean;
  form200Error: boolean;
  form20001Data: ReturnType<typeof useGetPayrollTaxForm20001Query>["data"];
  form20001Loading: boolean;
  form20001Error: boolean;
  form20005Data: ReturnType<typeof useGetPayrollTaxForm20005Query>["data"];
  form20005Loading: boolean;
  form20005Error: boolean;

  locale: Locale;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useTaxPage(): UseTaxPageReturn {
  const { i18n, t } = useTranslation("TaxPage");
  const locale = i18n.language as Locale;

  const [taxType, setTaxType] = useState<TaxType>("cit");
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<number | null>(1);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [includeGph, setIncludeGph] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<string>(DEFAULT_CIT_FORM);
  const [isReportGenerated, setIsReportGenerated] = useState<{ cit: boolean; payroll: boolean }>({
    cit: false,
    payroll: false,
  });

  useEffect(() => {
    if (taxType === "cit") {
      setActiveForm(DEFAULT_CIT_FORM);
    } else {
      setActiveForm(DEFAULT_PAYROLL_FORM);
    }
  }, [taxType]);

  useEffect(() => {
    setIsReportGenerated((prev) => ({ ...prev, cit: false }));
  }, [year, endDate]);

  useEffect(() => {
    setIsReportGenerated((prev) => ({ ...prev, payroll: false }));
  }, [year, quarter, includeGph]);

  function generateReport(type: TaxType) {
    setIsReportGenerated((prev) => ({ ...prev, [type]: true }));
  }

  const citParams = useMemo(() => {
    if (!year) return null;
    return {
      year,
      ...(endDate && { end_date: formatDateYYYYMMDD(endDate) }),
    };
  }, [year, endDate]);

  const payrollParams = useMemo(() => {
    if (!year || !quarter) return null;
    return {
      year,
      quarter,
      ...(includeGph && { include_gph: includeGph }),
    };
  }, [year, quarter, includeGph]);

  const form100Query = useGetCitForm100Query(citParams || { year: 0 }, {
    skip: !citParams || !isReportGenerated.cit,
  });

  const form10001Query = useGetCitForm10001Query(citParams || { year: 0 }, {
    skip: !citParams || !isReportGenerated.cit,
  });

  const form10002Query = useGetCitForm10002Query(citParams || { year: 0 }, {
    skip: !citParams || !isReportGenerated.cit,
  });

  const form10007Query = useGetCitForm10007Query(
    citParams
      ? {
          year: citParams.year,
          ...(citParams.end_date && { as_of_date: citParams.end_date }),
        }
      : { year: 0 },
    {
      skip: !citParams || !isReportGenerated.cit,
    },
  );

  const form200Query = useGetPayrollTaxForm200Query(payrollParams || { year: 0, quarter: 1 }, {
    skip: !payrollParams || !isReportGenerated.payroll,
  });

  const form20001Query = useGetPayrollTaxForm20001Query(payrollParams || { year: 0, quarter: 1 }, {
    skip: !payrollParams || !isReportGenerated.payroll,
  });

  const form20005Query = useGetPayrollTaxForm20005Query(payrollParams || { year: 0, quarter: 1 }, {
    skip: !payrollParams || !isReportGenerated.payroll,
  });

  return {
    taxType,
    setTaxType,
    year,
    setYear,
    quarter,
    setQuarter,
    endDate,
    setEndDate,
    includeGph,
    setIncludeGph,
    activeForm,
    setActiveForm,
    isReportGenerated,
    generateReport,

    form100Data: form100Query.data,
    form100Loading: form100Query.isLoading,
    form100Error: form100Query.isError,
    form10001Data: form10001Query.data,
    form10001Loading: form10001Query.isLoading,
    form10001Error: form10001Query.isError,
    form10002Data: form10002Query.data,
    form10002Loading: form10002Query.isLoading,
    form10002Error: form10002Query.isError,
    form10007Data: form10007Query.data,
    form10007Loading: form10007Query.isLoading,
    form10007Error: form10007Query.isError,

    form200Data: form200Query.data,
    form200Loading: form200Query.isLoading,
    form200Error: form200Query.isError,
    form20001Data: form20001Query.data,
    form20001Loading: form20001Query.isLoading,
    form20001Error: form20001Query.isError,
    form20005Data: form20005Query.data,
    form20005Loading: form20005Query.isLoading,
    form20005Error: form20005Query.isError,

    locale,
    t,
  };
}

