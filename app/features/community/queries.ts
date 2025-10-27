import { DateTime } from "luxon";
import client from "~/supa-client";

export const getTopics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { data, error } = await client.from("topics").select("*");
  if (error) throw new Error(error.message);
  return data;
};

interface Post {
  post_id: number;
  title: string;
  author: string;
  author_avatar: string | null;
  author_username: string | null;
  topic: string;
  topic_slug: string;
  created_at: string;
  upvotes: number;
}

interface PostDetail {
  post_id: number;
  title: string;
  content: string;
  upvotes: number;
  created_at: string;
  topic_id: number;
  topic_name: string;
  topic_slug: string;
  replies: number;
  author_name: string;
  author_avatar: string | null;
  author_role: string | null;
  author_created_at: string;
  products: number;
}

export const getPosts = async ({
  limit,
  sorting,
  period = "all",
  keyword,
  topic,
  page = 1,
}: {
  limit: number;
  sorting: "newest" | "popular";
  period?: "all" | "today" | "week" | "month" | "year";
  keyword?: string;
  topic?: string;
  page?: number;
}): Promise<Post[]> => {
  const baseQuery = client
    .from("community_post_list_view")
    .select(`*`)
    .range((page - 1) * limit, page * limit - 1);
  if (sorting === "newest") {
    baseQuery.order("created_at", { ascending: false });
  } else if (sorting === "popular") {
    if (period === "all") {
      baseQuery.order("upvotes", { ascending: false });
    } else {
      const today = DateTime.now();
      if (period === "today") {
        baseQuery.gte("created_at", today.startOf("day").toISO());
      } else if (period === "week") {
        baseQuery.gte("created_at", today.startOf("week").toISO());
      } else if (period === "month") {
        baseQuery.gte("created_at", today.startOf("month").toISO());
      } else if (period === "year") {
        baseQuery.gte("created_at", today.startOf("year").toISO());
      }
      baseQuery.order("upvotes", { ascending: false });
    }
  }

  if (keyword) {
    baseQuery.ilike("title", `%${keyword}%`);
  }

  if (topic) {
    baseQuery.eq("topic_slug", topic);
  }

  const { data, error } = await baseQuery;
  if (error) throw new Error(error.message);
  // Type assertion is safe because the view uses INNER JOINs
  return (data || []) as Post[];
};

export const getPostsCount = async ({
  sorting,
  period = "all",
  keyword,
  topic,
}: {
  sorting: "newest" | "popular";
  period?: "all" | "today" | "week" | "month" | "year";
  keyword?: string;
  topic?: string;
}): Promise<number> => {
  const baseQuery = client
    .from("community_post_list_view")
    .select(`*`, { count: "exact", head: true });

  if (sorting === "popular" && period !== "all") {
    const today = DateTime.now();
    if (period === "today") {
      baseQuery.gte("created_at", today.startOf("day").toISO());
    } else if (period === "week") {
      baseQuery.gte("created_at", today.startOf("week").toISO());
    } else if (period === "month") {
      baseQuery.gte("created_at", today.startOf("month").toISO());
    } else if (period === "year") {
      baseQuery.gte("created_at", today.startOf("year").toISO());
    }
  }

  if (keyword) {
    baseQuery.ilike("title", `%${keyword}%`);
  }

  if (topic) {
    baseQuery.eq("topic_slug", topic);
  }

  const { count, error } = await baseQuery;
  if (error) throw new Error(error.message);
  return count || 0;
};

export const getPostById = async (postId: string): Promise<PostDetail> => {
  const { data, error } = await client
    .from("community_post_detail" as any)
    .select("*")
    .eq("post_id", Number(postId))
    .single();
  if (error) throw error;
  // Type assertion is safe because the view uses INNER JOINs
  return data as unknown as PostDetail;
};

interface PostReply {
  post_reply_id: number;
  post_id: number;
  parent_id: number | null;
  profile_id: string;
  reply: string;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
  children?: PostReply[];
}

export const getRepliesByPostId = async (postId: string): Promise<PostReply[]> => {
  // Get all replies for this post
  const { data, error } = await client
    .from("post_replies")
    .select(`
      post_reply_id,
      post_id,
      parent_id,
      profile_id,
      reply,
      created_at,
      profiles:profile_id (
        name,
        avatar
      )
    `)
    .eq("post_id", Number(postId))
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Transform the data
  const allReplies: PostReply[] = (data || []).map((item: any) => ({
    post_reply_id: item.post_reply_id,
    post_id: item.post_id,
    parent_id: item.parent_id,
    profile_id: item.profile_id,
    reply: item.reply,
    created_at: item.created_at,
    author_name: item.profiles?.name || "Unknown",
    author_avatar: item.profiles?.avatar || null,
    children: [],
  }));

  // Build hierarchical structure recursively
  function buildReplyTree(replies: PostReply[], parentId: number | null): PostReply[] {
    return replies
      .filter(reply => reply.parent_id === parentId)
      .map(reply => ({
        ...reply,
        children: buildReplyTree(replies, reply.post_reply_id),
      }));
  }

  return buildReplyTree(allReplies, null);
};