import type { Route } from "./+types/test-sentry-error-page";

export const loader = async () => {
    // Loader에서 에러 발생 (서버 사이드)
    throw new Error("테스트용 Loader 에러입니다!");
};

export default function TestSentryErrorPage() {
    return null;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return (
        <div className="container mx-auto py-10 px-5">
            <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Loader 에러 발생!</h1>
                <p className="mb-4">
                    이 에러는 서버 사이드(Loader)에서 발생했으며 Sentry로 전송되었습니다.
                </p>
                <p className="text-sm bg-white p-3 rounded mb-4">
                    <strong>에러 메시지:</strong> {(error instanceof Error ? error.message : typeof error === "string" ? error : "알 수 없는 에러")}
                </p>
                <a
                    href="/test/sentry"
                    className="text-blue-600 hover:underline"
                >
                    ← 테스트 페이지로 돌아가기
                </a>
            </div>
        </div>
    );
}

