import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  init(): Observable<Contact[]> {
    const dateNow = format(new Date(), 'yyyy-MM-dd');
    return this.http.get<Contact[]>(`http://127.0.0.1:8000/api/contacts?date=${ dateNow }`);
  }

  getBySpecificDate(date: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`http://127.0.0.1:8000/api/contacts?date=${ date }`);
  }

  setPositive(id: number, isPositive: boolean): Observable<Contact> {
    const body = {
      isPositive
    };
    return this.http.put<Contact>(`http://127.0.0.1:8000/api/contacts/${id}`, body);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`http://127.0.0.1:8000/api/contacts`, contact);
  }
}
