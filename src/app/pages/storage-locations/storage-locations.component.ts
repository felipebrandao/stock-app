import { Component } from '@angular/core';

@Component({
  selector: 'app-storage-locations',
  templateUrl: './storage-locations.component.html',
  styleUrls: ['./storage-locations.component.scss']
})
export class StorageLocationsComponent {
  newLocationName = '';
  locations = [
    'Geladeira',
    'Freezer Vertical',
    'Armário Superior Cozinha',
    'Despensa Principal',
    'Armário Inferior',
    'Garagem'
  ];

  addLocation(): void {
    if (this.newLocationName.trim()) {
      this.locations.push(this.newLocationName.trim());
      this.newLocationName = '';
    }
  }

  deleteLocation(location: string): void {
    const index = this.locations.indexOf(location);
    if (index > -1) {
      this.locations.splice(index, 1);
    }
  }
}
