CREATE TABLE public.notifications
(
    code character varying(50) NOT NULL,
    title character varying(200),
    body character varying(1000),
    options character varying(1000),
    CONSTRAINT notifications_pkey PRIMARY KEY (code)
);

INSERT INTO notifications (code, title, body, options)
VALUES ('users-no-update-24h', 'Atualização pendente', 'Não atualizou o seu estado nas últimas 24 horas.', '{
  "icon": "https://app.covidografia.pt/assets/img/favicon/favicon-32x32.png"
}')
ON CONFLICT (code)
DO NOTHING;



CREATE FUNCTION get_subscriptions_for_job(p_notification_code character varying(50)) 
RETURNS TABLE(
push_subscriptions_id integer, 
user_id integer,
endpoint character varying(500),
keys character varying(500)
)
AS $$
BEGIN

if p_notification_code = 'users-no-update-24h' then
	return Query (
	select 
	push_subscriptions.id as push_subscriptions_id
	,push_subscriptions.user_id
	,push_subscriptions.endpoint
	,push_subscriptions.keys
	from latest_status, push_subscriptions
	where 
	latest_status.user_id = push_subscriptions.user_id
	and push_subscriptions.push_type = 'web-push'
	and latest_status.timestamp <= CURRENT_TIMESTAMP + interval '-24h'
	);
end if;

END
$$
LANGUAGE plpgsql