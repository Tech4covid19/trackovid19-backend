CREATE TABLE public.notifications
(
    code character varying(50) NOT NULL,
    title character varying(200),
    body character varying(1000),
    options character varying(1000),
	  sent_block_size int,
    CONSTRAINT notifications_pkey PRIMARY KEY (code)
);

INSERT INTO notifications (code, title, body, options, sent_block_size)
VALUES ('users-no-update-24h', 'Atualização pendente', 'Não atualizou o seu estado nas últimas 24 horas.', '{
  "icon": "https://app.covidografia.pt/assets/img/favicon/favicon-32x32.png"
}', 100)
ON CONFLICT (code)
DO NOTHING;



CREATE SEQUENCE public.push_deliveries_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE public.push_deliveries
(
	id bigint NOT NULL DEFAULT nextval('public.push_deliveries_id_seq'::regclass),
	push_subscriptions_id bigint NOT NULL,
    notification_code character varying(50) NOT NULL,
	sent_at timestamp,
    CONSTRAINT user_notifications_pkey PRIMARY KEY (id)
);



CREATE FUNCTION get_subscriptions_for_job(p_notification_code character varying(50), p_pagesize int) 
RETURNS TABLE(
push_deliveries_id bigint,
push_subscriptions_id integer, 
user_id integer,
endpoint character varying(500),
keys character varying(500)
)
AS $$
BEGIN

if p_notification_code = 'users-no-update-24h' then
	-- queue is empty of all sent
	if not exists (select id from push_deliveries where sent_at is null) then
		-- delete deliveries sent before last 24h
		delete from push_deliveries where sent_at <= CURRENT_TIMESTAMP + interval '-24h';
	
		-- add data to deliveries queues if no data present
		insert into push_deliveries(push_subscriptions_id, notification_code, sent_at)
		select
		push_subscriptions.id as push_subscriptions_id
		,p_notification_code
		,null
		from latest_status, push_subscriptions
		where 
			latest_status.user_id = push_subscriptions.user_id
			and push_subscriptions.push_type = 'web-push'
			and latest_status.timestamp <= CURRENT_TIMESTAMP + interval '-24h'
			and push_subscriptions.id not in (
				select push_deliveries.push_subscriptions_id from push_deliveries
			)
			;
	end if;

	-- return top (p_pagesize) rows from queue
	return Query (
		select
		push_deliveries.id as push_deliveries_id
		,push_subscriptions.id as push_subscriptions_id
		,push_subscriptions.user_id
		,push_subscriptions.endpoint
		,push_subscriptions.keys
		from push_subscriptions, push_deliveries
		where 
			push_subscriptions.id = push_deliveries.push_subscriptions_id
			and sent_at is null
		order by push_deliveries.id
		limit p_pagesize
	);
end if;

END
$$
LANGUAGE plpgsql