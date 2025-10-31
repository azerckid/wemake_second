import { useState } from "react";
import { Form, Link } from "react-router";
import { DotIcon, MessageCircleIcon } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";

// 멘션을 렌더링하는 함수
function renderWithMentions(text: string) {
    const mentionRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        // 멘션 이전 텍스트
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
        }

        // 멘션 부분
        const username = match[1];
        parts.push(
            <Link
                key={`mention-${match.index}`}
                to={`/users/${username}`}
                className="text-primary hover:underline font-medium"
            >
                @{username}
            </Link>
        );

        lastIndex = match.index + match[0].length;
    }

    // 마지막 텍스트
    if (lastIndex < text.length) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
}

interface ReplyProps {
    username: string;
    avatarUrl: string;
    reply: string;
    created_at: Date;
    children?: ReplyProps[];
    parentUsername?: string; // 부모 리플라이 작성자 이름
    post_reply_id?: number; // 리플라이 ID (중첩 리플라이 추적용)
    depth?: number; // 중첩 깊이
    currentUser?: {
        profile_id: string;
        name: string;
        username: string;
        avatar: string | null;
    } | null;
}

export function Reply({
    username,
    avatarUrl,
    reply,
    created_at,
    children,
    parentUsername,
    post_reply_id,
    depth = 0,
    currentUser,
}: ReplyProps) {
    const [replying, setReplying] = useState(false);
    const toggleReplying = () => setReplying((prev) => !prev);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 폼 제출 시 댓글 폼 닫기
        setReplying(false);
    };

    // Format date consistently for SSR
    const date = new Date(created_at);
    const timestamp = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    // 부모 작성자 멘션을 포함한 리플라이 텍스트
    const replyWithMention = parentUsername && !reply.startsWith(`@${parentUsername}`)
        ? `@${parentUsername} ${reply}`
        : reply;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-5 w-full">
                <Avatar className="size-[37.33px]">
                    <AvatarFallback>{username[0]}</AvatarFallback>
                    <AvatarImage src={avatarUrl} />
                </Avatar>
                <div className="flex flex-col gap-2 items-start flex-1">
                    <div className="flex gap-2 items-center">
                        <Link to={`/users/${username}`}>
                            <h4 className="font-medium">{username}</h4>
                        </Link>
                        <DotIcon className="size-5" />
                        <span className="text-xs text-muted-foreground">{timestamp}</span>
                    </div>
                    <p className="text-muted-foreground">{renderWithMentions(replyWithMention)}</p>
                    <Button variant="ghost" className="self-end" onClick={toggleReplying}>
                        <MessageCircleIcon className="size-4" />
                    </Button>
                </div>
            </div>
            {replying && (
                <Form method="post" className="flex items-start gap-5 w-3/4" onSubmit={handleSubmit}>
                    {currentUser ? (
                        <Avatar className="size-[37.33px]">
                            <AvatarFallback>{currentUser.name[0]?.toUpperCase() || "U"}</AvatarFallback>
                            {currentUser.avatar && <AvatarImage src={currentUser.avatar} />}
                        </Avatar>
                    ) : (
                        <Avatar className="size-[37.33px]">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    )}
                    <div className="flex flex-col gap-5 items-end w-full">
                        <Textarea
                            name="reply"
                            placeholder="Write a reply"
                            className="w-full resize-none"
                            rows={5}
                            required
                        />
                        {post_reply_id && (
                            <input type="hidden" name="parent_id" value={post_reply_id} />
                        )}
                        <Button type="submit">Reply</Button>
                    </div>
                </Form>
            )}
            {children && children.length > 0 && (
                <div className={`flex flex-col gap-5 ${depth <= 1 ? 'ml-[76px]' : ''}`}>
                    {children.map((child) => (
                        <Reply
                            key={child.post_reply_id}
                            username={child.username}
                            avatarUrl={child.avatarUrl}
                            reply={child.reply}
                            created_at={child.created_at}
                            parentUsername={username} // 현재 답글 작성자를 부모로 전달
                            children={child.children}
                            post_reply_id={child.post_reply_id}
                            depth={depth + 1}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}