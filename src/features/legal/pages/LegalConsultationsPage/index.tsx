import { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { ConsultationHeader, ConsultationCardsSkeleton } from "./components";

const ConsultationCardsView = lazy(() => import("./components/ConsultationCardsView").then((m) => ({ default: m.default })));
const CreateConsultationForm = lazy(() => import("../../components/CreateConsultationForm").then((m) => ({ default: m.default })));

export default function LegalConsultationsPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [CreateConsultationFormOpen, setCreateConsultationFormOpen] = useState(false);
  const { t } = useTranslation("LegalConsultationsPage");

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        {CreateConsultationFormOpen && (
          <Suspense fallback={null}>
            <CreateConsultationForm onClose={() => setCreateConsultationFormOpen(false)} />
          </Suspense>
        )}
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <ConsultationHeader onOpenForm={() => setCreateConsultationFormOpen(true)} />
          <Suspense fallback={<ConsultationCardsSkeleton />}>
            <ConsultationCardsView />
          </Suspense>
        </div>
      </section>
    </>
  );
}
