CREATE OR REPLACE VIEW product_overview_view AS
SELECT
  p.product_id,
  p.name,
  p.tagline,
  p.description,
  p.how_it_works,
  p.icon,
  p.url,
  COALESCE((p.stats->>'upvotes')::integer, 0) AS upvotes,
  COALESCE((p.stats->>'views')::integer, 0) AS views,
  COALESCE((p.stats->>'reviews')::integer, 0) AS reviews,
  COALESCE(AVG(product_reviews.rating), 0) AS average_rating,
  p.profile_id,
  p.category_id,
  p.created_at,
  p.updated_at
FROM public.products p
LEFT JOIN public.reviews AS product_reviews ON p.product_id = product_reviews.product_id
GROUP BY p.product_id, p.name, p.tagline, p.description, p.how_it_works, p.icon, p.url, p.stats, p.profile_id, p.category_id, p.created_at, p.updated_at;