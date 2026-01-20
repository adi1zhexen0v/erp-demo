import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send2 } from "iconsax-react";
import cn from "classnames";
import {
  type CreateCandidateFormValues,
  createCandidateSchema,
  useHiringCreateCandidateMutation,
} from "@/features/hr/hiring";
import { Button, Input, ModalForm } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateInvitationForm({ onClose, onSuccess }: Props) {
  const { t } = useTranslation("HiringPage");
  const { scrollRef, hasScroll } = useScrollDetection();

  const [createCandidate, { isLoading }] = useHiringCreateCandidateMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCandidateFormValues>({
    resolver: zodResolver(createCandidateSchema),
  });

  async function onSubmit(data: CreateCandidateFormValues) {
    if (isLoading) return;

    try {
      setServerError(null);
      await createCandidate(data).unwrap();
      reset();
      onSuccess();
    } catch (err) {
      setServerError(t("invite.error"));
      console.error("Ошибка при создании кандидата", err);
    }
  }

  return (
    <ModalForm icon={Send2} onClose={onClose}>
      <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 shrink-0 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("invite.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("invite.subtitle")}</p>
        </div>

        <div ref={scrollRef} className={cn("flex-1 overflow-auto flex flex-col gap-3 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
            <Input
              label={t("invite.name")}
              placeholder={t("invite.namePlaceholder")}
              {...register("candidate_name")}
              error={errors.candidate_name?.message ? t(errors.candidate_name.message as string) : undefined}
            />

            <Input
              label={t("invite.email")}
              placeholder={t("invite.emailPlaceholder")}
              {...register("email")}
              error={errors.email?.message ? t(errors.email.message as string) : undefined}
            />

            <Input
              label={t("invite.phone")}
              placeholder={t("invite.phonePlaceholder")}
              {...register("phone")}
              error={errors.phone?.message ? t(errors.phone.message as string) : undefined}
            />

            <Input
              label={t("invite.position")}
              placeholder={t("invite.positionPlaceholder")}
              {...register("job_position")}
              error={errors.job_position?.message ? t(errors.job_position.message as string) : undefined}
            />

            {serverError && <p className="text-negative-500">{serverError}</p>}
        </div>

        <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
          <Button variant="secondary" className="py-3" onClick={onClose}>
            {t("invite.cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading} className="py-3">
            {isLoading ? t("invite.loading") : t("invite.send")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
