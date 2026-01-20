import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Calculator, Briefcase, Wallet, DocumentText } from "iconsax-react";
import { ModalForm } from "@/shared/ui";
import { TengeCircleIcon } from "@/shared/assets/icons";
import type { GPHPayment, ConstantsUsed } from "@/features/accounting/payroll";
import { getInitials } from "@/features/accounting/payroll";
import { AccrualTab, AccountingTab, PaymentTab, ReportingTab } from "./GPHPaymentDetailTabs";

interface Props {
  payment: GPHPayment | null;
  constants_used?: ConstantsUsed;
  onClose: () => void;
}

const TAB_IDS = {
  ACCRUAL: "accrual",
  ACCOUNTING: "accounting",
  PAYMENT: "payment",
  REPORTING: "reporting",
} as const;

type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

export default function GPHPaymentDetailModal({ payment, constants_used, onClose }: Props) {
  const { t } = useTranslation("PayrollPage");
  const [activeTab, setActiveTab] = useState<TabId>(TAB_IDS.ACCRUAL);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  if (!payment) return null;

  const tabs = [
    { id: TAB_IDS.ACCRUAL, label: t("tabs.accrual.title"), icon: Calculator },
    { id: TAB_IDS.ACCOUNTING, label: t("tabs.accounting.title"), icon: Briefcase },
    { id: TAB_IDS.PAYMENT, label: t("tabs.payment.title"), icon: Wallet },
    { id: TAB_IDS.REPORTING, label: t("tabs.reporting.title"), icon: DocumentText },
  ];

  const initials = getInitials(payment.contractor_name);
  const titleText = t("detail.gphPayment.title");
  const isPaid = payment.status === "paid";

  function renderTabContent() {
    if (!payment) return null;
    switch (activeTab) {
      case TAB_IDS.ACCRUAL:
        return <AccrualTab payment={payment} constants_used={constants_used} isFullScreen={isFullScreen} />;
      case TAB_IDS.ACCOUNTING:
        return <AccountingTab payment={payment} isFullScreen={isFullScreen} />;
      case TAB_IDS.PAYMENT:
        return <PaymentTab payment={payment} isFullScreen={isFullScreen} />;
      case TAB_IDS.REPORTING:
        return <ReportingTab payment={payment} isPaid={isPaid} isFullScreen={isFullScreen} />;
      default:
        return null;
    }
  }

  return (
    <>
      <title>{titleText}</title>
      <ModalForm icon={TengeCircleIcon} onClose={onClose} resize onFullScreenChange={setIsFullScreen}>
        <div className="flex flex-col h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke pt-2">
            <h4 className="text-display-2xs content-base-primary">{titleText}</h4>
          </div>

          <div className="flex items-center gap-4 py-5 border-b surface-base-stroke">
            <div className="w-14 aspect-square rounded-full flex items-center justify-center background-brand-subtle">
              <span className="text-black text-xl font-bold">{initials}</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-label-lg content-base-primary">{payment.contractor_name}</p>
              <p className="text-label-sm content-action-neutral">{payment.contractor_iin}</p>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex gap-1 border-b surface-base-stroke">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 transition-all relative cursor-pointer",
                      isActive ? "content-action-brand" : "content-base-secondary hover:content-base-primary",
                    )}>
                    <Icon size={16} color="currentColor" variant={isActive ? "Bold" : "Linear"} />
                    <span className={cn("text-label-sm", isActive && "font-semibold")}>{tab.label}</span>
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex-1 py-5 min-h-0 overflow-y-auto page-scroll pr-2">
            {renderTabContent()}
          </div>
        </div>
      </ModalForm>
    </>
  );
}
