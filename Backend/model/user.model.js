import { pool } from "../db_config.js";
import { google } from "googleapis";


const createUser = async ({names, lastnames, birthdate, email, password}) => {//Actualizar
    try {
        const query = 'INSERT INTO users (names, lastnames,birthdate, email, password) VALUES ($1, $2, $3, $4,$5) RETURNING *';
        const values = [names, lastnames, birthdate, email, password]; // verificar 
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
}

const searchUser = async (email,password) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const values = [email,password];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding user :', error);
        throw error;
    }
}


//Crerar evento en Google Calendar
/*const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });
const createEvent = async ({ name, description, date, time,}) => {
    const startDateTime = moment(`${date}T${time}`);
    const endDateTime = startDateTime.clone().add(25, 'minutes');
    const event = {
      'summary': name,
      'location': 'Medellin, Colombia',
      'description': description,
      'start': {
        'dateTime': startDateTime.toISOString(),
        'timeZone': 'Bogota/Colombia',
      },
      'end': {
        'dateTime': endDateTime.toISOString(),
        'timeZone': 'Bogota/Colombia',
      },
      'conferenceData': {
        'createRequest': {
          'requestId': Math.random().toString(36).substring(7),
          'conferenceSolutionKey': { type: 'hangoutsMeet' },
        },
      'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],  
      },
    }
    }
}*/

export const UserModel = {
    createUser, searchUser, findUserByEmail
}