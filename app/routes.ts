import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    index("common/pages/home-page.tsx"),
    ...prefix("products", [
        index("features/products/pages/products-page.tsx"),
        ...prefix("leaderboards", [
            index("features/products/pages/leaderboard-page.tsx"),
            route(
                "/yearly/:year",
                "features/products/pages/yearly-leaderboard-page.tsx"
            ),
            route(
                "/monthly/:year/:month",
                "features/products/pages/monthly-leaderboard-page.tsx"
            ),
            route(
                "/daily/:year/:month/:day",
                "features/products/pages/daily-leaderboard-page.tsx"
            ),
            route(
                "/weekly/:year/:week",
                "features/products/pages/weekly-leaderboard-page.tsx"
            ),
            route(
                "/:period",
                "features/products/pages/leaderboards-redirection-page.tsx"
            ),
        ]),
        ...prefix("categories", [
            index("features/products/pages/categories-page.tsx"),
            route("/:category", "features/products/pages/category-page.tsx"),
        ]),
        route("/search", "features/products/pages/search-page.tsx"),
        route("/submit", "features/products/pages/submit-page.tsx"),
        route("/promote", "features/products/pages/promote-page.tsx"),
    ]),
] satisfies RouteConfig;
