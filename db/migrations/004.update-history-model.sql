-- update users to point to the latest history entry ------------------------------------

alter table public.users add latest_status_id bigint;

create index users_latest_status_id on public.users using btree (latest_status_id);

alter table public.users add constraint users_latest_status_id_fkey foreign key (latest_status_id) references public.history(id);
