import {ApplicationConfig, gestionPagos} from './application';
require('dotenv').config();

export * from './application';

export async function main(options: ApplicationConfig = {}) {

  const app = new gestionPagos(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);


  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3001),
      host: process.env.HOST,
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  // let ruta = __dirname + '/../../Certificados/';
  // const config = {
  //   rest: {
  //     protocol: 'https',
  //     port: +(process.env.PORT ?? 3004),
  //     host: process.env.HOST,
  //     key: readFileSync(`${ruta}server.key`),
  //     cert: readFileSync(`${ruta}server.crt`),

  //   },
  // };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
