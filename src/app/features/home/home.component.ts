import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  message = this.getRandomMessage();

  openGroupSheet = false;

  groups: Group[] = [];

  newGroup = {
    name: '',
    from: '',
    to: ''
  };

  constructor(
    private router: Router,
    private api: ApiService,
    private cd: ChangeDetectorRef   // 👈 ADD THIS
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadGroups();
    this.loadMessage();
  }

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

      this.cd.detectChanges();   // 👈 FORCE UI UPDATE
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

  getRandomMessage() {
    const msgs = [
      "You just made this app 10x prettier ✨",
      "How you doin'? 😉",
      "Back already? I missed you 😏"
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loadMessage() {
  this.api.getRandomMessage().subscribe((res: any) => {
    this.message = res.message;
  });
}

}