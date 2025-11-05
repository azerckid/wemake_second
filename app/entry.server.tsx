import "../instrument.server.mjs";
import { PassThrough } from "node:stream";

import type { AppLoadContext, EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import * as Sentry from "@sentry/react-router";
import { type HandleErrorFunction } from "react-router";

export const streamTimeout = 5_000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    loadContext: AppLoadContext
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        let userAgent = request.headers.get("user-agent");

        // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
        // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
        let readyOption: keyof RenderToPipeableStreamOptions =
            (userAgent && isbot(userAgent)) || routerContext.isSpaMode
                ? "onAllReady"
                : "onShellReady";

        const { pipe, abort } = renderToPipeableStream(
            <ServerRouter context={routerContext} url={request.url} />,
            {
                [readyOption]() {
                    shellRendered = true;
                    const body = new PassThrough();
                    const stream = createReadableStreamFromReadable(body);

                    responseHeaders.set("Content-Type", "text/html");

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    );

                    pipe(body);
                },
                onShellError(error: unknown) {
                    reject(error);
                },
                onError(error: unknown) {
                    responseStatusCode = 500;
                    Sentry.captureException(error);
                    // Log streaming rendering errors from inside the shell
                    // don't log errors from outside the shell
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            }
        );

        setTimeout(abort, streamTimeout);
    });
}

export const handleError: HandleErrorFunction = (
    error: unknown,
    { request }: { request: Request }
) => {
    Sentry.captureException(error);
};

