-- Dumping structure for table public.status
DROP TABLE IF EXISTS "status";
CREATE TABLE IF NOT EXISTS "status" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dumping data for table public.status: 0 rows
/*!40000 ALTER TABLE "status" DISABLE KEYS */;
INSERT INTO "status" ("id", "name", "created_at", "updated_at") VALUES
    (1, 'active', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (2, 'inactive', '2022-12-15 01:00:00', '2021-09-01 09:24:42'),
    (3, 'new', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (4, 'seen', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (5, 'online', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (6, 'offline', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (7, 'open', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (8, 'closed', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (9, 'canceled', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (10, 'available', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (11, 'out of stock', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (12, 'paid', '2022-12-15 01:00:00', '2022-12-15 01:00:00'),
    (13, 'delivered', '2022-12-15 01:00:00', '2022-12-15 01:00:00');
/*!40000 ALTER TABLE "status" ENABLE KEYS */;



DROP TABLE IF EXISTS "delivery_types";
DROP SEQUENCE IF EXISTS delivery_types_id_seq;
CREATE SEQUENCE delivery_types_id_seq Increment 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."delivery_types" (
    "id" integer DEFAULT nextval('delivery_types_id_seq') NOT NULL,
    "name" character varying(20) NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "delivery_types_name_key" UNIQUE ("name"),
    CONSTRAINT "delivery_types_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

TRUNCATE "delivery_types";
INSERT INTO "delivery_types" ("id", "name", "created_at", "updated_at") VALUES
(1, 'home delivery',    '2022-12-15 01:00:00',  '2022-12-15 01:00:00'),
(2, 'pickup',   '2022-12-15 01:00:00',  '2021-09-01 09:24:42');

-- Dumping structure for table public.country
DROP TABLE IF EXISTS "country";
CREATE TABLE IF NOT EXISTS "country" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "sort_name" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone_code" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);
-- Dumping data for table public.country: 0 rows
/*!40000 ALTER TABLE "country" DISABLE KEYS */;
/*!40000 ALTER TABLE "country" ENABLE KEYS */;

-- Dumping structure for table public.state
DROP TABLE IF EXISTS "state";
CREATE TABLE IF NOT EXISTS "state" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "country_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "state_ibfk_1" FOREIGN KEY ("country_id") REFERENCES "country" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);
-- Dumping data for table public.state: 0 rows
/*!40000 ALTER TABLE "state" DISABLE KEYS */;
/*!40000 ALTER TABLE "state" ENABLE KEYS */;

-- Dumping structure for table public.city
DROP TABLE IF EXISTS "city";
CREATE TABLE IF NOT EXISTS "city" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "state_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "city_ibfk_1" FOREIGN KEY ("state_id") REFERENCES "state" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);

-- Dumping data for table public.city: 0 rows
/*!40000 ALTER TABLE "city" DISABLE KEYS */;
/*!40000 ALTER TABLE "city" ENABLE KEYS */;

-- Dumping structure for table public.users
DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
    "id" VARCHAR(8) NOT NULL PRIMARY KEY,
    "status_id" SERIAL NOT NULL,
    "city_id" SERIAL NOT NULL,
    "state_id" SERIAL NOT NULL,
    "country_id" SERIAL NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "surname" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "other_name" VARCHAR(50) NULL DEFAULT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL UNIQUE,
    "phone" VARCHAR(20) NOT NULL,
    "dob" VARCHAR(15) NULL DEFAULT NULL,
    "photo" CHAR NULL DEFAULT NULL,
    "address" VARCHAR(50) NULL DEFAULT NULL,
    "gender" VARCHAR(6) NULL DEFAULT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT "users_fk_city" FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "users_fk_country" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "users_fk_state" FOREIGN KEY ("state_id") REFERENCES "states" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "users_fk_status" FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);
 
-- Dumping structure for table public.sessions
DROP TABLE IF EXISTS "sessions";
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "users_id" VARCHAR(8) NULL DEFAULT NULL,
    "status_id" SERIAL NOT NULL,
    "device_id" SERIAL NOT NULL,
    "user_agent_id" SERIAL NOT NULL,
    "platform_id" SERIAL NOT NULL,
    "os_id" SERIAL NOT NULL,
    "ip_address" VARCHAR(50) NULL DEFAULT NULL,
    "token" VARCHAR(50) NOT NULL UNIQUE,
    "duration" VARCHAR(50) NULL DEFAULT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_fk_status" FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "session_fk_user" FOREIGN KEY ("users_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);

-- Dumping structure for table public.delivery_type
DROP TABLE IF EXISTS "delivery_types";
CREATE TABLE IF NOT EXISTS "delivery_types" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dumping structure for table public.orders
DROP TABLE IF EXISTS "orders";
CREATE TABLE IF NOT EXISTS "orders" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "user_id" VARCHAR(8) NULL DEFAULT NULL,
    "status_id" INTEGER NULL DEFAULT NULL,
    "delivery_type_id" INTEGER NULL DEFAULT NULL,
    "invoice_no" VARCHAR(20) NOT NULL UNIQUE,
    "sub_amount" INTEGER NOT NULL,
    "discount_amount" INTEGER NULL DEFAULT NULL,
    "shipping_cost" INTEGER NULL DEFAULT NULL,
    "total_amount" INTEGER NOT NULL,
    "shipping_address" VARCHAR(50) NULL DEFAULT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_fk_delivery_type" FOREIGN KEY ("delivery_type_id") REFERENCES "delivery_types" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "order_fk_status" FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "order_fk_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);

-- Dumping structure for table public.cart
DROP TABLE IF EXISTS "cart";
CREATE TABLE IF NOT EXISTS "cart" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "product_id" VARCHAR(50) NULL DEFAULT NULL,
    "order_id" INTEGER NULL DEFAULT NULL,
    "price" INTEGER NULL DEFAULT NULL,
    "discount" INTEGER NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_fk_order" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "order_fk_product" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON UPDATE NO ACTION ON DELETE SET NULL
);

-- Dumping data for table public.session: 0 rows
/*!40000 ALTER TABLE "session" DISABLE KEYS */;
/*!40000 ALTER TABLE "session" ENABLE KEYS */;