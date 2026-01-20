import { type ComponentType } from "react";
import {
  HR_APPLY_PAGE_ROUTE,
  HR_CONTRACTS_PAGE_ROUTE,
  HR_EMPLOYEES_PAGE_ROUTE,
  HR_HIRING_PAGE_ROUTE,
  HR_LEAVES_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  HR_FILL_CONTRACT_PAGE_ROUTE,
  LEGAL_CONSULTATION_PAGE_ROUTE,
  LEGAL_TEMPLATES_PAGE_ROUTE,
  LEGAL_CASES_PAGE_ROUTE,
  LEGAL_APPLICATIONS_PAGE_ROUTE,
  ACCOUNTING_TIMESHEETS_PAGE_ROUTE,
  ACCOUNTING_TIMESHEET_DETAIL_PAGE_ROUTE,
  ACCOUNTING_PAYROLLS_PAGE_ROUTE,
  ACCOUNTING_PAYROLL_DETAIL_PAGE_ROUTE,
  ACCOUNTING_PURCHASES_PAGE_ROUTE,
  ACCOUNTING_WAREHOUSE_PAGE_ROUTE,
  WAREHOUSE_PUBLIC_UNIT_PAGE_ROUTE,
  ACCOUNTING_REPORTS_PAGE_ROUTE,
  ACCOUNTING_TAX_ROUTE,
  ACCOUNTING_RENTALS_PAGE_ROUTE,
  FINANCE_PAGE_ROUTE,
} from "@/shared/utils";
import { LoginPage } from "@/features/auth";
import { EmployeesPage } from "@/features/hr/employees";
import { HiringPage, ApplyApplicationPage } from "@/features/hr/hiring";
import { ContractsListPage, FillContractPage } from "@/features/hr/contracts";
import { LeaveApplicationsPage } from "@/features/hr/leave-applications";
import {
  LegalConsultationsPage,
  LegalTemplatesPage,
  LegalCasesPage,
  LegalApplicationsPage,
} from "@/features/legal";
import { TimesheetsPage, TimesheetDetailPage } from "@/features/accounting/timesheets";
import { PayrollsPage, PayrollDetailPage } from "@/features/accounting/payroll";
import { PurchasesPage } from "@/features/accounting/purchases";
import { WarehousePage, PublicUnitPage } from "@/features/accounting/warehouse";
import { ReportsPage } from "@/features/accounting/reports";
import { TaxPage } from "@/features/accounting/tax";
import { RentalsPage } from "@/features/accounting/rentals";
import { FinancePage } from "@/features/finance";

export interface AppRoute {
  path: string;
  element: ComponentType;
  public?: boolean;
}

export const publicRoutes: AppRoute[] = [
  {
    path: LOGIN_PAGE_ROUTE,
    element: LoginPage,
    public: true,
  },
  {
    path: HR_APPLY_PAGE_ROUTE,
    element: ApplyApplicationPage,
    public: true,
  },
  {
    path: WAREHOUSE_PUBLIC_UNIT_PAGE_ROUTE,
    element: PublicUnitPage,
    public: true,
  },
];

export const privateRoutes: AppRoute[] = [
  {
    path: HR_EMPLOYEES_PAGE_ROUTE,
    element: EmployeesPage,
  },
  {
    path: HR_HIRING_PAGE_ROUTE,
    element: HiringPage,
  },
  {
    path: HR_CONTRACTS_PAGE_ROUTE,
    element: ContractsListPage,
  },
  {
    path: HR_LEAVES_PAGE_ROUTE,
    element: LeaveApplicationsPage,
  },
  {
    path: HR_FILL_CONTRACT_PAGE_ROUTE,
    element: FillContractPage,
  },
  {
    path: LEGAL_CONSULTATION_PAGE_ROUTE,
    element: LegalConsultationsPage,
  },
  {
    path: LEGAL_TEMPLATES_PAGE_ROUTE,
    element: LegalTemplatesPage,
  },
  {
    path: LEGAL_CASES_PAGE_ROUTE,
    element: LegalCasesPage,
  },
  {
    path: LEGAL_APPLICATIONS_PAGE_ROUTE,
    element: LegalApplicationsPage,
  },
  {
    path: ACCOUNTING_TIMESHEETS_PAGE_ROUTE,
    element: TimesheetsPage,
  },
  {
    path: ACCOUNTING_TIMESHEET_DETAIL_PAGE_ROUTE,
    element: TimesheetDetailPage,
  },
  {
    path: ACCOUNTING_PAYROLLS_PAGE_ROUTE,
    element: PayrollsPage,
  },
  {
    path: ACCOUNTING_PAYROLL_DETAIL_PAGE_ROUTE,
    element: PayrollDetailPage,
  },
  {
    path: ACCOUNTING_PURCHASES_PAGE_ROUTE,
    element: PurchasesPage,
  },
  {
    path: ACCOUNTING_WAREHOUSE_PAGE_ROUTE,
    element: WarehousePage,
  },
  {
    path: ACCOUNTING_TAX_ROUTE,
    element: TaxPage,
  },
  {
    path: ACCOUNTING_REPORTS_PAGE_ROUTE,
    element: ReportsPage,
  },
  {
    path: ACCOUNTING_RENTALS_PAGE_ROUTE,
    element: RentalsPage,
  },
  {
    path: FINANCE_PAGE_ROUTE,
    element: FinancePage,
  },
];

