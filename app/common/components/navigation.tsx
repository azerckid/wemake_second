import { Link } from "react-router";
import { BarChart3Icon, BellIcon, LogOut, Menu, MessageCircleIcon, Settings, User, X } from "lucide-react";

import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const menus = [
    {
        name: "Products",
        to: "/products",
        items: [
            {
                name: "Leaderboards",
                description: "See the top performers in your community",
                to: "/products/leaderboards",
            },
            {
                name: "Categories",
                description: "See the top categories in your community",
                to: "/products/categories",
            },
            {
                name: "Search",
                description: "Search for a product",
                to: "/products/search",
            },
            {
                name: "Submit a Product",
                description: "Submit a product to our community",
                to: "/products/submit",
            },
            {
                name: "Promote",
                description: "Promote a product to our community",
                to: "/products/promote",
            },
        ],
    },
    {
        name: "Jobs",
        to: "/jobs",
        items: [
            {
                name: "Remote Jobs",
                description: "Find a remote job in our community",
                to: "/jobs?location=remote",
            },
            {
                name: "Full-Time Jobs",
                description: "Find a full-time job in our community",
                to: "/jobs?type=full-time",
            },
            {
                name: "Freelance Jobs",
                description: "Find a freelance job in our community",
                to: "/jobs?type=freelance",
            },
            {
                name: "Internships",
                description: "Find an internship in our community",
                to: "/jobs?type=internship",
            },
            {
                name: "Post a Job",
                description: "Post a job to our community",
                to: "/jobs/submit",
            },
        ],
    },
    {
        name: "Community",
        to: "/community",
        items: [
            {
                name: "All Posts",
                description: "See all posts in our community",
                to: "/community",
            },
            {
                name: "Top Posts",
                description: "See the top posts in our community",
                to: "/community?sorting=popular",
            },
            {
                name: "New Posts",
                description: "See the new posts in our community",
                to: "/community?sorting=newest",
            },
            {
                name: "Create a Post",
                description: "Create a post in our community",
                to: "/community/submit",
            },
        ],
    },
    {
        name: "IdeasGPT",
        to: "/ideas",
    },
    {
        name: "Teams",
        to: "/teams",
        items: [
            {
                name: "All Teams",
                description: "See all teams in our community",
                to: "/teams",
            },
            {
                name: "Create a Team",
                description: "Create a team in our community",
                to: "/teams/create",
            },
        ],
    },
]

export default function Navigation({ isLoggedIn, hasNotifications, hasMessages }: { isLoggedIn: boolean, hasNotifications: boolean, hasMessages: boolean }) {
    return (
        <nav className="flex justify-between items-center px-4 sm:px-8 lg:px-20 h-16 backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-2">
                            {menus.map((menu) => (
                                <div key={menu.to} className="space-y-2">
                                    <Link
                                        to={menu.to}
                                        className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                    >
                                        {menu.name}
                                    </Link>
                                    {menu.items && menu.items.length > 0 && (
                                        <div className="pl-4 space-y-1">
                                            {menu.items.map((item) => (
                                                <Link
                                                    key={item.to}
                                                    to={item.to}
                                                    className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isLoggedIn && (
                            <div className="mt-8 pt-8 border-t space-y-2">
                                <Link
                                    to="/my/profile"
                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <Link
                                    to="/my/settings"
                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                                <Link
                                    to="/my/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                >
                                    <BarChart3Icon className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/auth/logout"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-accent transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </Link>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                <Link to="/" className="font-bold tracking-tighter text-lg">wemake</Link>
                <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menus.map((menu) =>
                                menu.items && menu.items.length > 0 ? (
                                    <NavigationMenuItem key={menu.to}>
                                        <Link to={menu.to} prefetch="intent">
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
                                    <Link className={navigationMenuTriggerStyle()} to={menu.to} key={menu.to}>
                                        {menu.name}
                                    </Link>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Separator orientation="vertical" className="h-6 mx-4" />
                </div>
            </div>
            {isLoggedIn ? (
                <div className="flex justify-center items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link to="/my/notifications">
                            <BellIcon className="size-4" />
                            {hasNotifications && (
                                <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full">
                                    {hasNotifications}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link to="/my/messages">
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
                                <AvatarFallback>SK</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="flex flex-col gap-1">
                                <span className="text-sm font-medium">Sarah Kim</span>
                                <span className="text-xs text-muted-foreground">zizimoos@gmail.com</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link to="/my/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/my/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/my/dashboard">
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
                        <Link to="auth/join">Join</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}

