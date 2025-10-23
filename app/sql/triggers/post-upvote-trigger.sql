-- 업보트 트리거는 불필요합니다.
-- community_post_list_view에서 실시간으로 업보트 수를 계산하므로
-- 별도의 upvotes 컬럼이나 트리거가 필요하지 않습니다.

-- 뷰에서 업보트 수 계산:
-- COUNT(post_upvotes.post_id) AS upvotes