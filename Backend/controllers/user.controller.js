import { UserModel } from "../model/user.model.js";
import { OAuth2Client } from "../config.js";
import { google } from "googleapis";
import moment from "moment-timezone";


export const UserRegister = async (req, res) => {
    try {
        const { names, lastnames, birthdate, email, password } = req.body;
        console.log(req.body);
        
        // validar 
        if (!names || !lastnames || !birthdate || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Existe el usuario
        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // crear el usuario
        const newUser = await UserModel.createUser({ names, lastnames, birthdate, email, password });
        return res.status(201).json({ ok:true , message: 'ok' , newUser });
    }
    catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ 
            ok: false,
            message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await UserModel.searchUser(email,password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.password !== password && user.email !== email) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        else{
            return res.status(200).json({ message: 'Login successful', user });
        }
        

    }
    catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const authUrl = (req, res) => {
const url = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar.events.owned'          
    ],
    redirect_uri: process.env.REDIRECT_URL
});
res.redirect(url);
};

const googleRedirect = async (req, res) => {
    const { code } = req.query;
    console.log('Código de autorización:', code);
    try {
        const { tokens } = await OAuth2Client.getToken(code);
        OAuth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: OAuth2Client,
            version: 'v2',
        });
        const userInfo = await oauth2.userinfo.get();
        res.json(userInfo.data);
        console.log(userInfo.data); 
    } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
        res.status(500).send('Error al autenticar con Google');
    }
}

//inicializar gooogle calnedar 
const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });
// Crear evento en Google Calendar
const createEvent = async (req, res) => {
    
    const {name, description, date, time } = req.body;
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
      }}}
    console.log('Evento:', event);
    try {
        const response = await calendar.events.insert({
            auth: OAuth2Client,
            calendarId: 'primary',
            resource: event,
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event' });
    }
};




//Crerar evento en Google Calendar

export const UserController = {
    UserRegister,
    login,
    authUrl,
    googleRedirect,
    createEvent
    //googleRedirect: authUrl
}