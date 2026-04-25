import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ================= AUTH =================
  login(data: any): Observable<any> {
    return this.http.post(
      `${BASE_URL}/auth/login`,
      data,
      { responseType: 'text' }   // 👈 IMPORTANT FIX
    );
  }

  // ================= GROUPS =================
  getGroups(): Observable<any> {
    return this.http.get(`${BASE_URL}/groups`, this.getHeaders());
  }

  createGroup(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}/groups`, data, this.getHeaders());
  }

  // ================= EXPENSE =================
  addExpense(groupId: number, data: any): Observable<any> {
    return this.http.post(
      `${BASE_URL}/groups/${groupId}/expenses`,
      data,
      this.getHeaders()
    );
  }
  getRandomMessage() {
    return this.http.get(`${BASE_URL}/messages/random`);
  }
  // ================= BALANCE =================
  getBalance(groupId: number): Observable<any> {
    return this.http.get(
      `${BASE_URL}/groups/${groupId}/balance`,
      this.getHeaders()
    );
  }

  // ================= SETTLEMENT =================
  settle(groupId: number, data: any): Observable<any> {
    return this.http.post(
      `${BASE_URL}/groups/${groupId}/settle`,
      data,
      this.getHeaders()
    );
  }
getExpenses(groupId: number) {
  return this.http.get<any[]>(`http://localhost:8080/groups/${groupId}/expenses`);
}


}