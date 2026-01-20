import "@/app/i18n";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { initSentry } from "@/shared/lib/initSentry";
import AppErrorBoundary from "@/shared/components/AppErrorBoundary";
import { AppRouter } from "./router";
import { store } from "./store";
import "@/shared/assets/css/globals.css";

initSentry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </AppErrorBoundary>,
);
