-- update users to point to the latest history entry ------------------------------------

alter table public.users add latest_status_id bigint;

create index users_latest_status_id on public.users using btree (latest_status_id);

alter table public.users add constraint users_latest_status_id_fkey foreign key (latest_status_id) references public.history(id);


CREATE OR REPLACE PROCEDURE delete_user(p_user_id bigint, p_user_data_id character varying(64))
LANGUAGE SQL
AS $$

delete from push_subscriptions where user_id = p_user_id;
delete from user_symptoms where history_id in (
	select history.id
	from history, users
	where history.user_id = users.id
	and users.id = p_user_id
);
update users set latest_status_id = null where id = p_user_id;
delete from history where user_id = p_user_id;
delete from users where id = p_user_id;
delete from users_data where id = p_user_data_id;

$$;