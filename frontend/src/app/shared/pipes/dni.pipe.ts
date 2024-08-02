import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDni'
})
export class FormatDniPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.length !== 13) {
      return value;
    }
    return value.replace(/(\d{4})(\d{4})(\d{5})/, '$1-$2-$3');
  }
}