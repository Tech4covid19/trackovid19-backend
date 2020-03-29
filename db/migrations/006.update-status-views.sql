
--  let's update the new column we added to the users table
update public.users as u
set latest_status_id = ls.history_id
from public.latest_status as ls
where ls.user_id = u.id;

-- Now update the latest status view
create or replace view public.latest_status AS
 select a.user_id,
    a.id as history_id,
    a.status,
    a.confinement_state,
    a."timestamp"
   from public.history a
   inner join public.users u on u.latest_status_id = a.id;