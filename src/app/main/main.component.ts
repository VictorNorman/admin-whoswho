import { Component, OnInit } from '@angular/core';
import { DataService, FirestorePeopleRecord } from '../data.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public people: FirestorePeopleRecord[] = [];
  public org: string;
  public newFormOpen = false;
  public feedback = '';
  public newPerson: FirestorePeopleRecord;

  public editingLine = -1;
  public personBeingEdited: FirestorePeopleRecord;

  constructor(private dataSvc: DataService) {
  }

  ngOnInit(): void {
    this.org = this.dataSvc.getOrg();
    this.initNewPerson();

    this.dataSvc.peopleSubj.subscribe(people => {
      if (people) {
        this.people = people
          .sort(((a, b) => a.firstName.localeCompare(b.firstName)))
          .sort(((a, b) => a.lastName.localeCompare(b.lastName)));
      }
    });
  }

  applyPersonEdit(e) {
    this.personBeingEdited[e.target.name] = e.target.value;
    console.log(this.personBeingEdited);
  }


  openNewForm() {
    this.newFormOpen = true;
  }

  applyNew() {
    this.newFormOpen = false;
    // console.log(this.newPerson);
    this.dataSvc.addPerson(this.newPerson);
    this.feedback = 'New person added';
  }

  cancelNew() {
    this.newFormOpen = false;
    this.initNewPerson();
  }

  inEditingMode() {
    return this.editingLine !== -1;
  }

  editPerson(index: number): void {
    if (this.editingLine === -1) {
      this.editingLine = index;
      this.personBeingEdited = this.people[index];
    } else {
      this.editingLine = -1;
      // save the changes.
      this.dataSvc.updatePerson(this.personBeingEdited);
      this.updateFeedbackString("Changes saved");
    }
  }

  deletePerson(index: number): void {
    this.dataSvc.delPerson(this.people[index]);
    this.updateFeedbackString("Person deleted from the database");
  }

  // https://roytuts.com/how-to-upload-and-display-image-using-angular/
  selectFile(event) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      this.updateFeedbackString('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = e => {
      this.newPerson.imageData = reader.result as string;
    }
  }

  private updateFeedbackString(str: string): void {
    this.feedback = str;
    setTimeout(() => this.feedback = '', 2000);
  }

  private initNewPerson() {
    this.newPerson = {
      belongsTo: this.org,
      firstName: '',
      lastName: '',
      nickName: '',
      imageData: '',
    };
  }


}
