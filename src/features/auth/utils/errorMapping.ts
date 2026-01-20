/**
 * Маппинг backend ошибок на i18n ключи для страницы логина
 */
const ERROR_MAPPING: Record<string, string> = {
  "Invalid credentials": "errors.invalid_credentials",
};

/**
 * Преобразует backend ошибку в i18n ключ
 * @param backendError - Строка ошибки от backend
 * @returns i18n ключ для перевода (без namespace, так как t() уже использует "LoginPage")
 */
export function mapBackendErrorToI18nKey(backendError: string): string {
  return ERROR_MAPPING[backendError] || "errors.unknown";
}
