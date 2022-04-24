import { Component, OnInit, TemplateRef } from '@angular/core';
import { format } from 'date-fns';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  contacts$: Observable<Contact[]>;
  date: string;
  modalRef: BsModalRef;

  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;

  constructor(
    private contactService: ContactService,
    private modalService: BsModalService,
    ) { }

  ngOnInit(): void {
    this.contacts$ = this.contactService.init();
  }

  datePickerChange(value: string): void {
    const formattedDate = format(value ? new Date(value) : new Date(), 'yyyy-MM-dd');
    this.contacts$ = this.contactService.getBySpecificDate(formattedDate);
  }

  getStatus(contact: Contact, collection: Contact[]): string {
    return contact.positive 
      ? 'Positive' : collection.filter((e) => e.positive).length 
      ? 'Suspect' : 'Negative';
  }

  setStatus(contact: Contact, collection: Contact[]): void {
    const status = this.getStatus(contact, collection);
    this.contactService.setPositive(contact.id, status === 'Positive' ? false : true).subscribe(() => {
      this.datePickerChange(this.date ?? null);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
 }

 saveContact(): void {
   const contact: Contact = {
     first_name: this.firstName,
     last_name: this.lastName,
     email: this.email,
     contact_number: this.contactNumber,
     address: this.address,
     positive: false,
     id: 0
   };

   this.contactService.createContact(contact).subscribe(() => {
     this.datePickerChange(this.date ?? null);
     this.modalRef.hide();
     this.resetValues();
   })
 }

 resetValues(): void {
  this.firstName = '';
  this.address = '';
  this.lastName = '';
  this.email = '';
  this.contactNumber = '';
 }

}
