-- Table: public.states
-- DROP TABLE public.states;
CREATE TABLE public.states
(
    id integer NOT NULL DEFAULT nextval('state_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    country_id integer DEFAULT nextval('state_country_id_seq'::regclass),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT state_pkey PRIMARY KEY (id),
    CONSTRAINT state_ibfk_1 FOREIGN KEY (country_id)
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)
TABLESPACE pg_default;
ALTER TABLE public.states OWNER to postgres;



-- Table: public.statusd
-- DROP TABLE public.statusd;
CREATE TABLE public.statusd
(
    id integer NOT NULL DEFAULT nextval('statusd_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT statusd_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE public.statusd OWNER to postgres;




-- Table: public.users
-- DROP TABLE public.users;
CREATE TABLE public.users
(
    id character varying(8) COLLATE pg_catalog."default" NOT NULL,
    status_id integer DEFAULT nextval('users_status_id_seq'::regclass),
    city_id integer DEFAULT nextval('users_city_id_seq'::regclass),
    state_id integer DEFAULT nextval('users_state_id_seq'::regclass),
    country_id integer DEFAULT nextval('users_country_id_seq'::regclass),
    username character varying(20) COLLATE pg_catalog."default" NOT NULL,
    surname character varying(20) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    other_name character varying(20) COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default" NOT NULL,
    email character varying(30) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(15) COLLATE pg_catalog."default" NOT NULL,
    dob character varying(15) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    photo text COLLATE pg_catalog."default",
    address character varying(50) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    gender character varying(6) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_fk_city FOREIGN KEY (city_id)
        REFERENCES public.cities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT users_fk_country FOREIGN KEY (country_id)
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT users_fk_state FOREIGN KEY (state_id)
        REFERENCES public.states (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT users_fk_status FOREIGN KEY (status_id)
        REFERENCES public.status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)
TABLESPACE pg_default;
ALTER TABLE public.users
    OWNER to postgres;





-- Table: public.user_agents
-- DROP TABLE public.user_agents;
CREATE TABLE public.user_agents
(
    id integer NOT NULL DEFAULT nextval('user_agent_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_agent_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE public.user_agents
    OWNER to postgres;