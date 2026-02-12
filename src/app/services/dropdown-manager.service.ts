import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownManagerService {
  private closeDropdownSubject = new Subject<string>();
  public closeDropdown$ = this.closeDropdownSubject.asObservable();

  private currentOpenDropdownId: string | null = null;

  openDropdown(dropdownId: string) {
    if (this.currentOpenDropdownId && this.currentOpenDropdownId !== dropdownId) {
      this.closeDropdownSubject.next(this.currentOpenDropdownId);
    }
    this.currentOpenDropdownId = dropdownId;
  }

  closeDropdown(dropdownId: string) {
    if (this.currentOpenDropdownId === dropdownId) {
      this.currentOpenDropdownId = null;
    }
  }

  closeAll() {
    if (this.currentOpenDropdownId) {
      this.closeDropdownSubject.next(this.currentOpenDropdownId);
      this.currentOpenDropdownId = null;
    }
  }
}

