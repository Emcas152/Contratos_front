import { Component } from '@angular/core';

@Component({
  selector: 'app-contract-template',
  templateUrl: './contract-template.component.html',
  styleUrls: ['./contract-template.component.css']
})
export class ContractTemplateComponent {
  nombre = '';
  direccion = '';

  // Cambia esta URL si tu PHP está en otra ruta/host
  plantillaBase = 'http://localhost/PlantillaAgua.php';

  abrirPlantilla() {
    const url = this.buildUrl();
    window.open(url, '_blank');
  }

  descargarPlantillaHtml() {
    const url = this.buildUrl();
    fetch(url)
      .then(r => r.text())
      .then(html => {
        const blob = new Blob([html], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'PlantillaAgua.html';
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(err => alert('No se pudo descargar la plantilla: ' + err));
  }

  private buildUrl(): string {
    const params = new URLSearchParams();
    if (this.nombre) params.set('nombre', this.nombre);
    if (this.direccion) params.set('direccion', this.direccion);
    return `${this.plantillaBase}?${params.toString()}`;
  }
}
