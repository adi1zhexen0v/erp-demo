import { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { CasesHeader, CasesCardsSkeleton } from "./components";

const CasesCardsView = lazy(() => import("./components/CasesCardsView").then((m) => ({ default: m.default })));
const CreateConsultationForm = lazy(() => import("../LegalConsultationsPage/components").then((m) => ({ default: m.CreateConsultationForm })));

export default function LegalCasesPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [consultationFormOpen, setConsultationFormOpen] = useState(false);
  const { t } = useTranslation("LegalCasesPage");
  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        {consultationFormOpen && (
          <Suspense fallback={null}>
            <CreateConsultationForm onClose={() => setConsultationFormOpen(false)} />
          </Suspense>
        )}
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <CasesHeader onOpenForm={() => setConsultationFormOpen(true)} />
          <Suspense fallback={<CasesCardsSkeleton />}>
            <CasesCardsView />
          </Suspense>
        </div>
      </section>
    </>
  );
}
