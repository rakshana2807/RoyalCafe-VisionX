CREATE OR REPLACE FUNCTION book_space_safe(
    p_user_id uuid,
    p_customer_name text,
    p_space_id uuid,
    p_booking_date date,
    p_start_time time,
    p_end_time time,
    p_duration_hours numeric,
    p_number_of_people integer,
    p_total_amount numeric,
    p_status text,
    p_payment_status text,
    p_special_request text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conflict_count int;
    v_booking_id uuid;
BEGIN
    -- Check if auth.uid() matches p_user_id to prevent bypassing RLS
    IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Not authorized to book for another user';
    END IF;

    -- Apply an explicit transaction lock at the table level or advisory lock
    -- to serialize requests for the same space.
    PERFORM pg_advisory_xact_lock(hashtext(p_space_id::text));

    -- Check for overlapping confirmed or checked_in bookings
    SELECT count(*)
    INTO v_conflict_count
    FROM bookings
    WHERE space_id = p_space_id
      AND booking_date = p_booking_date
      AND status IN ('confirmed', 'checked_in')
      AND start_time < p_end_time
      AND end_time > p_start_time;

    IF v_conflict_count > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'SPACE_ALREADY_BOOKED'
        );
    END IF;

    -- Insert the booking since there is no conflict
    INSERT INTO bookings (
        user_id,
        customer_name,
        space_id,
        booking_date,
        start_time,
        end_time,
        duration_hours,
        number_of_people,
        total_amount,
        status,
        payment_status,
        special_request
    ) VALUES (
        p_user_id,
        p_customer_name,
        p_space_id,
        p_booking_date,
        p_start_time,
        p_end_time,
        p_duration_hours,
        p_number_of_people,
        p_total_amount,
        p_status,
        p_payment_status,
        p_special_request
    ) RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id
    );
END;
$$;
