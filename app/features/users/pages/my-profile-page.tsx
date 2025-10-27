import { redirect } from "react-router";
import type { Route } from "./+types/my-profile-page";

export function loader() {
    // TODO: Get current user from session and redirect to their profile
    return redirect("/users/sarah.kim");
}

