import {inject, lifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
require('dotenv').config();

const config = {
  name: 'GestionEDBO',
  connector: 'mssql',
  url: process.env.URL_DB,
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWD_DB,
  database: process.env.DB_DB,
  requestTimeout: 300000,
  options: {
    enableArithAbort: true,
  },
};

@lifeCycleObserver('datasource')
export class GestionEdboDataSource extends juggler.DataSource {
  static dataSourceName = 'GestionEDBO';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.GestionEDBO', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}