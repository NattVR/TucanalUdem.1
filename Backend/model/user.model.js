import { pool } from "../db_config.js";
import { google } from "googleapis";


const createUser = async ({names, lastnames, id_type, id, birthdate, email, password}) => {
    try {
        const checkquery = 'SELECT * FROM students WHERE id_type = $1 and id= $2';
        const checkvalues = [id_type, id];
        const checkresult = await pool.query(checkquery, checkvalues);
        console.log('checkresult',checkresult.rows,checkquery,checkvalues);
      
        if (checkresult.rows.length > 0) {
          const query = 'INSERT INTO users (names, lastnames,id_type, id, birthdate, email, password) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING *';
          const values = [names, lastnames,id_type,id, birthdate, email, password]; 
          const result = await pool.query(query, values);
          return result.rows[0];}
        else {
            console.log('El estudiante no existe en la base de datos');
        }

    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

const searchUser = async (type_id, id ,password) => {
    try {
        const query = 'SELECT * FROM users WHERE id_type= $1 AND id= $2 AND password = $3';
        const values = [type_id, id, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding user :', error);
        throw error;
    }
}

export const UserModel = {
    createUser, searchUser
}