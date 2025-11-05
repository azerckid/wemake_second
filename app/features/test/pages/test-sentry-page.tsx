import * as Sentry from "@sentry/react-router";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";

import type { Route } from "./+types/test-sentry-page";

export const meta: Route.MetaFunction = () => {
    return [
        {
            title: "Sentry 테스트 | wemake",
        },
    ];
};

export default function TestSentryPage() {
    const handleClientError = () => {
        // 클라이언트 사이드 JavaScript 에러
        throw new Error("테스트용 클라이언트 에러입니다!");
    };

    const handleAsyncError = async () => {
        // 비동기 에러
        await new Promise((resolve) => setTimeout(resolve, 100));
        throw new Error("테스트용 비동기 에러입니다!");
    };

    const handleTypeError = () => {
        // TypeError 발생
        const obj: any = null;
        obj.someMethod();
    };

    const handleCustomError = () => {
        // Sentry에 직접 에러 전송
        Sentry.captureException(new Error("Sentry.captureException으로 직접 전송한 에러입니다!"));
        alert("에러가 Sentry로 전송되었습니다!");
    };

    const handleLoaderError = () => {
        // Loader 에러를 발생시키기 위해 페이지 리로드
        window.location.href = "/test/sentry/error";
    };

    return (
        <div className="container mx-auto py-10 px-5">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Sentry 에러 테스트</CardTitle>
                    <CardDescription>
                        아래 버튼들을 클릭하여 다양한 타입의 에러를 발생시켜 Sentry가 제대로 작동하는지 확인하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold">클라이언트 사이드 에러 테스트</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={handleClientError} variant="destructive">
                                JavaScript 에러 발생
                            </Button>
                            <Button onClick={handleAsyncError} variant="destructive">
                                비동기 에러 발생
                            </Button>
                            <Button onClick={handleTypeError} variant="destructive">
                                TypeError 발생
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Sentry 직접 전송</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={handleCustomError} variant="outline">
                                Sentry.captureException 직접 호출
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Loader 에러 테스트</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={handleLoaderError} variant="outline">
                                Loader 에러 페이지로 이동
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>확인 방법:</strong>
                            <br />
                            1. 위 버튼을 클릭하여 에러를 발생시킵니다.
                            <br />
                            2. Sentry 대시보드의{" "}
                            <a
                                href="https://sentry.io/organizations/ghouse-1f/issues/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Issues 페이지
                            </a>
                            에서 에러가 나타나는지 확인하세요.
                            <br />
                            3. 에러가 나타나면 Sentry가 정상적으로 작동하는 것입니다!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return (
        <div className="container mx-auto py-10 px-5">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-red-600">에러 발생!</CardTitle>
                    <CardDescription>
                        이 에러는 ErrorBoundary에서 캡처되었으며 Sentry로 전송되었습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">에러 메시지:</h3>
                            <p className="text-sm bg-gray-100 p-3 rounded">{(error instanceof Error ? error.message : typeof error === "string" ? error : "알 수 없는 에러")}</p>
                        </div>
                        <Button
                            onClick={() => (window.location.href = "/test/sentry")}
                            variant="outline"
                        >
                            테스트 페이지로 돌아가기
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

