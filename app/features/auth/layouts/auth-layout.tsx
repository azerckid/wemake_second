import type { Route } from "./+types/auth-layout";
import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
            <div className="bg-gradient-to-br from-primary hidden lg:block via-black to-primary/50" />
            <div className="px-6 sm:px-8 lg:px-0">
                <Outlet />
            </div>
        </div>
    );
}

