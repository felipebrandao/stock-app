import { Component } from '@angular/core';

interface NFCeRecord {
  id: string;
  store: string;
  date: string;
  items: number;
  total: string;
}

@Component({
  selector: 'app-nfce-history',
  templateUrl: './nfce-history.component.html',
  styleUrls: ['./nfce-history.component.scss']
})
export class NfceHistoryComponent {
  nfceList: NFCeRecord[] = [
    { id: '001', store: 'Supermercado Dia', date: '15 Jan 2024', items: 12, total: 'R$ 145,90' },
    { id: '002', store: 'Extra Hipermercado', date: '12 Jan 2024', items: 25, total: 'R$ 352,40' },
    { id: '003', store: 'Carrefour Express', date: '08 Jan 2024', items: 8, total: 'R$ 98,50' },
    { id: '004', store: 'Pão de Açúcar', date: '05 Jan 2024', items: 18, total: 'R$ 234,80' },
    { id: '005', store: 'Atacadão', date: '02 Jan 2024', items: 32, total: 'R$ 478,90' }
  ];
}
