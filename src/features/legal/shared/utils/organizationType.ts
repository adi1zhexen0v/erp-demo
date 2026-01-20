import i18n from "i18next";

export type OrganizationType = "llp" | "llc" | "jsc" | "ip" | "pf";

interface OrganizationTypeDetails {
  ru: {
    full_title: string;
    abbreviation: string;
  };
  kk: {
    full_title: string;
    abbreviation: string;
  };
}

function getTranslation(locale: "ru" | "kk", orgType: OrganizationType, field: "fullTitle" | "abbreviation"): string {
  const key = `organizationTypes.${orgType}.${field}`;
  const translation =
    i18n.getResourceBundle(locale, "Common")?.[key] || i18n.getResourceBundle("ru", "Common")?.[key] || "";
  return translation;
}

export function getOrganizationTypeDetails(orgType: OrganizationType): OrganizationTypeDetails {
  if (!["llp", "llc", "jsc", "ip", "pf"].includes(orgType)) {
    throw new Error(`Unknown organization type: ${orgType}. Valid types: llp, llc, jsc, ip, pf`);
  }

  return {
    ru: {
      full_title: getTranslation("ru", orgType, "fullTitle"),
      abbreviation: getTranslation("ru", orgType, "abbreviation"),
    },
    kk: {
      full_title: getTranslation("kk", orgType, "fullTitle"),
      abbreviation: getTranslation("kk", orgType, "abbreviation"),
    },
  };
}
