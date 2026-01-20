const STATUS_KEY_MAP: Record<number | "null", string> = {
  null: "draft",
  0: "notSigned",
  1: "signedByCompany",
  2: "signedByClient",
  3: "fullySigned",
  4: "revokedByCompany",
  5: "companyInitiatedTermination",
  6: "clientInitiatedTermination",
  7: "clientRefusedTermination",
  8: "terminated",
  9: "clientRefusedToSign",
};

export interface StatusOption {
  label: string;
  value: string;
}

function getStatusLabel(trustmeStatus: number | null, t: (key: string) => string): string {
  const key = trustmeStatus === null ? "null" : trustmeStatus;
  const translationKey = STATUS_KEY_MAP[key];

  if (!translationKey) {
    return "";
  }

  return t(`trustMeStatus.${translationKey}`) || "";
}

export function getUniqueTrustMeStatuses<T extends { trustme_status: number | null }>(
  items: T[],
  t: (key: string) => string,
): StatusOption[] {
  const uniqueStatuses = new Set<number | null>();
  items.forEach((item) => {
    uniqueStatuses.add(item.trustme_status);
  });

  const options: StatusOption[] = Array.from(uniqueStatuses)
    .map((status) => ({
      value: status === null ? "null" : String(status),
      label: getStatusLabel(status, t),
      status,
    }))
    .filter((opt) => opt.label)
    .sort((a, b) => {
      if (a.status === null) return -1;
      if (b.status === null) return 1;
      return (a.status ?? 0) - (b.status ?? 0);
    })
    .map(({ value, label }) => ({ value, label }));

  return options;
}

