import { Pool } from 'pg';

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});

export default pool;
