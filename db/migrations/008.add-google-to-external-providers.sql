INSERT INTO external_id_providers (id, provider, description)
VALUES (2, 'Google', 'Google')
ON CONFLICT (id)
DO NOTHING;
