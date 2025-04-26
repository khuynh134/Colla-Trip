-- Drop tables if they exist (BE CAREFUL IN PRODUCTION!)
DROP TABLE IF EXISTS trip_members CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS packing_list CASCADE;
DROP TABLE IF EXISTS trips CASCADE;

-- Create users table
CREATE TABLE users(
    id SERIAL NOT NULL,
    firebase_uid varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    profile jsonb,
    roles varchar[] DEFAULT ARRAY['user'::varchar],
    PRIMARY KEY(id)
);

-- Create indexes for users table
CREATE UNIQUE INDEX users_firebase_uid_key ON users USING btree (firebase_uid);
CREATE UNIQUE INDEX users_email_key ON users USING btree (email);
CREATE UNIQUE INDEX users_username_key ON users USING btree (username);

-- Create trips table
CREATE TABLE trips(
    id SERIAL NOT NULL,
    name varchar(255) NOT NULL,
    location text,
    start_date date,
    end_date date,
    budget numeric,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    PRIMARY KEY(id)
);

-- Rename and add columns
ALTER TABLE trips RENAME COLUMN name TO title;
ALTER TABLE trips ADD COLUMN description TEXT;
ALTER TABLE trips ADD COLUMN created_by VARCHAR(255);

-- Create activities table
CREATE TABLE activities(
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text,
    votes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    highlighted boolean DEFAULT false,
    activity_date date
);

-- Create packing_list table
CREATE TABLE packing_list(
    packing_list_id SERIAL NOT NULL,
    item_name varchar(255) NOT NULL,
    item_quantity integer NOT NULL,
    created_by_name varchar(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    PRIMARY KEY(packing_list_id),
    CONSTRAINT packing_list_item_quantity_check CHECK ((item_quantity >= 1) AND (item_quantity <= 100))
);

-- Create trip_members table (AFTER trips and users)
CREATE TABLE trip_members(
    id SERIAL NOT NULL,
    trip_id integer,
    user_id integer,
    PRIMARY KEY(id),
    CONSTRAINT trip_members_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT trip_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

