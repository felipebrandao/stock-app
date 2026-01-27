import { Component, OnInit } from '@angular/core';
import { LocationsService } from '../../services/locations.service';
import { LocationResponse } from '../../models/stock.models';

@Component({
  selector: 'app-storage-locations',
  templateUrl: './storage-locations.component.html',
  styleUrls: ['./storage-locations.component.scss']
})
export class StorageLocationsComponent implements OnInit {
  newLocationName = '';
  locations: LocationResponse[] = [];
  isLoading = false;

  constructor(private locationsService: LocationsService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoading = true;
    this.locationsService.getLocations(0, 100).subscribe({
      next: (response) => {
        this.locations = response.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar locais:', error);
        this.isLoading = false;
      }
    });
  }

  addLocation(): void {
    if (this.newLocationName.trim()) {
      this.isLoading = true;
      this.locationsService.createLocation({ name: this.newLocationName.trim() }).subscribe({
        next: (newLocation) => {
          this.locations.push(newLocation);
          this.newLocationName = '';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao criar local:', error);
          this.isLoading = false;
        }
      });
    }
  }

  deleteLocation(locationId: string): void {
    if (confirm('Tem certeza que deseja excluir este local?')) {
      this.isLoading = true;
      this.locationsService.deleteLocation(locationId).subscribe({
        next: () => {
          this.locations = this.locations.filter(loc => loc.id !== locationId);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao excluir local:', error);
          alert('Erro ao excluir local. Pode haver itens de estoque vinculados a este local.');
          this.isLoading = false;
        }
      });
    }
  }
}
