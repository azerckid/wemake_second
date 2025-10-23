-- 업보트 트리거: post_upvotes 테이블의 변경사항을 posts.upvotes 컬럼에 반영
-- posts 테이블에 upvotes 컬럼이 추가되었으므로 트리거가 필요합니다.

-- 업보트 추가 트리거
CREATE FUNCTION public.handle_post_upvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.posts SET upvotes = upvotes + 1 WHERE post_id = NEW.post_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER post_upvote_trigger
AFTER INSERT ON public.post_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_upvote();

-- 업보트 제거 트리거
CREATE FUNCTION public.handle_post_unvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.posts SET upvotes = upvotes - 1 WHERE post_id = OLD.post_id;
    RETURN OLD;
END;
$$;

CREATE TRIGGER post_unvote_trigger
AFTER DELETE ON public.post_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_unvote();