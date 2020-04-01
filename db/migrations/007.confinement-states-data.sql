update confinement_states
set 
state_summary = 'A trabalhar fora de casa',
description = 'Trabalho fora de casa'
where id = 4
and state_summary = 'Rotina habitual' -- to be sure...
and description = 'Faço a minha rotina habitual'; -- to be sure...

update confinement_states
set 
description = 'Presumo estar saudável e, por prevenção, estou em casa'
where id = 1
and description = 'Presumo estar saudável e estou por opção em casa em prevenção'; -- to be sure...