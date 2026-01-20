import { useTranslation } from "react-i18next";
import { Calendar, Profile, Location } from "iconsax-react";
import { Badge, Button } from "@/shared/ui";

export default function ConsultationCardsView() {
  const { t } = useTranslation("LegalConsultationsPage");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7">
      <div className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex flex-col gap-2">
          <Badge variant="soft" color="info" text={t("cards.status.scheduled")} icon={<Calendar size={12} color="currentColor" />} />
          <p className="text-body-bold-lg content-base-primary">{t("form.topic.options.tax")}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.lawyer")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Profile size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">Иванова А.А.</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.invitationDate")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.appointmentDate")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025, 14:30</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-3 border-t surface-base-stroke">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.format")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Location size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">{t("cards.format.online")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.link")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">https://meet.google.com/vbv-kymo-yfu</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="md">
            {t("cards.actions.joinCall")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex flex-col gap-2">
          <Badge variant="soft" color="info" text={t("cards.status.scheduled")} icon={<Calendar size={12} color="currentColor" />} />
          <p className="text-body-bold-lg content-base-primary">{t("form.topic.options.tax")}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.lawyer")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Profile size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">Иванова А.А.</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.invitationDate")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.appointmentDate")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">12.05.2025, 14:30</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-3 border-t surface-base-stroke">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.format")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Location size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">{t("cards.format.offline")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-body-bold-xs content-base-secondary">{t("cards.fields.location")}</span>
            <div className="flex items-center gap-1.5">
              <span className="content-action-brand">
                <Calendar size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-sm content-base-primary">улица Самал, дом 11, г. Астана</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="md">
            {t("cards.actions.buildRoute")}
          </Button>
        </div>
      </div>
    </div>
  );
}

