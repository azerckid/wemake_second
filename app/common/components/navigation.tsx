import { Link } from "react-router";
import { BarChart3Icon, BellIcon, LogOut, MessageCircleIcon, Settings, User } from "lucide-react";

import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { Separator } from "./ui/separator";

const menus = [
    {
        name: "Products",
        to: "/products",
        items: [
            {
                name: "Leaderboards",
                to: "/products/leaderboards",
                description: "See the top performers in your community"
            },
            {
                name: "Categories",
                to: "/products/categories",
                description: "See the categories in your community"
            },
            {
                name: "Search",
                to: "/products/search",
                description: "Search for a product in your community"
            },
            {
                name: "Submit a Product",
                to: "/products/submit",
                description: "Submit a product to your community"
            },
            {
                name: "Promote a Product",
                to: "/products/promote",
                description: "Promote a product to your community"
            },
        ]
    },
    {
        name: "Jobs",
        to: "/jobs",
        items: [
            {
                name: "Remote Jobs",
                to: "/jobs?location=remote",
                description: "See the remote jobs in your community"
            },
            {
                name: "Full-Time Jobs",
                to: "/jobs?type=full-time",
                description: "See the full-time jobs in your community"
            },
            {
                name: "Freelance Jobs",
                to: "/jobs?type=freelance",
                description: "See the freelance jobs in your community"
            },
            {
                name: "Internships",
                to: "/jobs?type=internship",
                description: "See the internships in your community"
            },
            {
                name: "Submit a Job",
                to: "/jobs/submit",
                description: "Submit a job to your community"
            },
        ]
    },
    {
        name: "Community",
        to: "/community",
        items: [
            {
                name: "All Posts",
                to: "/community",
                description: "See the all posts in your community"
            },
            {
                name: "Top Posts",
                to: "/community?sort=top",
                description: "See the top posts in your community"
            },
            {
                name: "New Posts",
                to: "/community?sort=new",
                description: "See the new posts in your community"
            },
            {
                name: "Create a Post",
                to: "/community/create",
                description: "Create a post in your community"
            },
            {
                name: "Hot Posts",
                to: "/community?sort=hot",
                description: "See the hot posts in your community"
            },
            {
                name: "Old Posts",
                to: "/community?sort=old",
                description: "See the old posts in your community"
            },
            {
                name: "Submit a Post",
                to: "/community?submit=true",
                description: "Submit a post to your community"
            },
        ]
    },
    {
        name: "IdeasGPT",
        to: "/ideasgpt",
    },
    {
        name: "Teams",
        to: "/teams",
        items: [
            {
                name: "All Teams",
                to: "/teams",
                description: "See the all teams in your community"
            },
            {
                name: "Create a Team",
                to: "/teams/create",
                description: "Create a team in your community"
            },
            {
                name: "Join a Team",
                to: "/teams/join",
                description: "Join a team in your community"
            },
            {
                name: "Leave a Team",
                to: "/teams/leave",
                description: "Leave a team in your community"
            },
        ]
    },
]

export default function Navigation({ isLoggedIn, hasNotifications, hasMessages }: { isLoggedIn: boolean, hasNotifications: boolean, hasMessages: boolean }) {
    return (
        <nav className="flex justify-between items-center px-20 h-16 backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
            <div className="flex items-center">
                <Link to="/" className="font - bold tracking - tighter text - lg">wemake</Link>
                <Separator orientation="vertical" className="h-6 mx-4" />
                <NavigationMenu>
                    <NavigationMenuList>
                        {menus.map((menu) =>
                            menu.items && menu.items.length > 0 ? (
                                <NavigationMenuItem key={menu.to}>
                                    <Link to={menu.to}>
                                        <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                                    </Link>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
                                            {menu.items.map((item) => (
                                                <NavigationMenuItem key={item.to} className={cn([
                                                    "select-none rounded-md transition-colors focus:bg-accent hover:bg-accent",
                                                    item.to === "/products/promote" && "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                    item.to === "/jobs/submit" && "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                    item.to === "/community/create" && "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                    item.to === "/ideasgpt" && "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                    item.to === "/teams/join" && "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                ])}
                                                >
                                                    <NavigationMenuLink asChild>
                                                        <Link to={item.to} className="p-3 space-y-1 block leading-none no-underline outline-none">
                                                            <span className="text-sm font-medium leading-none">{item.name}</span>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </NavigationMenuItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ) :
                                <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                                    {menu.name}
                                </Link>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
                <Separator orientation="vertical" className="h-6 mx-4" />
            </div>
            {isLoggedIn ? (
                <div className="flex justify-center items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link to="/my-account/notifications">
                            <BellIcon className="size-4" />
                            {hasNotifications && (
                                <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full">
                                    {hasNotifications}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link to="/my-account/messages">
                            <MessageCircleIcon className="size-4" />
                            {hasMessages && (
                                <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full">
                                    {hasMessages}
                                </span>
                            )}
                        </Link>
                    </Button>

                    <DropdownMenu >
                        <DropdownMenuTrigger asChild className="ml-2">
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="https://github.com/zizimoos.png" alt="User avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="flex flex-col gap-1">
                                <span className="text-sm font-medium">Azerc kid</span>
                                <span className="text-xs text-muted-foreground">azerckid@example.com</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link to="/my-account/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/my-account/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/my-account/dashboard">
                                        <BarChart3Icon className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="text-red-600">
                                <Link to="/auth/logout">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="secondary" asChild>
                        <Link to="auth/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link to="auth/signup">Join</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}

