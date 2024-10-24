import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication/dist';
import {BootMixin} from '@loopback/boot/dist';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy/dist';
import multer from 'multer';
import path from 'path';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from './core/library/keys';
import {AdministradorStrategy} from './estrategies/admin.strategy';
import {OwnerStrategy} from './estrategies/owner.strategy';
import {ViewerStrategy} from './estrategies/viewer.strategy';
import {MySequence} from './sequence';
import {MailService} from './services/mail.service';
import { JWTAuthenticationComponent } from '@loopback/authentication-jwt';
import { MyAuthStrategyProvider } from './estrategies/jwt.strategy';
import { SecurityBindings } from '@loopback/security';
import { CurrentUserProvider } from './providers/current-user.provider';
export {ApplicationConfig};

export class gestionPagos extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Configurar Multer para manejar multipart/form-data
    const multerOptions = {
      storage: multer.memoryStorage(),
    };
    this.bind('middleware.multer').to(multer(multerOptions));

    this.bind('services.MailService').toClass(MailService);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      openapi: "3.0.0",
      info: {
        title: "API PROJECTS",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          jwt: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          jwt: [],
        },
      ],
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    registerAuthenticationStrategy(this, AdministradorStrategy);
    registerAuthenticationStrategy(this, OwnerStrategy);
    registerAuthenticationStrategy(this, ViewerStrategy);

    
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    registerAuthenticationStrategy(this, MyAuthStrategyProvider);

    this.bind(SecurityBindings.USER).toProvider(CurrentUserProvider);
    this.configureFileUpload(options.fileStorageDirectory);

  }

  protected configureFileUpload(destination?: string) {
    destination = destination ?? path.join(__dirname, '../.sandbox');
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
