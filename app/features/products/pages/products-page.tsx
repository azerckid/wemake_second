import { redirect } from "react-router";
import type { Route } from "./+types/products-page";

export function loader({ request }: Route.LoaderArgs) {
    return redirect("/products/leaderboards");
}

// export function meta({ data }: Route.MetaArgs) {
//     return [
//         { title: "Products | ProductHunt Clone" },
//         { name: "description", content: "Discover amazing products" }
//     ];
// }

// export default function ProductsPage({ loaderData }: Route.ComponentProps) {
//     return (
//         <div className="px-20 py-16">
//             <div className="mb-8">
//                 <h1 className="text-5xl font-bold leading-tight tracking-tight">
//                     Products
//                 </h1>
//                 <p className="text-xl font-light text-muted-foreground">
//                     Discover amazing products
//                 </p>
//             </div>
//         </div>
//     );
// }
