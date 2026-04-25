import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Group } from '../../models/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-add-expense',
  standalone: false,
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {

  @Input() group!: Group;
  @Output() close = new EventEmitter<void>();

  amount = 0;
  description = '';
  paidBy: 'A' | 'B' = 'A';

  custom = false;
  splitA = 0;
  splitB = 0;

  lastPaidBy: 'A' | 'B' = 'A';
  showUndo = false;

  constructor(private api: ApiService) {}

  changePayer(newVal: 'A' | 'B') {
    if (this.paidBy !== newVal) {
      this.lastPaidBy = this.paidBy;
      this.paidBy = newVal;

      this.showUndo = true;
      setTimeout(() => this.showUndo = false, 2000);
    }
  }

  undoChange() {
    this.paidBy = this.lastPaidBy;
    this.showUndo = false;
  }

  save() {
    if (!this.amount) return;

    const amt = Number(this.amount);

    this.api.addExpense(this.group.id, {
      amount: amt,
      paidBy: this.paidBy,
      description: this.description
    }).subscribe(() => {

      // ❌ REMOVE local push (we now reload from backend)

      this.close.emit();
    });
  }

  reset() {
    this.amount = 0;
    this.description = '';
    this.custom = false;
    this.splitA = 0;
    this.splitB = 0;
  }
}