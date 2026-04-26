import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from '../../models/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-group-card',
  standalone: false,
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent {

  @Input() group!: Group;
  @Output() openExpense = new EventEmitter<void>();
  
  openSheet = false;
  balance: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBalance();
    this.loadExpenses();   // 👈 IMPORTANT
  }

  loadBalance() {
    this.api.getBalance(this.group.id).subscribe((res: any) => {
      this.balance = Number(res.A || 0);  // 👈 FIX
    });
  }

  loadExpenses() {
    this.api.getExpenses(this.group.id).subscribe((res) => {
      this.group.expenses = res;
    });
  }

  refresh() {
    this.loadBalance();
    this.loadExpenses();   // 👈 refresh both
  }

  getAbs(value: number) {
    return Math.abs(value);
  }

  toggle() {
    this.group.expanded = !this.group.expanded;
  }
}