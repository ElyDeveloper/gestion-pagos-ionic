import {ApplicationConfig, gestionPagos} from './application';
import {CorsOptions} from 'cors';

require('dotenv').config();

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new gestionPagos(options);

  // const corsOptions: CorsOptions = {
  //   origin: ['http://192.168.0.13:8080', 'http://localhost:8080'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   maxAge: 86400,
  //   credentials: true,
  // };

  // app.bind('middleware.cors').to({
  //   enabled: true,
  //   options: corsOptions,
  // });

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
      // cors: {
      //   origin: ['http://192.168.0.13:8080', 'http://localhost:8080'],
      //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      //   preflightContinue: false,
      //   optionsSuccessStatus: 204,
      //   maxAge: 86400,
      //   credentials: true,
      // },
    },
  };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
