import { Component, OnInit } from '@angular/core';
import { Group } from '../../models/models';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isReady = false;
  openGroupSheet = false;
  message = '';
  groups: Group[] = [];

  userEmail = '';   // 👈 single source of truth

  newGroup = {
    name: '',
    from: '',
    to: ''
  };

  constructor(
    private router: Router,
    private api: ApiService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUser();
    this.loadGroups();
  }
  
  // ================= USER =================

  loadUser() {
    this.api.getMe().subscribe((res: any) => {

      this.userEmail = res.email;

      if (this.userEmail === 'b@mail.com') {
        this.loadMessage();
      }

      if (this.userEmail === 'a@mail.com') {
        this.loadMessages();
      }

      this.cd.detectChanges();   // 👈 FIX
    });
  }

  isAdmin() {
    return this.userEmail === 'a@mail.com';
  }

  isUserB() {
    return this.userEmail === 'b@mail.com';
  }

  // ================= GROUPS =================

  loadGroups() {
    this.api.getGroups().subscribe((res: any[]) => {

      this.groups = res.map(g => ({
        id: g.id,
        name: g.name,
        from: this.formatDate(g.startDate),
        to: this.formatDate(g.endDate),
        expenses: [],
        settlements: [],
        expanded: false
      }));

      this.cd.detectChanges();   // 👈 FIX
    });
  }

  createGroup() {
    if (!this.newGroup.name || !this.newGroup.from || !this.newGroup.to) return;

    this.api.createGroup({
      name: this.newGroup.name,
      startDate: this.newGroup.from,
      endDate: this.newGroup.to
    }).subscribe(() => {

      this.loadGroups();

      this.openGroupSheet = false;

      // 👇 reset form
      this.newGroup = {
        name: '',
        from: '',
        to: ''
      };
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // ================= MESSAGE =================

  loadMessage() {
    this.api.getRandomMessage().subscribe((res: any) => {
      this.message = res.message;
      this.cd.detectChanges();
    });
  }

  // ================= MESSAGE PANEL =================

  openMessagePanel = false;
  messages: any[] = [];
  newMessage = '';
  editingId: number | null = null;

  loadMessages() {
    this.api.getMessages().subscribe((res: any[]) => {
      this.messages = res;
    });
  }

  addMessage() {
    if (!this.newMessage) return;

    this.api.addMessage({
      message: this.newMessage,
      active: true
    }).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }

  deleteMessage(id: number) {
    this.api.deleteMessage(id).subscribe(() => {
      this.loadMessages();
    });
  }

  editMessage(m: any) {
    this.newMessage = m.message;
    this.editingId = m.id;
  }

  updateMessage() {
    if (!this.editingId) return;

    this.api.updateMessage(this.editingId, {
      message: this.newMessage,
      active: true
    }).subscribe(() => {
      this.newMessage = '';
      this.editingId = null;
      this.loadMessages();
    });
  }

  closeMessagePanel() {
    this.openMessagePanel = false;
    this.newMessage = '';
    this.editingId = null;
  }
 
  formatDate(dateStr: string | null) {
    if (!dateStr) return '';

    const d = new Date(dateStr);

    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
  }

  
  
}