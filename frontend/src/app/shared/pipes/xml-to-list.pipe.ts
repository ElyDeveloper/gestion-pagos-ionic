import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xmlToList'
})
export class XmlToListPipe implements PipeTransform {
  transform(xmlString: string): string[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const root = xmlDoc.documentElement;
    const result: string[] = [];

    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i];
      const tagName = this.formatTagName(child.tagName);
      const value = child.textContent;
      result.push(`${tagName}: ${value}`);
    }

    return result;
  }

  private formatTagName(tagName: string): string {
    // Convierte camelCase a palabras separadas y capitaliza la primera letra
    return tagName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}