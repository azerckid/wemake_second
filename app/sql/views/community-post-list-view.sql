CREATE VIEW community_post_list_view AS
SELECT
  posts.post_id,
  posts.title,
  posts.created_at,
  topics.name AS topic,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
  COUNT(post_upvotes.post_id) AS upvotes
FROM posts
INNER JOIN topics ON posts.topic_id = topics.topic_id
INNER JOIN profiles ON posts.profile_id = profiles.profile_id
LEFT JOIN post_upvotes ON posts.post_id = post_upvotes.post_id
GROUP BY posts.post_id, posts.title, posts.created_at, topics.name, profiles.name, profiles.avatar, profiles.username;