import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { NfceService } from '../../services/nfce.service';
import { NFCeQRCodeData, NFCeData, ScanStatus } from '../../models/nfce.models';

@Component({
  selector: 'app-nfce-qr-reader',
  templateUrl: './nfce-qr-reader.component.html',
  styleUrls: ['./nfce-qr-reader.component.scss']
})
export class NfceQrReaderComponent implements OnInit, OnDestroy {
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice?: MediaDeviceInfo;
  hasDevices?: boolean;
  hasPermission?: boolean;

  allowedFormats = [BarcodeFormat.QR_CODE];
  torchEnabled = false;
  torchAvailable$ = false;

  scanStatus: ScanStatus = ScanStatus.IDLE;
  ScanStatus = ScanStatus;

  scannedData?: NFCeQRCodeData;
  nfceData?: NFCeData;
  errorMessage = '';
  successMessage = '';

  showScanner = true;
  isProcessing = false;

  constructor(
    private nfceService: NfceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎬 NFC-e QR Reader initialized');
    this.scanStatus = ScanStatus.SCANNING;
    this.requestCameraAccess();
  }

  async requestCameraAccess(): Promise<void> {
    try {
      console.log('📹 Requesting camera access...');
      this.hasPermission = undefined;
      this.errorMessage = '';
      this.scanStatus = ScanStatus.SCANNING;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Preferir câmera traseira
        }
      });

      console.log('✅ Camera permission granted');
      console.log('📸 Video tracks:', stream.getVideoTracks().length);

      stream.getTracks().forEach(track => {
        console.log('🎥 Track:', track.label, '- State:', track.readyState);
        track.stop();
      });

      this.hasPermission = true;
      console.log('✓ hasPermission set to true');

    } catch (error) {
      console.error('❌ Error requesting camera access:', error);
      this.hasPermission = false;
      this.errorMessage = 'Permissão para acessar a câmera foi negada. Por favor, habilite nas configurações do navegador.';
      this.scanStatus = ScanStatus.ERROR;
    }
  }

  ngOnDestroy(): void {
    console.log('🛑 Component destroyed');
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    console.log('📷 onCamerasFound - Cameras:', devices.length);
    devices.forEach((dev, i) => {
      console.log(`  ${i + 1}. ${dev.label || 'Camera ' + (i + 1)} (${dev.deviceId.substr(0, 20)}...)`);
    });

    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);

    const backCamera = devices.find(device =>
      device.label.toLowerCase().includes('back') ||
      device.label.toLowerCase().includes('traseira') ||
      device.label.toLowerCase().includes('rear')
    );
    this.currentDevice = backCamera || devices[0];
    console.log('🎯 Selected camera:', this.currentDevice?.label || 'Unknown');
  }

  onCamerasNotFound(): void {
    console.log('❌ onCamerasNotFound - No cameras detected');
    this.hasDevices = false;
    this.errorMessage = 'Nenhuma câmera encontrada no dispositivo.';
    this.scanStatus = ScanStatus.ERROR;
  }

  onHasPermission(has: boolean): void {
    console.log('🔐 onHasPermission:', has);
    this.hasPermission = has;
    if (!has) {
      this.errorMessage = 'Permissão para acessar a câmera foi negada. Por favor, habilite nas configurações do navegador.';
      this.scanStatus = ScanStatus.ERROR;
    }
  }

  onTorchCompatible(isCompatible: boolean): void {
    console.log('🔦 Torch compatible:', isCompatible);
    this.torchAvailable$ = isCompatible;
  }

  onScanSuccess(resultString: string): void {
    console.log('✅ QR Code scanned:', resultString.substring(0, 50) + '...');

    if (this.isProcessing || this.scanStatus === ScanStatus.SUCCESS) {
      console.log('⏭️ Already processing, skipping...');
      return;
    }

    this.isProcessing = true;
    this.scanStatus = ScanStatus.PROCESSING;
    this.showScanner = false;

    const qrCodeData = this.nfceService.parseQRCode(resultString);

    if (!qrCodeData) {
      this.onScanError('QR Code inválido. Certifique-se de escanear um QR Code de NFC-e.');
      return;
    }

    this.scannedData = qrCodeData;
    this.successMessage = 'QR Code lido com sucesso! Buscando dados da nota fiscal...';

    this.nfceService.fetchNFCeData(qrCodeData.chaveAcesso).subscribe({
      next: (data) => {
        this.nfceData = data;
        this.scanStatus = ScanStatus.SUCCESS;
        this.successMessage = 'Dados da NFC-e carregados com sucesso!';
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error fetching NFC-e data:', error);
        this.onScanError('Erro ao buscar dados da nota fiscal. Tente novamente.');
        this.isProcessing = false;
      }
    });
  }

  onScanError(error: any): void {
    this.errorMessage = typeof error === 'string' ? error : 'Erro ao processar QR Code. Tente novamente.';
    this.scanStatus = ScanStatus.ERROR;
    this.isProcessing = false;

    setTimeout(() => {
      if (this.scanStatus === ScanStatus.ERROR) {
        this.resetScanner();
      }
    }, 3000);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  switchCamera(): void {
    const currentIndex = this.availableDevices.indexOf(this.currentDevice!);
    const nextIndex = (currentIndex + 1) % this.availableDevices.length;
    this.currentDevice = this.availableDevices[nextIndex];
  }

  resetScanner(): void {
    this.scanStatus = ScanStatus.SCANNING;
    this.showScanner = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.scannedData = undefined;
    this.nfceData = undefined;
    this.isProcessing = false;
  }

  importToStock(): void {
    if (!this.nfceData) return;

    this.isProcessing = true;
    this.nfceService.importToStock(this.nfceData).subscribe({
      next: () => {
        this.successMessage = 'Produtos importados para o estoque com sucesso!';
        this.isProcessing = false;

        setTimeout(() => {
          this.resetScanner();
        }, 2000);
      },
      error: (error) => {
        console.error('Error importing to stock:', error);
        this.errorMessage = 'Erro ao importar produtos. Tente novamente.';
        this.isProcessing = false;
      }
    });
  }

  manualCapture(): void {
    console.log('Manual capture triggered');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(date));
  }

  navigateBack(): void {
    this.router.navigate(['/stock']);
  }
}
