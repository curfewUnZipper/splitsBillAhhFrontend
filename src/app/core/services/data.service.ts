import { Injectable } from '@angular/core';
import { Group } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {

  getBalance(group: Group) {
  let paidA = 0;
  let paidB = 0;

  group.expenses.forEach(e => {
    const amt = Number(e.amount); // 👈 FIX
    if (e.paidBy === 'A') paidA += amt;
    else paidB += amt;
  });

  group.settlements.forEach(s => {
    const amt = Number(s.amount);
    if (s.paidBy === 'A') paidA -= amt;
    else paidB -= amt;
  });

  const total = paidA + paidB;
  const each = total / 2;

  return paidA - each;
}
}