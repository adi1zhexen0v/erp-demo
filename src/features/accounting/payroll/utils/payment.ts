import { toNumber } from "@/shared/utils";

export interface PaymentDestination {
  employees: number;
  enpf: number;
  medical: number;
  tax: number;
  social: number;
}

export function calculatePaymentDestinations(payroll: {
  total_net_salary: string;
  total_opv: string;
  total_opvr: string;
  total_vosms: string;
  total_oosms: string;
  total_ipn: string;
  total_sn: string;
  total_so: string;
}): PaymentDestination {
  const opv = toNumber(payroll.total_opv);
  const opvr = toNumber(payroll.total_opvr);
  const vosms = toNumber(payroll.total_vosms);
  const oosms = toNumber(payroll.total_oosms);
  const ipn = toNumber(payroll.total_ipn);
  const sn = toNumber(payroll.total_sn);
  const so = toNumber(payroll.total_so);
  const net = toNumber(payroll.total_net_salary);

  return {
    employees: net,
    enpf: opv + opvr,
    medical: vosms + oosms,
    tax: ipn + sn,
    social: so,
  };
}

