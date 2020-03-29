CREATE PROCEDURE delete_user(p_user_id bigint, p_user_data_id character varying(64))
LANGUAGE SQL
AS $$

delete from push_subscriptions where user_id = p_user_id;
delete from user_symptoms where history_id in (
	select history.id
	from history, users
	where history.user_id = users.id
	and users.id = p_user_id
);
delete from history where user_id = p_user_id;
delete from users where id = p_user_id;
delete from users_data where id = p_user_data_id;

$$;