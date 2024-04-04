const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.json());
// app.use(express.urlencoded({extended:false}));

const pool = new pg.Pool({
  connectionString: 'postgres://postgres:PepeJhonRivera_2026@localhost:5432/firstapi'
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 
  next();
});
// Rutas CRUD

// GET /inspecciones
app.get('/inspecciones/get', async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM public."InspeccionVehiculos" ORDER BY "IdInspeccionVehiculo" ASC ');
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /inspecciones
app.post('/inspecciones/post', async (req, res) => {
  const {
    fecha,
    nombrec,
    apellidoc,
    edad,
    nombrev,
    placav,
    marcav,
    propietario,
    kilometraje,
    direccionalesd,
    direccionalest,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO public."InspeccionVehiculos" 
      (fecha, nombrec, apellidoc, edad, nombrev, placav, marcav, 
      propietario, kilometraje, direccionalesd, direccionalest) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        fecha,
        nombrec,
        apellidoc,
        edad,
        nombrev,
        placav,
        marcav,
        propietario,
        kilometraje,
        direccionalesd,
        direccionalest,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /inspecciones/:id
app.get('/inspecciones/get/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      'SELECT * FROM public."InspeccionVehiculos" WHERE "IdInspeccionVehiculo" = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspeccion no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /inspecciones/:id
app.put('/inspecciones/put/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    fecha,
    nombrec,
    apellidoc,
    edad,
    nombrev,
    placav,
    marcav,
    propietario,
    kilometraje,
    direccionalesd,
    direccionalest,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "InspeccionVehiculos" 
      SET fecha = $1, nombrec = $2, apellidoc = $3, edad = $4, 
      nombrev = $5, placav = $6, marcav = $7, 
      propietario = $8, kilometraje = $9, 
      direccionalesd = $10, direccionalest = $11 
      WHERE "IdInspeccionVehiculo" = $12 RETURNING *`,
      [
        fecha,
        nombrec,
        apellidoc,
        edad,
        nombrev,
        placav,
        marcav,
        propietario,
        kilometraje,
        direccionalesd,
        direccionalest,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspeccion no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/inspecciones/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      'DELETE FROM "InspeccionVehiculos" WHERE "IdInspeccionVehiculo" = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inspeccion no encontrada' });
    }
    res.json({ message: 'Inspeccion eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(90, () => {
  console.log('Servidor escuchando en el puerto 90');
});