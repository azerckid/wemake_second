-- Enable RLS for message-related tables
ALTER TABLE "public"."message_rooms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."message_room_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read message rooms they are members of
CREATE POLICY "Users can read message rooms they belong to"
ON "public"."message_rooms"
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM "public"."message_room_members"
        WHERE "message_room_members"."message_room_id" = "message_rooms"."message_room_id"
        AND "message_room_members"."profile_id" = auth.uid()
    )
);

-- Policy: Users can insert message rooms (for creating new conversations)
CREATE POLICY "Users can create message rooms"
ON "public"."message_rooms"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Users can read message room memberships they belong to
CREATE POLICY "Users can read their own room memberships"
ON "public"."message_room_members"
FOR SELECT
TO authenticated
USING ("profile_id" = auth.uid() OR EXISTS (
    SELECT 1
    FROM "public"."message_room_members" mrm2
    WHERE mrm2."message_room_id" = "message_room_members"."message_room_id"
    AND mrm2."profile_id" = auth.uid()
));

-- Policy: Users can insert themselves into message rooms
CREATE POLICY "Users can join message rooms"
ON "public"."message_room_members"
FOR INSERT
TO authenticated
WITH CHECK ("profile_id" = auth.uid());

-- Policy: Users can read messages from rooms they belong to
CREATE POLICY "Users can read messages from their rooms"
ON "public"."messages"
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM "public"."message_room_members"
        WHERE "message_room_members"."message_room_id" = "messages"."message_room_id"
        AND "message_room_members"."profile_id" = auth.uid()
    )
);

-- Policy: Users can insert messages into rooms they belong to
CREATE POLICY "Users can send messages to their rooms"
ON "public"."messages"
FOR INSERT
TO authenticated
WITH CHECK (
    "sender_id" = auth.uid()
    AND EXISTS (
        SELECT 1
        FROM "public"."message_room_members"
        WHERE "message_room_members"."message_room_id" = "messages"."message_room_id"
        AND "message_room_members"."profile_id" = auth.uid()
    )
);

-- Policy: Users can only update/delete their own messages
CREATE POLICY "Users can update their own messages"
ON "public"."messages"
FOR UPDATE
TO authenticated
USING ("sender_id" = auth.uid())
WITH CHECK ("sender_id" = auth.uid());

CREATE POLICY "Users can delete their own messages"
ON "public"."messages"
FOR DELETE
TO authenticated
USING ("sender_id" = auth.uid());

