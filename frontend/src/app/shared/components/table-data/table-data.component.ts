import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss'],
})
export class TableDataComponent  implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10; // Esto debería ser dinámico basado en tus datos
  @Input() visiblePages: number[] = [];
  @Input() searchTerm: string = '';


  constructor() { }

  ngOnInit() {
    this.updateVisiblePages();
  }

  onSearchChange(event: any) {
    console.log('Búsqueda:', this.searchTerm);
    // Aquí puedes implementar la lógica de búsqueda
    // Por ejemplo, filtrar los datos y actualizar la tabla
  }

  updateVisiblePages() {
    this.visiblePages = [];
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisiblePages();
      // Aquí deberías cargar los datos correspondientes a la página seleccionada
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }
}
