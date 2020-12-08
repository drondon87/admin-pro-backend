require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config')

//crear servidor express
const app = express();

//Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Directorio Público
app.use(express.static('public'));

//Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/hospitales', require('./routes/hospital.routes'));
app.use('/api/medico', require('./routes/medico.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/todo', require('./routes/busqueda.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})