insert into usuario values(1,'jugador1',NOW());
insert into usuario values(2,'jugador2',NOW());
insert into usuario values(3,'jugador3',NOW());
insert into usuario values(4,'jugador4',NOW());
insert into usuario values(5,'jugador5',NOW());
insert into usuario values(6,'jugador6',NOW());

insert into jugador values(1,'hola','hola');
insert into jugador values(2,'hola','hola');
insert into jugador values(3,'hola','hola');
insert into jugador values(4,'hola','hola');
insert into jugador values(5,'hola','hola');
insert into jugador values(6,'hola','hola');

insert into partida values(1,1,2);
insert into partida values(2,2,1);
insert into partida values(3,1,2);
insert into sala values(1,1,1,2,sha('contraseña'),'sala de prueba',1,0);
insert into sala values(1,2,1,2,sha('contraseña'),'sala de prueba',1,0);
insert into sala values(1,3,1,2,sha('contraseña'),'sala de prueba',1,1);
insert into espectador values(1,3);
insert into espectador values(1,4);
insert into espectador values(1,5);
