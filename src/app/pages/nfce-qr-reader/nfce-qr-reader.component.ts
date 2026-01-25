import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { NfceService } from '../../services/nfce.service';
import { NFCeQRCodeData, ScanStatus, ImportNfceRequest } from '../../models/nfce.models';

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
  nfceImportId?: string; // ID da importação retornado pela API
  errorMessage = '';
  successMessage = '';

  showScanner = true;
  isProcessing = false;

  // Controle de abas
  activeTab: 'scanner' | 'manual' = 'scanner';

  // Campos de entrada manual
  manualUrl = '';
  manualAccessKey = '';

  constructor(
    private nfceService: NfceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.scanStatus = ScanStatus.SCANNING;
    this.requestCameraAccess();
  }

  async requestCameraAccess(): Promise<void> {
    try {
      this.hasPermission = undefined;
      this.errorMessage = '';
      this.scanStatus = ScanStatus.SCANNING;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Preferir câmera traseira
        }
      });

      stream.getTracks().forEach(track => track.stop());
      this.hasPermission = true;

    } catch (error: any) {
      console.error('Error requesting camera access:', error);
      this.hasPermission = false;
      this.errorMessage = 'Permissão para acessar a câmera foi negada. Por favor, habilite nas configurações do navegador.';
      this.scanStatus = ScanStatus.ERROR;
    }
  }

  ngOnDestroy(): void {
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);

    const backCamera = devices.find(device =>
      device.label.toLowerCase().includes('back') ||
      device.label.toLowerCase().includes('traseira') ||
      device.label.toLowerCase().includes('rear')
    );

    this.currentDevice = backCamera || devices[0];
  }

  onCamerasNotFound(): void {
    this.hasDevices = false;
    this.errorMessage = 'Nenhuma câmera encontrada no dispositivo.';
    this.scanStatus = ScanStatus.ERROR;
  }

  onHasPermission(has: boolean): void {
    this.hasPermission = has;
    if (!has) {
      this.errorMessage = 'Permissão para acessar a câmera foi negada. Por favor, habilite nas configurações do navegador.';
      this.scanStatus = ScanStatus.ERROR;
    }
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$ = isCompatible;
  }

  onScanSuccess(resultString: string): void {
    if (this.isProcessing || this.scanStatus === ScanStatus.SUCCESS) {
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

    // Usar API real
    const request: ImportNfceRequest = {
      qrCodeUrl: qrCodeData.url || undefined,
      accessKey: qrCodeData.chaveAcesso
    };

    this.nfceService.importNfce(request).subscribe({
      next: (response) => {
        this.nfceImportId = response.id;
        this.scanStatus = ScanStatus.SUCCESS;
        this.successMessage = 'Leitura realizada com sucesso! As informações foram capturadas e enviadas para o sistema. Você será notificado assim que a importação for concluída.';
        this.isProcessing = false;

        // Redirecionar para a página de estoque após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/stock']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error importing NFC-e:', error);
        const errorMsg = error.error?.message || error.message || 'Erro ao buscar dados da nota fiscal.';
        this.onScanError(errorMsg + ' Tente novamente.');
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
    this.nfceImportId = undefined;
    this.isProcessing = false;
  }

  switchTab(tab: 'scanner' | 'manual'): void {
    this.activeTab = tab;

    if (tab === 'manual') {
      this.showScanner = false;
    } else {
      // Quando voltar para scanner, sempre exibir o scanner
      if (this.scanStatus === ScanStatus.SUCCESS || this.scanStatus === ScanStatus.ERROR) {
        this.resetScanner();
      } else {
        this.showScanner = true;
      }
    }
  }

  processManualEntry(): void {
    console.log('processManualEntry called');
    console.log('manualUrl:', this.manualUrl);
    console.log('manualAccessKey:', this.manualAccessKey);

    this.errorMessage = '';
    this.successMessage = '';

    let qrCodeData: NFCeQRCodeData | null = null;

    // Tentar processar URL primeiro
    if (this.manualUrl.trim()) {
      console.log('Trying to parse URL');
      qrCodeData = this.nfceService.parseQRCode(this.manualUrl.trim());
      console.log('Parsed QR Code from URL:', qrCodeData);
    }
    // Se não houver URL, tentar processar chave de acesso
    else if (this.manualAccessKey.trim()) {
      const cleanKey = this.manualAccessKey.replace(/\s/g, '');
      console.log('Clean key:', cleanKey, 'Length:', cleanKey.length);
      if (cleanKey.length === 44 && /^\d+$/.test(cleanKey)) {
        qrCodeData = {
          chaveAcesso: cleanKey,
          url: ''
        };
        console.log('Created QR Code from access key:', qrCodeData);
      }
    }

    if (!qrCodeData) {
      console.log('No valid QR code data');
      this.errorMessage = 'Por favor, insira uma URL válida ou uma chave de acesso de 44 dígitos.';
      this.scanStatus = ScanStatus.ERROR;
      return;
    }

    console.log('Starting API call with:', qrCodeData);
    this.isProcessing = true;
    this.scanStatus = ScanStatus.PROCESSING;
    this.scannedData = qrCodeData;
    this.successMessage = 'Processando dados da NFC-e...';

    // Usar API real
    const request: ImportNfceRequest = {
      qrCodeUrl: qrCodeData.url || undefined,
      accessKey: qrCodeData.chaveAcesso
    };

    console.log('API Request:', request);
    this.nfceService.importNfce(request).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.nfceImportId = response.id;
        this.scanStatus = ScanStatus.SUCCESS;
        this.successMessage = 'Leitura realizada com sucesso! As informações foram capturadas e enviadas para o sistema. Você será notificado assim que a importação for concluída.';
        this.isProcessing = false;
        this.manualUrl = '';
        this.manualAccessKey = '';

        // Redirecionar para a página de estoque após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/stock']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error importing NFC-e:', error);
        const errorMsg = error.error?.message || error.message || 'Erro ao buscar dados da nota fiscal.';
        this.errorMessage = errorMsg + ' Verifique os dados informados e tente novamente.';
        this.scanStatus = ScanStatus.ERROR;
        this.isProcessing = false;
      }
    });
  }

  formatAccessKey(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 44) {
      value = value.substring(0, 44);
    }

    // Formatar com espaços a cada 4 dígitos
    this.manualAccessKey = value.match(/.{1,4}/g)?.join(' ') || value;
  }


  navigateBack(): void {
    this.router.navigate(['/stock']);
  }
}
