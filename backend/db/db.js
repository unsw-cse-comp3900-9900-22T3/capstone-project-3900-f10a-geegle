import postgres from 'pg';
import * as dotenv from 'dotenv'

dotenv.config()

const { Pool } = postgres;

// Defines all the environment variables to setup psql connection
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

// Modularised function to export as a query
const db = {
    query: (text, params) => pool.query(text, params)
};

export default db;