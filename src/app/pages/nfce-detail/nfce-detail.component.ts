import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface NFCeItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: string;
  total: string;
}

@Component({
  selector: 'app-nfce-detail',
  templateUrl: './nfce-detail.component.html',
  styleUrls: ['./nfce-detail.component.scss']
})
export class NfceDetailComponent implements OnInit {
  nfceId: string = '';
  items: NFCeItem[] = [
    { name: 'Leite Integral 1L', quantity: 2, unit: 'un', unitPrice: '4.50', total: '9.00' },
    { name: 'Pão Francês', quantity: 0.5, unit: 'kg', unitPrice: '12.00', total: '6.00' },
    { name: 'Queijo Mussarela', quantity: 0.3, unit: 'kg', unitPrice: '35.00', total: '10.50' },
    { name: 'Tomate', quantity: 1.2, unit: 'kg', unitPrice: '5.00', total: '6.00' },
    { name: 'Arroz Tipo 1 5kg', quantity: 1, unit: 'un', unitPrice: '22.90', total: '22.90' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.nfceId = this.route.snapshot.params['id'] || '';
  }
}
