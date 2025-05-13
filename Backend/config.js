
import { config } from 'dotenv';
import {google} from 'googleapis';
config();

export const PORT = process.env.PORT || 5000;
export const PG_USER = process.env.PGUSER || 'postgres';
export const PG_PASSWORD = process.env.PGPASSWORD || '023281012';
export const PG_HOST = process.env.PGHOST || 'localhost';
export const PG_DATABASE = process.env.PGDATABASE || 'gestion_udem';
export const PG_PORT = process.env.PGPORT || 5432;

export const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL,
  );
  