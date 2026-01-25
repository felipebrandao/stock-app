import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  currentRoute: string = '';
  showConfigMenu: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Monitora mudanças de rota
    this.currentRoute = this.router.url;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  get isConfigRoute(): boolean {
    return this.currentRoute === '/categories' || this.currentRoute === '/storage-locations';
  }

  toggleConfigMenu(): void {
    this.showConfigMenu = !this.showConfigMenu;
  }

  closeConfigMenu(): void {
    this.showConfigMenu = false;
  }

  toggleTheme(): void {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  // Fecha o menu quando clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.py-1') && this.showConfigMenu) {
      this.showConfigMenu = false;
    }
  }
}
