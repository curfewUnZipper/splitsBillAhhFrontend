import { Component, OnInit } from '@angular/core';
import { Group } from '../../models/models';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
    private api: ApiService
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUser();   // 👈 FIRST
    this.loadGroups();
  }

  // ================= USER =================

  loadUser() {
    this.api.getMe().subscribe((res: any) => {
      this.userEmail = res.email;

      // 👇 only B gets messages
      if (this.userEmail === 'b@mail.com') {
        this.loadMessage();
      }
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
        from: g.startDate,
        to: g.endDate,
        expenses: g.expenses || [],
        settlements: g.settlements || [],
        expanded: false
      }));
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
}