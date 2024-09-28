const Service = require('node-windows').Service;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuración del servicio
const svc = new Service({
    name: 'BackendLAPService',
    description: 'Servicio de Backend para Sistema de Prestamos',
  script: '../backend/dist/index.js'
});

// Función para instalar el servicio
function instalarServicio() {
  svc.on('install', function() {
    //console.log('Servicio instalado correctamente.');
    svc.start();
    mostrarMenu();
  });
  svc.install();
}

// Función para desinstalar el servicio
function desinstalarServicio() {
  svc.on('uninstall', function() {
    //console.log('Servicio desinstalado correctamente.');
    mostrarMenu();
  });
  svc.uninstall();
}

// Función para verificar el estado del servicio
function verificarEstado() {
  svc.on('status', function(status) {
    //console.log('Estado del servicio:', status ? 'Ejecutándose' : 'Detenido');
    mostrarMenu();
  });
  svc.getStatus();
}

// Función para mostrar el menú
function mostrarMenu() {
  //console.log('\nOpciones disponibles:');
  //console.log('1. Instalar servicio');
  //console.log('2. Desinstalar servicio');
  //console.log('3. Verificar estado del servicio');
  //console.log('4. Salir');
  
  rl.question('Seleccione una opción (1-4): ', manejarSeleccion);
}

// Función para manejar la selección del usuario
function manejarSeleccion(seleccion) {
  switch(seleccion) {
    case '1':
      instalarServicio();
      break;
    case '2':
      desinstalarServicio();
      break;
    case '3':
      verificarEstado();
      break;
    case '4':
      //console.log('Saliendo del programa.');
      rl.close();
      break;
    default:
      //console.log('Opción no válida. Por favor, intente de nuevo.');
      mostrarMenu();
  }
}

// Iniciar el programa
mostrarMenu();

// Manejar el cierre del programa
rl.on('close', () => {
  process.exit(0);
});