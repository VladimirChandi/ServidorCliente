const express = require('express');
const app = express();
const port = 3000;

// Definir el middleware CORS aquí (antes de definir las rutas)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
app.use(express.json());

const corredoresRouter = require('./routes/corredores');
app.use('/corredores', corredoresRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en servidor:${port}`);
});
