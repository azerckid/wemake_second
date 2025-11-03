import { Outlet } from "react-router";
import type { Route } from "./+types/messages-layout";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarProvider,
} from "~/common/components/ui/sidebar";
import { MessageRoomCard } from "~/features/users/components/message-room-card";
import { getMessageRooms } from "../queries";

export async function loader({ request }: Route.LoaderArgs) {
    return {
        messageRooms: await getMessageRooms(request),
    };
}

export default function MessagesLayout({ loaderData }: Route.ComponentProps) {
    const messageRooms = loaderData.messageRooms || [];

    return (
        <SidebarProvider className="flex h-[calc(100vh-14rem)] overflow-hidden">
            <Sidebar className="pt-16" variant="floating">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {messageRooms.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground">
                                    No messages yet
                                </div>
                            ) : (
                                messageRooms.map((room) => (
                                    <MessageRoomCard
                                        key={room.message_room_id}
                                        message_room_id={room.message_room_id}
                                        name={room.otherUser.name}
                                        lastMessage={
                                            room.lastMessage?.content || "No messages yet"
                                        }
                                        avatarUrl={room.otherUser.avatar || undefined}
                                    />
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <div className="flex-1 h-full overflow-hidden">
                <Outlet />
            </div>
        </SidebarProvider>
    );
}