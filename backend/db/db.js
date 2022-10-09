import postgres from 'pg';

const { Pool } = postgres;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'geegleevents',
    password: 'postgres',
    port: 5432,
});

const db = {
    query: (text, params) => pool.query(text, params)
};

export default db;