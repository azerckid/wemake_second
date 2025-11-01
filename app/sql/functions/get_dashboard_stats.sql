CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id uuid)
RETURNS TABLE (
    views bigint,
    month text
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) AS views,
        to_char(events.created_at, 'YYYY-MM') AS month
    FROM public.events
    WHERE event_data ->> 'username' = (SELECT username FROM public.profiles WHERE profile_id = get_dashboard_stats.user_id)
    GROUP BY month;
END;
$$ LANGUAGE plpgsql;