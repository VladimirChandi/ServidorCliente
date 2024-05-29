const express = require('express');
const fs = require('fs');
const router = express.Router();

const dbPath = './db.json';

// Leer base de datos
const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Escribir en la base de datos
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Variable para almacenar el resultado de la carrera
let resultadoCarrera = null;

// Variable para el próximo ID disponible
let nextId = 1;

// Inicializar el próximo ID disponible desde la base de datos
const initializeNextId = () => {
  const data = readDb();
  if (data.corredores.length > 0) {
    nextId = Math.max(...data.corredores.map(c => c.id)) + 1;
  }
};

// Inicializar el ID al arrancar el servidor
initializeNextId();

// GET: Obtener todos los corredores
router.get('/', (req, res) => {
  const data = readDb();
  res.json(data.corredores);
});

// POST: Añadir un nuevo corredor
router.post('/', (req, res) => {
  const data = readDb();
  const newCorredor = req.body;
  newCorredor.id = nextId++;  
  data.corredores.push(newCorredor);
  writeDb(data);
  res.status(201).json(newCorredor);
});

// PUT: Actualizar un corredor
router.put('/:id', (req, res) => {
  const data = readDb();
  const id = parseInt(req.params.id, 10);
  const index = data.corredores.findIndex(c => c.id === id);
  if (index !== -1) {
    data.corredores[index] = req.body;
    data.corredores[index].id = id;  
    writeDb(data);
    res.json(data.corredores[index]);
  } else {
    res.status(404).json({ message: 'Corredor no encontrado' });
  }
});

// DELETE: Eliminar un corredor
router.delete('/:id', (req, res) => {
  const data = readDb();
  const id = parseInt(req.params.id, 10);
  const index = data.corredores.findIndex(c => c.id === id);
  if (index !== -1) {
    const deleted = data.corredores.splice(index, 1);
    writeDb(data);
    res.json(deleted);
  } else {
    res.status(404).json({ message: 'Corredor no encontrado' });
  }
});

// POST: Simular la carrera
router.post('/simular', (req, res) => {
  const data = readDb();
  const corredores = data.corredores;
  const distancia = req.body.distancia;
  const resultados = [];

  corredores.forEach((corredor, index) => {
    const velocidad = corredor.velocidad; // Asegúrate de que cada corredor tiene una propiedad 'velocidad'
    let tiempo = 0;
    let distanciaRecorrida = 0;
    let pausas = 0; // Contador de pausas

    while (distanciaRecorrida < distancia) {
      tiempo++;
      distanciaRecorrida = velocidad * tiempo;

      // Simular una pausa
      if (Math.random() < 0.1) { // Probabilidad de 10% de pausa
        pausas++;
        // Agregar una pausa de 1 a 5 minutos
        const duracionPausa = Math.floor(Math.random() * 5) + 1; // Entre 1 y 5 minutos
        tiempo += duracionPausa;
      }

      resultados.push({ corredor: corredor.id, tiempo, distanciaRecorrida, pausas });
    }
  });

  // Determinar el ganador
  const ganador = resultados
    .filter(r => r.distanciaRecorrida >= distancia)
    .sort((a, b) => a.tiempo - b.tiempo)[0];

  resultadoCarrera = { resultados, ganador };
  res.json(resultadoCarrera);
});

// GET: Obtener el resultado de la carrera y el ganador
router.get('/ganador', (req, res) => {
  if (resultadoCarrera) {
    res.json(resultadoCarrera);
  } else {
    res.status(404).json({ message: 'No se ha simulado ninguna carrera aún' });
  }
});

module.exports = router;

