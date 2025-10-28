-- 향상된 이벤트 추적 함수
create or replace function track_event(
    p_event_type event_type,
    p_event_data jsonb default '{}',
    p_user_id uuid default null,
    p_session_id text default null,
    p_ip_address text default null,
    p_user_agent text default null,
    p_referrer text default null
) returns uuid as $$
declare
    v_event_id uuid;
begin
    -- 이벤트 ID 생성
    v_event_id := gen_random_uuid();
    
    -- 이벤트 데이터 삽입
    insert into events (
        event_id,
        event_type,
        event_data,
        user_id,
        session_id,
        ip_address,
        user_agent,
        referrer,
        created_at
    ) values (
        v_event_id,
        p_event_type,
        p_event_data,
        p_user_id,
        p_session_id,
        p_ip_address,
        p_user_agent,
        p_referrer,
        now()
    );
    
    -- 생성된 이벤트 ID 반환
    return v_event_id;
    
exception
    when others then
        -- 에러 발생 시 로그 기록 (선택사항)
        raise notice 'Error tracking event: %', sqlerrm;
        return null;
end;
$$ language plpgsql;

-- 간단한 버전 (하위 호환성 유지)
create or replace function track_simple_event(
    p_event_type event_type,
    p_event_data jsonb default '{}'
) returns uuid as $$
begin
    return track_event(p_event_type, p_event_data);
end;
$$ language plpgsql;