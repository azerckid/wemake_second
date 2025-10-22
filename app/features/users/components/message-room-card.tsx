import { Link, useLocation } from "react-router";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "~/common/components/ui/avatar";
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/common/components/ui/sidebar";

interface MessageRoomCardProps {
    message_room_id: number;
    avatarUrl?: string;
    name: string;
    lastMessage: string;
}

export function MessageRoomCard({
    message_room_id,
    avatarUrl,
    name,
    lastMessage,
}: MessageRoomCardProps) {
    const location = useLocation();
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                className="h-18"
                asChild
                isActive={location.pathname === `/my/messages/${message_room_id}`}
            >
                <Link to={`/my/messages/${message_room_id}`}>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>{name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm">{name}</span>
                            <span className="text-xs text-muted-foreground">
                                {lastMessage}
                            </span>
                        </div>
                    </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}