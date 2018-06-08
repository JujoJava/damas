drop database if exists damas;
create database damas;
alter database damas COLLATE 'utf8_general_ci';
set time_zone = '+2:00';

use damas;

create table usuario
(
	codusu int NOT NULL,
	nick varchar(16) NOT NULL,
	pulsacion datetime NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	
create table jugador
(
	codusu int NOT NULL, -- clave ajena de usuario
	pass varchar(250) NOT NULL,
	conectado tinyint NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

create table invitado
(
	codusu int NOT NULL -- clave ajena de usuario	
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

create table amigos
(
	codusu int NOT NULL, -- clave ajena de jugador
	codamigo int NOT NULL -- clave ajena de jugador
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- una sala tiene varios espectadores (usuarios) --
create table espectador
(
	codsala int NOT NULL, -- clave ajena de sala -- PK
	codusu int NOT NULL -- clave ajena de usuario -- PK
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- una partida tiene varios movimientos
-- cada combinación tiene un usuario, un movimiento inicial, y uno final --
create table movimiento
(
	codmov int NOT NULL, -- PK
	codpartida int NOT NULL, -- clave ajena de partida -- PK
	codusu int NOT NULL, -- clave ajena de usuario
	numficha int NOT NULL, -- número de ficha
	mov_orig char(2) NOT NULL, -- desde donde mueve
	mov_dest char(2) NOT NULL -- hacia donde mueve
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- representa una ficha que ha sido comida tras un movimiento
-- un movimiento puede tener varias comidas
create table comida
(
	numficha int NOT NULL, -- número de ficha --PK
	codmov int NOT NULL, -- clave ajena de movimiento -- PK
	codpartida int NOT NULL, -- clave ajena de partida -- PK
	color varchar(250) NOT NULL, -- color de la ficha -- PK
	posicion char(2) NOT NULL -- posicion de la ficha en el tablero
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

create table tablas
(
	codpartida int NOT NULL, -- clave ajena de partida -- PK
	codusu int NOT NULL -- clave ajena de usuario -- usuario que propone las tablas -- PK
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- la partida tendrá información básica de una partida, y se puede utilizar como repetición --
create table partida
(
	codpartida int NOT NULL, -- PK
	codnegro int, -- clave ajena de usuario (fichas negras)
	codblanco int, -- clave ajena de usuario (fichas blancas)
	ganador enum('', 'blancas', 'negras', 'tablas'), -- ganador de la partida
	rep_publica_codnegro tinyint DEFAULT 1, -- repetición pública para codnegro
	rep_publica_codblanco tinyint DEFAULT 1, -- repetición pública para codblanco
	rep_fav_codnegro tinyint DEFAULT 0, -- repetición en favoritos para codnegro
	rep_fav_codblanco tinyint DEFAULT 0 -- repetición en favoritos para codblanco
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- una sala tiene varias partidas (una detrás de otra, no de golpe) 
-- una vez termina, se borra
create table sala
(
	codsala int NOT NULL, -- PK
	codpartida int NOT NULL, -- clave ajena a partida -- PK
	anfitrion int NOT NULL, -- creador de la sala, clave ajena de usuario
	visitante int, -- visitante de la sala, clave ajena de usuario
	pass varchar(250), -- contraseña de la sala
	descripcion varchar(50) NOT NULL, -- texto explicativo
	puede_espectar tinyint NOT NULL, -- 1: puede ser espectada | 0: no puede ser espectada
	jugandose tinyint NOT NULL -- 1: jugándose | 0: no jugándose
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

alter table usuario add constraint cp_usuario primary key (codusu);
alter table jugador add constraint cp_jugador primary key (codusu);
alter table invitado add constraint cp_invitado primary key (codusu);
alter table amigos add constraint cp_amigos primary key (codusu, codamigo);
alter table espectador add constraint cp_espectador primary key (codsala,codusu);
alter table movimiento add constraint cp_movimiento primary key (codmov,codpartida);
alter table comida add constraint cp_comida primary key (numficha, codmov, codpartida, color);
alter table tablas add constraint cp_tablas primary key (codpartida, codusu);
alter table partida add constraint cp_partida primary key (codpartida);
alter table sala add constraint cp_sala primary key (codsala,codpartida);

alter table jugador add constraint ca_jugador_usuario foreign key (codusu) references usuario (codusu);
alter table invitado add constraint ca_jugador_invitado foreign key (codusu) references usuario (codusu) on delete cascade;
alter table amigos add constraint ca_amigos_jugador foreign key (codusu) references jugador (codusu) on delete cascade;
alter table amigos add constraint ca_amigos_amigo foreign key (codamigo) references jugador (codusu) on delete cascade;
alter table espectador add constraint ca_espectador_sala foreign key (codsala) references sala (codsala) on delete cascade;
alter table espectador add constraint ca_espectador_usuario foreign key (codusu) references usuario (codusu) on delete cascade;
alter table movimiento add constraint ca_movimiento_partida foreign key (codpartida) references partida (codpartida);
alter table comida add constraint ca_comida_movimiento foreign key (codmov) references movimiento (codmov);
alter table comida add constraint ca_comida_partida foreign key (codpartida) references partida (codpartida);
alter table tablas add constraint ca_tablas_partida foreign key (codpartida) references partida (codpartida);
alter table tablas add constraint ca_tablas_usuario foreign key (codusu) references usuario (codusu);
alter table partida add constraint ca_partida_negro foreign key (codnegro) references usuario (codusu);
alter table partida add constraint ca_partida_blanco foreign key (codblanco) references usuario (codusu);
alter table sala add constraint ca_sala_partida foreign key (codpartida) references partida (codpartida);
alter table sala add constraint ca_sala_anfitrion foreign key (anfitrion) references usuario (codusu);
alter table sala add constraint ca_sala_visitante foreign key (visitante) references usuario (codusu);