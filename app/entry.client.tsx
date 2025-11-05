import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import * as Sentry from "@sentry/react-router";

Sentry.init({
    dsn: "https://f204994e20fa536249d2bb8cb6de37f6@o4510312007008256.ingest.us.sentry.io/4510312023654400",
    integrations: [Sentry.replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <HydratedRouter />
        </StrictMode>
    );
});

