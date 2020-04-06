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