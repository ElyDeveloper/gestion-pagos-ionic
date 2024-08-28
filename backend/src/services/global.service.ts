import {BindingScope, injectable} from '@loopback/core';
import {parseString, Builder, OptionsV2, ParserOptions} from 'xml2js';

@injectable({scope: BindingScope.TRANSIENT})
export class GlobalService {
  constructor() {}

  jsonToXml(json: object): string {
    const builderOptions: OptionsV2 = {
      xmldec: {version: '1.0', encoding: 'UTF-8'},
      renderOpts: {pretty: false, indent: '', newline: ''},
      headless: true, // Esto omitirá la declaración XML
      cdata: false,
    };
    const builder = new Builder(builderOptions);
    let xml = builder.buildObject(json);

    // Limpieza adicional si es necesaria
    xml = xml
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '')
      .replace(/\\r/g, '')
      .replace(/\\t/g, '');

    return xml;
  }

  xmlToJson(xml: string): Promise<object> {
    const parseOptions: ParserOptions = {
      explicitArray: false,
      ignoreAttrs: true,
      trim: true,
      explicitRoot: false,
      valueProcessors: [
        value => {
          if (!isNaN(Number(value))) {
            return Number(value);
          }
          return value;
        },
      ],
    };

    return new Promise((resolve, reject) => {
      parseString(xml, parseOptions, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
