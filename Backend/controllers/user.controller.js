import { UserModel } from "../model/user.model.js";
import { OAuth2Client } from "../config.js";
import { google } from "googleapis";
import moment from "moment-timezone";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport/index.js";
import path from 'path';

import PDFDocument from 'pdfkit';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      return res.json({ message: 'Sesión cerrada' });
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

//PDF

const generarCertificado = async (req, res) => {
  try {
      console.log('req.session.user',req.session.user);
      if (!req.session.user) {
          return res.status(401).json({ message: 'No autorizado' });
      }

      const { tipo } = req.params;
      const { id_type, id} = req.session.user;

      if (tipo === 'estudios_realizados') {
          const estudios = await UserModel.obtenerEstudiosRealizados(id_type, id);
          if (estudios.length === 0) {
              return res.status(404).json({ 
                  ok: false,
                  message: 'No se encontraron estudios realizados' 
              });
          }
          res.status(200).json({
              ok: true,
              data: estudios,
              tipo: 'estudios_realizados'
          });
      } else if (tipo === 'estudios_en_progreso') {
          const estudios = await UserModel.obtenerEstudiosEnProgreso(id_type, id);
          if (estudios.length === 0) {
              return res.status(404).json({ 
                  ok: false,
                  message: 'No se encontraron estudios en progreso' 
              });
          }
          res.status(200).json({
              ok: true,
              data: estudios,
              tipo: 'estudios_en_progreso'
          });
      } else {
          res.status(400).json({ 
              ok: false,
              message: 'Tipo de certificado inválido' 
          });
      }
  } catch (error) {
      console.error('Error en generarCertificado:', error);
      res.status(500).json({ 
          ok: false,
          message: 'Error interno del servidor' 
      });
  }
};

const generarPDF = async (req, res) => {
  try {
      if (!req.session.user) {
          return res.status(401).json({ message: 'No autorizado' });
      }

      const { tipo } = req.params;
      const { id_type,id,names } = req.session.user;
      
      let estudios, titulo;
      if (tipo === 'estudios_realizados') {
          estudios = await UserModel.obtenerEstudiosRealizados(id_type,id);
          titulo = 'CERTIFICADO DE ESTUDIOS REALIZADOS';
      } else {
          estudios = await UserModel.obtenerEstudiosEnProgreso(id_type,id);
          titulo = 'CERTIFICADO DE ESTUDIOS EN PROGRESO';
      }

      if (estudios.length === 0) {
          return res.status(404).json({ 
              ok: false,
              message: 'No se encontraron registros' 
          });
      }
//cambio
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=certificado_${tipo}_${id}.pdf`);
      
      doc.pipe(res);
//logo
      const logoPath = path.resolve(__dirname, '../../Vistas/imagenes/Logo_UdeMedellín.jpg');
      doc.image(logoPath, {
        fit: [150, 150],
        align: 'center',
        valign: 'top'
    });

      doc.moveDown(2);

      doc.fontSize(20).font('Helvetica-Bold').text('Universidad de Medellín', { align: 'center' });
      doc.fontSize(16).font('Helvetica-Bold').text(titulo, { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Nombre: ${names}`, { align: 'left' });
      doc.text(`Documento: ${id_type.toUpperCase()} ${id}`, { align: 'left' });
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'left' });
      doc.moveDown();
      doc.moveDown();

      estudios.forEach((estudio, index) => {
        if (tipo === 'estudios_realizados') {
            doc.fontSize(14).font('Helvetica-Bold')
               .text(`${estudio.tipo_estudio.toUpperCase()} EN ${estudio.programa.toUpperCase()}`);
            doc.fontSize(12).font('Helvetica')
               .text(`Facultad: ${estudio.facultad}`)
               .text(`Año de graduación: ${estudio.año_graduacion}`)
               .text(`Promedio: ${estudio.promedio || 'No disponible'}`);
            if (estudio.acta_grado) {
                doc.text(`Acta de grado: ${estudio.acta_grado}`);
            }
          } else {
            doc.fontSize(14).font('Helvetica-Bold')
            .text(`PROGRAMA: ${estudio.programa.toUpperCase()}`);
         doc.fontSize(12).font('Helvetica')
            .text(`Facultad: ${estudio.facultad}`)
            .text(`Semestre actual: ${estudio.semestre_actual}`)
            .text(`Promedio: ${estudio.promedio || 'No disponible'}`)
            .text(`Créditos aprobados: ${estudio.creditos_aprobados} de ${estudio.creditos_total}`);
         if (estudio.fecha_inicio && estudio.fecha_estimada_fin) {
             doc.text(`Periodo: ${estudio.fecha_inicio} a ${estudio.fecha_estimada_fin}`);
         }
          }
          
          if (index < estudios.length - 1) {
            doc.moveDown();
            doc.strokeColor('#cccccc').lineWidth(1)
               .moveTo(50, doc.y)
               .lineTo(550, doc.y)
               .stroke();
            doc.moveDown();
        }
      });

      doc.moveDown(3);
      doc.fontSize(10).font('Helvetica-Oblique').text('Este documento es generado automáticamente y no requiere firma manual.', { align: 'center' });
      doc.text('Universidad de Medellín - Todos los derechos reservados', { align: 'center' });

      doc.end();
  } catch (error) {
      console.error('Error en generarPDF:', error);
      res.status(500).json({ 
          ok: false,
          message: 'Error interno del servidor al generar el PDF' 
      });
  }
};


// Controllers Reserva

const reservarEspacio = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { id_type,id } = req.session.user;
    const { espacio, fecha, hora } = req.body;
    console.log(req.body);
    console.log('id_type',id_type); 
    console.log('id',id);
    if (!espacio || !fecha || !hora) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const reservasRealizadas = await UserModel.reservaExiste(id_type, id, fecha, hora);
    if (reservasRealizadas) {
        console.log("no se puedeeeeeeeeeeeeee :)")
        return res.status(409).json({ message: 'Ya tienes una reserva en esa fecha y hora' });
        
    }

    const reserva = await UserModel.reservarEspacio(id_type, id, espacio, fecha, hora);
    if (reserva) {
        return res.status(200).json({ok: true, message: 'Reserva realizada con éxito'});
    }
    return res.status(500).json({ message: 'Error en la reserva ya tienes una reserva a esa hora'});
}

const allReservas = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { id_type,id } = req.session.user;
    console.log('id_type',id_type); 
    console.log('id',id);

    const reservas = await UserModel.misReservas(id_type, id);
    if (reservas.length === 0) {
        return res.status(404).json({ message: 'No se encontraron reservas' });
    }
    res.status(200).json(reservas);
}
 
const deleteReserva = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { id_type,id } = req.session.user;
    console.log('id_type',id_type); 
    console.log('id',id);
    const { id: reservaId } = req.params; // Este es el ID de la reserva
    console.log('Reserva ID:', reservaId);
    
    const reservaEliminada = await UserModel.deleteReserva(id_type, id , reservaId);
    if (reservaEliminada) {
        return res.status(500).json({ message: 'Error al eliminar la reserva' });
    }
     return res.status(200).json({ message: 'Reserva eliminada con éxito' });
}

const updateReserva = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { id_type,id } = req.session.user;
    console.log('id_type',id_type); 
    console.log('id',id);
    const { id: reservaId } = req.params; // Este es el ID de la reserva
    const { fecha, hora } = req.body;
    console.log('Reserva ID:', hora);
    console.log('Reserva ID:', fecha);

    const reservasRealizadas = await UserModel.reservaExiste(id_type, id, fecha, hora);
    if (reservasRealizadas) {
        console.log("no se puedeeeeeeeeeeeeee :)<3")
        return res.status(409).json({ message: 'Ya tienes una reserva en esa fecha y hora' });
        
    }
    const reservaActualizada = await UserModel.updateReserva(id_type, id , reservaId, fecha, hora);
    if (reservaActualizada) {
        return res.status(200).json({ message: 'Reserva actualizada con éxito' });
    }
    return res.status(500).json({ message: 'Error al actualizar la reserva' });
}

export const UserController = {
    UserRegister,
    login,
    createEvent,
    logout,
    checkAuth,
    getAllEvents,
    generarCertificado,
    generarPDF,
    reservarEspacio,
    allReservas,
    deleteReserva,
    updateReserva
    //googleRedirect: authUrl
    //authUrl,
    //googleRedirect,
}