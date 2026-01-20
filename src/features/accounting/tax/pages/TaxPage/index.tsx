import { lazy, Suspense } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { useScrollDetection } from "@/shared/hooks";
import { Tabs , Toast } from "@/shared/ui";
import { useTaxPage } from "../../hooks";
import { MAIN_TAB_ICONS } from "../../consts";
import { TaxHeader, TaxParametersForm, DeclarationHeader, TaxTabs, TaxFormSkeleton } from "./components";

const TaxContent = lazy(() => import("./components/TaxContent").then((m) => ({ default: m.default })));


export default function TaxPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const { t } = useTranslation("TaxPage");

  const {
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
    form100Data,
    form100Loading,
    form100Error,
    form10001Data,
    form10001Loading,
    form10001Error,
    form10002Data,
    form10002Loading,
    form10002Error,
    form10007Data,
    form10007Loading,
    form10007Error,
    form200Data,
    form200Loading,
    form200Error,
    form20001Data,
    form20001Loading,
    form20001Error,
    form20005Data,
    form20005Loading,
    form20005Error,
    locale,
  } = useTaxPage();

  const mainTabItems = [
    {
      id: "cit",
      label: t("tabs.main.cit"),
      icon: (
        <span className="content-action-brand">
          <MAIN_TAB_ICONS.cit size={20} color="currentColor" />
        </span>
      ),
    },
    {
      id: "payroll",
      label: t("tabs.main.payroll"),
      icon: (
        <span className="content-action-brand">
          <MAIN_TAB_ICONS.payroll size={20} color="currentColor" />
        </span>
      ),
    },
  ];

  const isReportGeneratedForCurrentType = isReportGenerated[taxType];

  function handleGenerate() {
    generateReport(taxType);
  }

  const isLoadingAnyForm =
    taxType === "cit"
      ? form100Loading || form10001Loading || form10002Loading || form10007Loading
      : form200Loading || form20001Loading || form20005Loading;

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <TaxHeader />

          <div className="mb-6">
            <Tabs items={mainTabItems} activeId={taxType} onChange={(id) => setTaxType(id as typeof taxType)} />
          </div>

          {!isReportGeneratedForCurrentType ? (
            <TaxParametersForm
              taxType={taxType}
              year={year}
              onYearChange={setYear}
              quarter={quarter}
              onQuarterChange={setQuarter}
              endDate={endDate}
              onEndDateChange={setEndDate}
              includeGph={includeGph}
              onIncludeGphChange={setIncludeGph}
              locale={locale}
              onGenerate={handleGenerate}
            />
          ) : (
            <div className="p-5 border surface-base-stroke radius-lg">
              {isLoadingAnyForm ? (
                <TaxFormSkeleton />
              ) : (
                <>
                  <DeclarationHeader taxType={taxType} activeForm={activeForm} year={year} quarter={quarter} />

                  <TaxTabs taxType={taxType} activeForm={activeForm} onFormChange={setActiveForm} />

                  <div className="my-4">
                    <Toast color="grey" text={t("toast.info")} closable={false} autoClose={false} isFullWidth />
                  </div>

                  <Suspense fallback={<TaxFormSkeleton />}>
                    <TaxContent
                      taxType={taxType}
                      activeForm={activeForm}
                      form100Data={form100Data}
                      form100Loading={form100Loading}
                      form100Error={form100Error}
                      form10001Data={form10001Data}
                      form10001Loading={form10001Loading}
                      form10001Error={form10001Error}
                      form10002Data={form10002Data}
                      form10002Loading={form10002Loading}
                      form10002Error={form10002Error}
                      form10007Data={form10007Data}
                      form10007Loading={form10007Loading}
                      form10007Error={form10007Error}
                      form200Data={form200Data}
                      form200Loading={form200Loading}
                      form200Error={form200Error}
                      form20001Data={form20001Data}
                      form20001Loading={form20001Loading}
                      form20001Error={form20001Error}
                      form20005Data={form20005Data}
                      form20005Loading={form20005Loading}
                      form20005Error={form20005Error}
                    />
                  </Suspense>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
