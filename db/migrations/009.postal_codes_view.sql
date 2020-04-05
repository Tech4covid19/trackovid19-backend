    --
    -- For retrieving postal code description by postal_number
    --
    create or replace view public.postal_code_descriptions AS
    select pc.postal_number, string_agg(pc.municipality_name, ', ' order by pc.municipality_name) as description
    from (
        select ppc.postal_number, ppc.municipality_name
        from public.pt_postal_codes ppc
        group by ppc.postal_number, ppc.municipality_name
    ) pc
    group by pc.postal_number;

    alter table public.postal_code_descriptions owner to postgres;

    create or replace view public.status_by_postalcode
    as
    select sview.postalcode1, sview.status, sview.status_text, sview.summary_order, sview.hits, pcd.description as postalcode_description, sview.latest_status_ts
    from 
    (
        select us.postalcode1, us.id as status, us.status_summary as status_text, us.summary_order, count(h.*) as hits, max(ls.timestamp) as latest_status_ts
        from public.history h
        inner join public.latest_status ls on ls.user_id = h.user_id and ls.history_id = h.id
        right outer join (
            select * 
            from (
                select distinct h.postalcode1
                from public.history h
            ) hh
            cross join (
                select *
                from public.user_status users
                where users.show_in_summary = true
            ) us
        ) us on us.id = h.status and us.postalcode1 = h.postalcode1
        group by us.postalcode1, us.id, us.status_summary, us.summary_order
        union all
        select h.postalcode1, case when us.has_symptoms then 100 else 200 end as status, case when us.has_symptoms then 'Com sintomas' else 'Sem sintomas' end as status_text, case when us.has_symptoms then 5 else 6 end as summary_order, count(h.*) as hits, max(ls.timestamp) as latest_status_ts
        from public.history h
        inner join public.latest_status ls on ls.user_id = h.user_id and ls.history_id = h.id
        inner join (
            select uus.history_id, min(uus.symptom_id), case when min(uus.symptom_id) = 1 then false else true end as has_symptoms
            from public.user_symptoms uus
            group by uus.history_id
        ) us on us.history_id = h.id
        where h.postalcode1 is not null
        group by h.postalcode1, us.has_symptoms
    ) sview
    inner join public.postal_code_descriptions pcd on pcd.postal_number = sview.postalcode1;


    create or replace view public.confinement_states_by_postalcode
    as
    select sview.postalcode1, sview.confinement_state, sview.confinement_state_text, sview.summary_order, sview.hits, pcd.description as postalcode_description, sview.latest_status_ts
    from (
        select con.postalcode1, con.confinement_state, con.state_summary as confinement_state_text, con.summary_order, sum(con.hit_value) as hits, max(con.timestamp) as latest_status_ts
        from (
            select cs.postalcode1, case when cs.id in (2, 3) then 300 else cs.id end as confinement_state, cs.state_summary, cs.summary_order, case when h.confinement_state is not null then 1 else 0 end as hit_value, ls.timestamp
            from public.history h
            inner join public.latest_status ls on ls.user_id = h.user_id and ls.history_id = h.id
            right outer join (
                select * 
                from (
                    select distinct h.postalcode1
                    from public.history h
                ) hh
                cross join (
                    select *
                    from public.confinement_states cons
                    where cons.show_in_summary =  true
                ) cs
            ) cs on cs.id = h.confinement_state and cs.postalcode1 = h.postalcode1
        ) as con
        group by con.postalcode1, con.confinement_state, con.state_summary, con.summary_order
    ) sview 
    inner join public.postal_code_descriptions pcd on pcd.postal_number = sview.postalcode1;