-- Followers/Following stats 트리거: follows 테이블의 변경사항을 profiles.stats.jsonb에 반영

-- 팔로우 추가 트리거 (following_id의 followers 증가, follower_id의 following 증가)
CREATE OR REPLACE FUNCTION public.handle_follow_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- 팔로우된 사용자의 followers 증가
    UPDATE public.profiles
    SET stats = jsonb_set(
        COALESCE(stats, '{}'::jsonb),
        '{followers}',
        to_jsonb(COALESCE((stats->>'followers')::integer, 0) + 1)
    )
    WHERE profile_id = NEW.following_id;

    -- 팔로우한 사용자의 following 증가
    UPDATE public.profiles
    SET stats = jsonb_set(
        COALESCE(stats, '{}'::jsonb),
        '{following}',
        to_jsonb(COALESCE((stats->>'following')::integer, 0) + 1)
    )
    WHERE profile_id = NEW.follower_id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS follow_insert_trigger ON public.follows;
CREATE TRIGGER follow_insert_trigger
AFTER INSERT ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.handle_follow_insert();

-- 팔로우 제거 트리거 (following_id의 followers 감소, follower_id의 following 감소)
CREATE OR REPLACE FUNCTION public.handle_follow_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- 팔로우된 사용자의 followers 감소
    UPDATE public.profiles
    SET stats = jsonb_set(
        COALESCE(stats, '{}'::jsonb),
        '{followers}',
        to_jsonb(GREATEST(COALESCE((stats->>'followers')::integer, 0) - 1, 0))
    )
    WHERE profile_id = OLD.following_id;

    -- 팔로우한 사용자의 following 감소
    UPDATE public.profiles
    SET stats = jsonb_set(
        COALESCE(stats, '{}'::jsonb),
        '{following}',
        to_jsonb(GREATEST(COALESCE((stats->>'following')::integer, 0) - 1, 0))
    )
    WHERE profile_id = OLD.follower_id;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS follow_delete_trigger ON public.follows;
CREATE TRIGGER follow_delete_trigger
AFTER DELETE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.handle_follow_delete();

-- Sync existing follow counts (one-time update for existing data)
UPDATE profiles p
SET stats = jsonb_set(
    COALESCE(stats, '{}'::jsonb),
    '{followers}',
    to_jsonb(COALESCE(followers_count, 0))
)
FROM (
    SELECT 
        following_id as profile_id,
        COUNT(follower_id) as followers_count
    FROM follows
    GROUP BY following_id
) AS followers_subquery
WHERE p.profile_id = followers_subquery.profile_id;

UPDATE profiles p
SET stats = jsonb_set(
    COALESCE(stats, '{}'::jsonb),
    '{following}',
    to_jsonb(COALESCE(following_count, 0))
)
FROM (
    SELECT 
        follower_id as profile_id,
        COUNT(following_id) as following_count
    FROM follows
    GROUP BY follower_id
) AS following_subquery
WHERE p.profile_id = following_subquery.profile_id;

-- 모든 프로필의 stats가 null인 경우 빈 객체로 초기화
UPDATE profiles
SET stats = jsonb_build_object('followers', 0, 'following', 0)
WHERE stats IS NULL;

