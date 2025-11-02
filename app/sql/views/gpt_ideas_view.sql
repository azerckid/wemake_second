CREATE OR REPLACE VIEW gpt_ideas_view AS
SELECT
  gpt_ideas.gpt_idea_id,
  gpt_ideas.idea,
  gpt_ideas.views,
  CASE WHEN gpt_ideas.claimed_at IS NULL THEN FALSE ELSE TRUE END AS is_claimed,
  gpt_ideas.claimed_at,
  gpt_ideas.claimed_by,
  COUNT(gpt_ideas_likes.gpt_idea_id) AS likes,
  gpt_ideas.created_at,
  (SELECT EXISTS (SELECT 1 FROM public.gpt_ideas_likes WHERE gpt_ideas_likes.gpt_idea_id = gpt_ideas.gpt_idea_id AND gpt_ideas_likes.profile_id = auth.uid())) AS is_liked
FROM public.gpt_ideas
LEFT JOIN public.gpt_ideas_likes USING (gpt_idea_id)
GROUP BY gpt_ideas.gpt_idea_id;