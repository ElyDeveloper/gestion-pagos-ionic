const express = require('express');
const path = require('path');
const app = express();

// Ruta específica a la carpeta 'www' de tu aplicación Ionic compilada
const appPath = 'X:\\Proyectos\\ionic-projects\\gestion-pagos-ionic\\frontend\\www';

// Sirve los archivos estáticos desde la carpeta 'www'
app.use(express.static(appPath));

// Maneja todas las rutas y redirige a index.html
app.get('/*', function(req, res) {
    res.sendFile(path.join(appPath, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor Ionic ejecutándose en el puerto ${port}`);
    console.log(`Sirviendo archivos desde: ${appPath}`);
});