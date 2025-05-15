import { UserModel } from "../model/user.model.js";
import { OAuth2Client } from "../config.js";
import { google } from "googleapis";
import moment from "moment-timezone";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport/index.js";
import path from 'path';



const UserRegister = async (req, res) => {
    try {
        const { names, lastnames, birthdate, email, password } = req.body;
        console.log(req.body);
        
        if (!names || !lastnames || !birthdate || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

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
            req.session.user = user; 
            req.session.isLoggedIn = true;
            console.log('Usuario autenticado:', req.session.user);
            return res.status(200).json({ message: 'Login successful', user });
        }
        
    }
    catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const checkAuth = (req, res) => {
    if (req.session && req.session.isLoggedIn) {
      res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
      res.status(401).json({ loggedIn: false });
    }
    };


const logout = (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: 'Error cerrando sesión' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Sesión cerrada' });
    });
  };


/*const authUrl = (req, res) => {
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
}*/


const auth1 = new google.auth.GoogleAuth({
    keyFile: 'C:\\Users\\123\\Documents\\TucanalUdem\\Backend\\credentials-service-account.json',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

//inicializar gooogle calnedar 
//const calendar = google.calendar({ version: 'v3', auth: auth });
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
        'timeZone': 'America/Bogota',
      },
      'end': {
        'dateTime': endDateTime.toISOString(),
        'timeZone': 'America/Bogota',
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
        const authClient = await auth1.getClient();
        const calendar = google.calendar({ version: 'v3', auth: authClient });
        const response = await calendar.events.insert({
            auth: authClient,
            calendarId: 'udemedellin.soy@gmail.com',
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
    createEvent,
    logout
    //googleRedirect: authUrl
    //authUrl,
    //googleRedirect,
}