import { UserModel } from "../model/user.model.js";
import { OAuth2Client } from "../config.js";
import { google } from "googleapis";
import moment from "moment-timezone";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport/index.js";
import path from 'path';


const UserRegister = async (req, res) => {
    try {
        const { names, lastnames,id_type, id, birthdate, email, password } = req.body;
        console.log(req.body);
        
        if (!names || !lastnames || !birthdate || !email || !password || !id_type || !id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newUser = await UserModel.createUser({ names, lastnames, id_type, id, birthdate, email, password });
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
        const { id_type,id, password } = req.body;
        console.log(req.body);

        if (!id_type || !password || !id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await UserModel.searchUser(id_type,id,password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.password !== password && user.id !== id && user.id_type !== id_type) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        else{
        req.session.user = user; 
        req.session.isLoggedIn = true;req.session.save(err => {
          if (err) {
            console.error('Error al guardar la sesión:', err);
            return res.status(500).json({ message: 'Error interno al guardar la sesión' });
          }
          return res.status(200).json({ message: 'Login successful', user });
        });
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


const auth1 = new google.auth.GoogleAuth({
    keyFile: 'C:\\Users\\123\\Documents\\TucanalUdem\\Backend\\credentials-service-account.json',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });


  const getAllEvents= async (req, res) => {
    try {
    const { start, end } = req.body;
    const authClient = await auth1.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });
    const calendarId= 'udemedellin.soy@gmail.com';
  
    const response = await calendar.events.list({
      calendarId,
      timeMin: start, 
      timeMax: end,
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
  
    const events = response.data.items;
  
    if (events.length) { 
      events.forEach(event => {
        console.log(event.summary);
      });
   
      return res.status(200).json(events);
  
    } else {
      return res.status(200).json({ message: 'No se encontraron eventos.' });
    }}
   catch (err) {
    console.error('Error al obtener la lista de eventos:', err);
    return res.status(500).json({ error: 'Error al obtener los eventos' });
  }
  };

//inicializar gooogle calnedar 
//const calendar = google.calendar({ version: 'v3', auth: auth });
// Crear evento en Google Calendar
const createEvent = async (req, res) => {
    
    const {name, description, date, time } = req.body;
    console.log(req.body);

    const startDateTime = moment(`${date}T${time}`);
    const endDateTime = startDateTime.clone().add(25, 'minutes');
    const now = moment();
    const dayOfWeek = startDateTime.day(); // 0 = domingo, 6 = sábado
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({ error: 'No se pueden crear eventos los fines de semana.' });
    }
    
    if (startDateTime.isBefore(now)) {
        return res.status(400).json({ error: 'La fecha y hora de inicio no pueden ser en el pasado.' });
    }
    if (!name || !description || !date || !time) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const event = {
      'summary': name,
      'location': 'Medellin, Colombia',
      'description': description + 'https://meet.google.com/rfz-igiw-cbd',
      'start': {
        'dateTime': startDateTime.toISOString(),
        'timeZone': 'America/Bogota',
      },
      'end': {
        'dateTime': endDateTime.toISOString(),
        'timeZone': 'America/Bogota',
      },
      'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],  
      }};
      
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
        console.log(event)
        
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Error creating event' });
    }
};


export const UserController = {
    UserRegister,
    login,
    createEvent,
    logout,
    checkAuth,
    getAllEvents,
    //googleRedirect: authUrl
    //authUrl,
    //googleRedirect,
}