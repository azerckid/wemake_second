CREATE FUNCTION public.notify_follow()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
    -- 자기 자신을 팔로우하는 경우 알림 생성하지 않음
    IF NEW.follower_id = NEW.following_id THEN
        RETURN NEW;
    END IF;
    
    INSERT INTO public.notifications (type, source_id, target_id)
    VALUES ('follow', NEW.follower_id, NEW.following_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER notify_follow_trigger
AFTER INSERT ON public.follows
FOR EACH ROW
EXECUTE PROCEDURE public.notify_follow();


CREATE FUNCTION public.notify_review()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    product_owner uuid;
BEGIN
    SELECT profile_id INTO product_owner 
    FROM public.products 
    WHERE product_id = NEW.product_id;
    
    -- 제품 소유자를 찾을 수 없거나, 자기 제품에 리뷰 작성하는 경우 알림 생성하지 않음
    IF product_owner IS NULL OR NEW.profile_id = product_owner THEN
        RETURN NEW;
    END IF;
    
    INSERT INTO public.notifications (type, source_id, target_id, product_id)
    VALUES ('review', NEW.profile_id, product_owner, NEW.product_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER notify_review_trigger
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE PROCEDURE public.notify_review();

CREATE FUNCTION public.notify_reply()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    post_owner uuid;
BEGIN
    SELECT profile_id INTO post_owner 
    FROM public.posts 
    WHERE post_id = NEW.post_id;
    
    -- 포스트 작성자를 찾을 수 없거나, 자기 포스트에 댓글 작성하는 경우 알림 생성하지 않음
    IF post_owner IS NULL OR NEW.profile_id = post_owner THEN
        RETURN NEW;
    END IF;
    
    INSERT INTO public.notifications (type, source_id, target_id, post_id)
    VALUES ('reply', NEW.profile_id, post_owner, NEW.post_id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER notify_reply_trigger
AFTER INSERT ON public.post_replies
FOR EACH ROW
EXECUTE PROCEDURE public.notify_reply();