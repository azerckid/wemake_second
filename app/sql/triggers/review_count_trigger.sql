-- 리뷰 카운트 트리거: reviews 테이블의 변경사항을 products.stats.jsonb에 반영
-- products 테이블에 stats.jsonb가 있으므로 트리거가 필요합니다.

-- 리뷰 추가 트리거
CREATE OR REPLACE FUNCTION public.handle_review_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.products 
    SET stats = jsonb_set(
        stats, 
        '{reviews}', 
        to_jsonb((stats->>'reviews')::integer + 1)
    )
    WHERE product_id = NEW.product_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS review_insert_trigger ON public.reviews;
CREATE TRIGGER review_insert_trigger
AFTER INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_review_insert();

-- 리뷰 제거 트리거
CREATE OR REPLACE FUNCTION public.handle_review_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.products 
    SET stats = jsonb_set(
        stats, 
        '{reviews}', 
        to_jsonb(GREATEST((stats->>'reviews')::integer - 1, 0))
    )
    WHERE product_id = OLD.product_id;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS review_delete_trigger ON public.reviews;
CREATE TRIGGER review_delete_trigger
AFTER DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_review_delete();

