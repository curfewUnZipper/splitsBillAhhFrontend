import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ================= CONFIG ================= */
// 👉 CHANGE THIS ONE LINE LATER
// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'https://splitsbillahhdocker.onrender.com';

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
      { responseType: 'text' }
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

  getExpenses(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${BASE_URL}/groups/${groupId}/expenses`,
      this.getHeaders()
    );
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

  // ================= MESSAGES =================
  getRandomMessage() {
    return this.http.get<any>(`${BASE_URL}/messages/random`);
  }

  getMessages() {
    return this.http.get<any[]>(`${BASE_URL}/messages`);
  }

  addMessage(data: any) {
    return this.http.post(`${BASE_URL}/messages`, data);
  }

  updateMessage(id: number, data: any) {
    return this.http.put(`${BASE_URL}/messages/${id}`, data);
  }

  deleteMessage(id: number) {
    return this.http.delete(`${BASE_URL}/messages/${id}`);
  }

  // ================= USER =================
  getMe() {
    return this.http.get<any>(`${BASE_URL}/me`, this.getHeaders());
  }
}
