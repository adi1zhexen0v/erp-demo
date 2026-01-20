import { Navigate, Route, Routes, useLocation } from "react-router";
import { ErrorFallback } from "@/shared/components";
import { HR_EMPLOYEES_PAGE_ROUTE } from "@/shared/utils";
import { AuthProvider } from "../auth";
import PrivateLayout from "../layout/PrivateLayout";
import PublicLayout from "../layout/PublicLayout";
import { ErrorBoundary } from "./ErrorBoundary";
import ProtectedRoute from "./ProtectedRoute";
import { privateRoutes, publicRoutes } from "./routes";

export function AppRouter() {
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={location.pathname} fallback={<ErrorFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}
        </Route>

        <Route
          path="/"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            </AuthProvider>
          }>
          <Route index element={<Navigate to={HR_EMPLOYEES_PAGE_ROUTE} replace />} />
          {privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to={HR_EMPLOYEES_PAGE_ROUTE} replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

