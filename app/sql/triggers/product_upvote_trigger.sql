-- Product 업보트 트리거: product_upvotes 테이블의 변경사항을 products.stats.jsonb에 반영
-- products 테이블에 stats.jsonb가 있으므로 트리거가 필요합니다.

-- 업보트 추가 트리거
CREATE OR REPLACE FUNCTION public.handle_product_upvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.products 
    SET stats = jsonb_set(
        stats, 
        '{upvotes}', 
        to_jsonb((stats->>'upvotes')::integer + 1)
    )
    WHERE product_id = NEW.product_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS product_upvote_trigger ON public.product_upvotes;
CREATE TRIGGER product_upvote_trigger
AFTER INSERT ON public.product_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_product_upvote();

-- 업보트 제거 트리거
CREATE OR REPLACE FUNCTION public.handle_product_unvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.products 
    SET stats = jsonb_set(
        stats, 
        '{upvotes}', 
        to_jsonb(GREATEST((stats->>'upvotes')::integer - 1, 0))
    )
    WHERE product_id = OLD.product_id;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS product_unvote_trigger ON public.product_upvotes;
CREATE TRIGGER product_unvote_trigger
AFTER DELETE ON public.product_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_product_unvote();

-- Sync existing upvote counts (one-time update for existing data)
UPDATE products p
SET stats = jsonb_set(
    stats,
    '{upvotes}',
    to_jsonb(COALESCE(subquery.upvote_count, 0))
)
FROM (
    SELECT 
        product_id,
        COUNT(profile_id) as upvote_count
    FROM product_upvotes
    GROUP BY product_id
) AS subquery
WHERE p.product_id = subquery.product_id;

