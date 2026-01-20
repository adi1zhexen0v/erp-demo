import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Prompt, PromptForm } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { useRentalPaymentsListPage, useRentalModals, useRentalMutations } from "../../hooks";
import type { RentalPaymentListItem } from "../../types";
import {
  RentalsHeader,
  RentalsPageSkeleton,
} from "./components";

const PaymentsSection = lazy(() => import("./components/PaymentsSection").then((m) => ({ default: m.default })));
const PaymentCreateModal = lazy(() => import("./components/PaymentCreateModal").then((m) => ({ default: m.default })));
const PaymentEditModal = lazy(() => import("./components/PaymentEditModal").then((m) => ({ default: m.default })));
const PaymentDetailsModal = lazy(() => import("./components/PaymentDetailsModal").then((m) => ({ default: m.default })));

export default function RentalsPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const { t } = useTranslation("RentalsPage");

  const paymentsListPage = useRentalPaymentsListPage();

  const {
    createModal,
    setCreateModal,
    editModal,
    setEditModal,
    detailModal,
    setDetailModal,
    confirmDelete,
    setConfirmDelete,
    confirmApprove,
    setConfirmApprove,
    confirmMarkPaid,
    setConfirmMarkPaid,
    prompt,
    setPrompt,
  } = useRentalModals();

  const {
    creating,
    approvingId,
    markingPaidId,
    deletingId,
    extractingOCR,
    isApproving,
    isMarkingPaid,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleExtractOCR,
    setPrompt: _setMutationPrompt,
  } = useRentalMutations(setPrompt);

  function handleOpenPayment(id: number) {
    const payment = paymentsListPage.data?.find((p) => p.id === id);
    if (payment) {
      setDetailModal(payment);
    }
  }

  function handleEditPayment(payment: RentalPaymentListItem) {
    setEditModal(payment);
  }

  async function handleApproveConfirm(id: number) {
    await handleApprove(id);
    setConfirmApprove(null);
  }

  async function handleMarkPaidConfirm(id: number) {
    await handleMarkPaid(id);
    setConfirmMarkPaid(null);
  }

  async function handleDeleteConfirm(id: number) {
    await handleDelete(id);
    setConfirmDelete(null);
  }

  const isLoading = paymentsListPage.isLoading;
  const isError = paymentsListPage.isError;

  if (isLoading && !paymentsListPage.data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <RentalsHeader showCreateButton onCreateClick={() => setCreateModal(true)} />
            <RentalsPageSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <RentalsHeader showCreateButton onCreateClick={() => setCreateModal(true)} />
          <p className="mt-4 text-body-regular-md text-negative-500">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <RentalsHeader showCreateButton onCreateClick={() => setCreateModal(true)} />

          <Suspense fallback={<RentalsPageSkeleton />}>
            <PaymentsSection
              listPage={paymentsListPage}
              onOpen={handleOpenPayment}
              onEdit={handleEditPayment}
              onApprove={(id) => setConfirmApprove(id)}
              onMarkPaid={(id) => setConfirmMarkPaid(id)}
              onDelete={(id) => setConfirmDelete(id)}
              approvingId={approvingId}
              markingPaidId={markingPaidId}
              deletingId={deletingId}
              isAnyModalOpen={createModal || !!editModal || !!detailModal}
            />
          </Suspense>
        </div>
      </section>

      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
          namespace="RentalsPage"
        />
      )}

      {confirmDelete !== null && (
        <PromptForm
          title={t("confirm.deleteTitle")}
          text={t("confirm.deleteText")}
          variant="error"
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDeleteConfirm(confirmDelete)}
          isLoading={isDeleting}
          confirmText={t("confirm.deleteConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="RentalsPage"
        />
      )}

      {confirmApprove !== null && (
        <PromptForm
          title={t("confirm.approveTitle")}
          text={t("confirm.approveText")}
          variant="warning"
          onClose={() => setConfirmApprove(null)}
          onConfirm={() => handleApproveConfirm(confirmApprove)}
          isLoading={isApproving}
          confirmText={t("confirm.approveConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="RentalsPage"
        />
      )}

      {confirmMarkPaid !== null && (
        <PromptForm
          title={t("confirm.markPaidTitle")}
          text={t("confirm.markPaidText")}
          variant="warning"
          onClose={() => setConfirmMarkPaid(null)}
          onConfirm={() => handleMarkPaidConfirm(confirmMarkPaid)}
          isLoading={isMarkingPaid}
          confirmText={t("confirm.markPaidConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="RentalsPage"
        />
      )}

      {createModal && (
        <Suspense fallback={null}>
          <PaymentCreateModal
            isOpen={createModal}
            onClose={() => setCreateModal(false)}
            onConfirm={handleCreate}
            onExtractOCR={handleExtractOCR}
            isLoading={creating}
            isExtractingOCR={extractingOCR}
          />
        </Suspense>
      )}

      {editModal && (
        <Suspense fallback={null}>
          <PaymentEditModal
            paymentId={editModal.id}
            isOpen={!!editModal}
            onClose={() => setEditModal(null)}
            onConfirm={handleUpdate}
            isLoading={false}
          />
        </Suspense>
      )}

      {detailModal && (
        <Suspense fallback={null}>
          <PaymentDetailsModal paymentId={detailModal.id} onClose={() => setDetailModal(null)} />
        </Suspense>
      )}
    </>
  );
}

