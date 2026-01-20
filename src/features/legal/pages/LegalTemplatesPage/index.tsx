import { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { useGetCommercialOrganizationsQuery } from "../../api";
import { TemplatesHeader, LegalTemplatesPageSkeleton } from "./components";

const TemplatesCardsView = lazy(() => import("./components/TemplatesCardsView").then((m) => ({ default: m.default })));
const CreateConsultationForm = lazy(() => import("../LegalConsultationsPage/components").then((m) => ({ default: m.CreateConsultationForm })));

export default function LegalTemplatesPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [consultationFormOpen, setConsultationFormOpen] = useState(false);
  const { t } = useTranslation("LegalTemplatesPage");
  const { data: commercialOrganizations = [], isLoading: isLoadingOrganizations } =
    useGetCommercialOrganizationsQuery();

  if (isLoadingOrganizations) {
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
            <TemplatesHeader onOpenForm={() => setConsultationFormOpen(true)} />
            <LegalTemplatesPageSkeleton />
          </div>
        </section>
      </>
    );
  }

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
          <TemplatesHeader onOpenForm={() => setConsultationFormOpen(true)} />
          <Suspense fallback={<LegalTemplatesPageSkeleton />}>
            <TemplatesCardsView commercialOrganizations={commercialOrganizations} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
