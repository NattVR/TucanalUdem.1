import e from "express";
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

//Consultas a la base de datos para obtener los estudios realizados y en progreso	

const obtenerEstudiosRealizados = async (tipo_documento, numero_documento) => {
    try {
        const query = `
            SELECT * FROM estudios_realizados 
            WHERE tipo_documento = $1 AND numero_documento = $2`;
        const values = [tipo_documento, numero_documento];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo estudios realizados:', error);
        throw error;
    }
};

const obtenerEstudiosEnProgreso = async (tipo_documento, numero_documento) => {
    try {
        const query = `SELECT * FROM estudios_en_progreso 
            WHERE tipo_documento = $1 AND numero_documento = $2`;
        const values = [tipo_documento, numero_documento];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo estudios en progreso:', error);
        throw error;
    }
};

//Reservas
const reservarEspacio = async (id_type, id, espacio, fecha, hora) => {
    try {
        const query = `INSERT INTO reservas (tipo_id, numero_id, espacio, fecha, hora) 
            VALUES ($1, $2, $3, $4, $5)`;
        const values = [id_type, id, espacio, fecha, hora];
        await pool.query(query, values);
        return true;
    } catch (error) {
        console.error('Error reservando espacio:', error);
        throw error;
    }
}

const misReservas = async (tipo_documento, numero_documento) => {
    try {
        const query = `SELECT * FROM reservas 
            WHERE tipo_id = $1 AND numero_id = $2 ORDER BY fecha, hora`;
        const values = [tipo_documento, numero_documento];
        const result = await pool.query(query, values);
        console.log('misReservas',result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo reservas:', error);
        throw error;
    }
}

const deleteReserva = async (tipo_documento, numero_documento, id) => {
    try {
        console.log(id);
        const query = `DELETE FROM reservas 
            WHERE tipo_id = $1 AND numero_id = $2 AND id = $3`;
        const values = [tipo_documento,numero_documento, id];
        await pool.query(query, values);
    } catch (error) {
        console.error('Error eliminando reserva:', error);
        throw error;
    }
}

const updateReserva = async (tipo_documento, numero_documento, id, fecha_reserva, hora_reserva) => {
    try {
        const query = `UPDATE reservas
            SET fecha = $1, hora = $2
            WHERE tipo_id = $3 AND numero_id = $4 AND id = $5`;
        const values = [fecha_reserva, hora_reserva, tipo_documento, numero_documento, id];
        await pool.query(query, values);
        return true;
    }
    catch (error) {
        console.error('Error actualizando reserva:', error);
        throw error;
    }
} 

const reservaExiste = async (tipo_documento, numero_documento,  fecha_reserva, hora_reserva) => {
    try {
        const query = `SELECT * FROM reservas 
            WHERE tipo_id = $1 AND numero_id = $2 AND fecha = $3 AND hora= $4`;
        const values = [tipo_documento, numero_documento, fecha_reserva, hora_reserva];
        const result = await pool.query(query, values);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error verificando reserva:', error);
        throw error;
    }
}

export const UserModel = {
    createUser, searchUser, obtenerEstudiosRealizados, obtenerEstudiosEnProgreso,reservarEspacio, misReservas,reservaExiste, deleteReserva, updateReserva
}