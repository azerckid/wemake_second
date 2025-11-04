-- Enable RLS for all remaining tables
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_upvotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."gpt_ideas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."gpt_ideas_likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_replies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_upvotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."topics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- profiles 테이블 정책
-- ============================================
-- 모든 사용자가 프로필 읽기 가능
CREATE POLICY "Public profiles are viewable by everyone"
ON "public"."profiles"
FOR SELECT
TO public
USING (true);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update their own profile"
ON "public"."profiles"
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ============================================
-- follows 테이블 정책
-- ============================================
-- 모든 사용자가 팔로우 관계 읽기 가능
CREATE POLICY "Follows are viewable by everyone"
ON "public"."follows"
FOR SELECT
TO public
USING (true);

-- 사용자는 자신의 팔로우만 생성/삭제 가능
CREATE POLICY "Users can create their own follows"
ON "public"."follows"
FOR INSERT
TO authenticated
WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can delete their own follows"
ON "public"."follows"
FOR DELETE
TO authenticated
USING (follower_id = auth.uid());

-- ============================================
-- jobs 테이블 정책
-- ============================================
-- 모든 사용자가 채용 공고 읽기 가능
CREATE POLICY "Jobs are viewable by everyone"
ON "public"."jobs"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 자신의 채용 공고만 생성 가능
CREATE POLICY "Users can create their own jobs"
ON "public"."jobs"
FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

-- 사용자는 자신의 채용 공고만 수정/삭제 가능
CREATE POLICY "Users can update their own jobs"
ON "public"."jobs"
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own jobs"
ON "public"."jobs"
FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- ============================================
-- product_upvotes 테이블 정책
-- ============================================
-- 모든 사용자가 좋아요 읽기 가능
CREATE POLICY "Product upvotes are viewable by everyone"
ON "public"."product_upvotes"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 자신의 좋아요만 생성/삭제 가능
CREATE POLICY "Users can manage their own product upvotes"
ON "public"."product_upvotes"
FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ============================================
-- reviews 테이블 정책
-- ============================================
-- 모든 사용자가 리뷰 읽기 가능
CREATE POLICY "Reviews are viewable by everyone"
ON "public"."reviews"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 리뷰 생성 가능
CREATE POLICY "Users can create reviews"
ON "public"."reviews"
FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

-- 사용자는 자신의 리뷰만 수정/삭제 가능
CREATE POLICY "Users can update their own reviews"
ON "public"."reviews"
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
ON "public"."reviews"
FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- ============================================
-- gpt_ideas 테이블 정책
-- ============================================
-- 모든 사용자가 아이디어 읽기 가능
CREATE POLICY "GPT ideas are viewable by everyone"
ON "public"."gpt_ideas"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 아이디어 클레임 가능 (claimed_by만 업데이트)
CREATE POLICY "Users can claim GPT ideas"
ON "public"."gpt_ideas"
FOR UPDATE
TO authenticated
USING (claimed_by IS NULL)
WITH CHECK (claimed_by = auth.uid());

-- ============================================
-- gpt_ideas_likes 테이블 정책
-- ============================================
-- 모든 사용자가 좋아요 읽기 가능
CREATE POLICY "GPT idea likes are viewable by everyone"
ON "public"."gpt_ideas_likes"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 자신의 좋아요만 생성/삭제 가능
CREATE POLICY "Users can manage their own GPT idea likes"
ON "public"."gpt_ideas_likes"
FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ============================================
-- post_replies 테이블 정책
-- ============================================
-- 모든 사용자가 댓글 읽기 가능
CREATE POLICY "Post replies are viewable by everyone"
ON "public"."post_replies"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 댓글 생성 가능
CREATE POLICY "Users can create post replies"
ON "public"."post_replies"
FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

-- 사용자는 자신의 댓글만 수정/삭제 가능
CREATE POLICY "Users can update their own post replies"
ON "public"."post_replies"
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own post replies"
ON "public"."post_replies"
FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- ============================================
-- post_upvotes 테이블 정책
-- ============================================
-- 모든 사용자가 좋아요 읽기 가능
CREATE POLICY "Post upvotes are viewable by everyone"
ON "public"."post_upvotes"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 자신의 좋아요만 생성/삭제 가능
CREATE POLICY "Users can manage their own post upvotes"
ON "public"."post_upvotes"
FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ============================================
-- topics 테이블 정책
-- ============================================
-- 모든 사용자가 토픽 읽기 가능
CREATE POLICY "Topics are viewable by everyone"
ON "public"."topics"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 토픽 생성 가능 (관리자 전용으로 제한하려면 추가 조건 필요)
CREATE POLICY "Authenticated users can create topics"
ON "public"."topics"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 인증된 사용자는 토픽 수정 가능
CREATE POLICY "Authenticated users can update topics"
ON "public"."topics"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- posts 테이블 정책
-- ============================================
-- 모든 사용자가 포스트 읽기 가능
CREATE POLICY "Posts are viewable by everyone"
ON "public"."posts"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 포스트 생성 가능
CREATE POLICY "Users can create posts"
ON "public"."posts"
FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

-- 사용자는 자신의 포스트만 수정/삭제 가능
CREATE POLICY "Users can update their own posts"
ON "public"."posts"
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own posts"
ON "public"."posts"
FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- ============================================
-- team_members 테이블 정책
-- ============================================
-- 팀 멤버는 자신의 팀 정보 읽기 가능
CREATE POLICY "Users can read their team memberships"
ON "public"."team_members"
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1
        FROM "public"."teams"
        WHERE "teams"."team_id" = "team_members"."team_id"
        AND "teams"."team_leader_id" = auth.uid()
    )
);

-- 팀 리더는 팀 멤버 관리 가능
CREATE POLICY "Team leaders can manage team members"
ON "public"."team_members"
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM "public"."teams"
        WHERE "teams"."team_id" = "team_members"."team_id"
        AND "teams"."team_leader_id" = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM "public"."teams"
        WHERE "teams"."team_id" = "team_members"."team_id"
        AND "teams"."team_leader_id" = auth.uid()
    )
);

-- ============================================
-- events 테이블 정책
-- ============================================
-- 모든 사용자가 이벤트 읽기 가능 (분석 목적)
CREATE POLICY "Events are viewable by everyone"
ON "public"."events"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 자신의 이벤트만 생성 가능
CREATE POLICY "Users can create their own events"
ON "public"."events"
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- ============================================
-- teams 테이블 정책
-- ============================================
-- 모든 사용자가 팀 정보 읽기 가능
CREATE POLICY "Teams are viewable by everyone"
ON "public"."teams"
FOR SELECT
TO public
USING (true);

-- 인증된 사용자는 자신의 팀만 생성 가능
CREATE POLICY "Users can create their own teams"
ON "public"."teams"
FOR INSERT
TO authenticated
WITH CHECK (team_leader_id = auth.uid());

-- 사용자는 자신이 리더인 팀만 수정/삭제 가능
CREATE POLICY "Team leaders can update their teams"
ON "public"."teams"
FOR UPDATE
TO authenticated
USING (team_leader_id = auth.uid())
WITH CHECK (team_leader_id = auth.uid());

CREATE POLICY "Team leaders can delete their teams"
ON "public"."teams"
FOR DELETE
TO authenticated
USING (team_leader_id = auth.uid());

-- ============================================
-- notifications 테이블 정책
-- ============================================
-- 사용자는 자신의 알림만 읽기 가능
CREATE POLICY "Users can read their own notifications"
ON "public"."notifications"
FOR SELECT
TO authenticated
USING (target_id = auth.uid());

-- 시스템은 알림 생성 가능 (서버 사이드에서만, 여기서는 허용)
CREATE POLICY "Notifications can be created"
ON "public"."notifications"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 사용자는 자신의 알림만 수정(seen) 가능
CREATE POLICY "Users can update their own notifications"
ON "public"."notifications"
FOR UPDATE
TO authenticated
USING (target_id = auth.uid())
WITH CHECK (target_id = auth.uid());

-- 사용자는 자신의 알림만 삭제 가능
CREATE POLICY "Users can delete their own notifications"
ON "public"."notifications"
FOR DELETE
TO authenticated
USING (target_id = auth.uid());

