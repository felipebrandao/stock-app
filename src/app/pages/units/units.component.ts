import { Component, OnInit } from '@angular/core';
import { UnitsService } from '../../services/units.service';
import { UnitResponse, CreateUnitRequest } from '../../models/stock.models';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  newUnitName = '';
  newUnitAbbreviation = '';
  units: UnitResponse[] = [];
  isLoading = false;

  constructor(private unitsService: UnitsService) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.isLoading = true;
    this.unitsService.getUnits(0, 100).subscribe({
      next: (response) => {
        this.units = response.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar unidades:', err);
        this.isLoading = false;
      }
    });
  }

  addUnit(): void {
    if (!this.newUnitName.trim() || !this.newUnitAbbreviation.trim()) return;
    this.isLoading = true;
    const req: CreateUnitRequest = {
      name: this.newUnitName.trim(),
      abbreviation: this.newUnitAbbreviation.trim()
    };
    this.unitsService.createUnit(req).subscribe({
      next: (created) => {
        this.units.push(created);
        this.newUnitName = '';
        this.newUnitAbbreviation = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao criar unidade:', err);
        this.isLoading = false;
      }
    });
  }

  deleteUnit(unitId: string): void {
    if (!confirm('Tem certeza que deseja excluir esta unidade?')) return;
    this.isLoading = true;
    this.unitsService.deleteUnit(unitId).subscribe({
      next: () => {
        this.units = this.units.filter(u => u.id !== unitId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao excluir unidade:', err);
        alert('Erro ao excluir unidade. Pode haver produtos vinculados a esta unidade.');
        this.isLoading = false;
      }
    });
  }
}

