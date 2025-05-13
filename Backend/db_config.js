
import pg from 'pg'
import {PORT,PG_DATABASE,PG_HOST,PG_PASSWORD,PG_USER,PG_PORT } from './config.js' 
const { Pool} = pg
 
export const pool = new Pool({
  allowExitOnIdle: true, // qaue hace 
  user: PG_USER,
  host: PG_HOST,
  password: PG_PASSWORD, 
  port: PG_PORT,
  database: PG_DATABASE,
})

try{
  await pool.connect()
  console.log('Conectado a la base de datos')
} catch (error) { 
  console.error('Error al conectar a la base de datos', error)
}