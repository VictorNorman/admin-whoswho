import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';


export interface FirestorePeopleRecord {
  id?: string;          // firebase unique id
  belongsTo: string;
  firstName: string;
  lastName: string;
  nickName: string;
  imageData: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private people: FirestorePeopleRecord[] = [];
  public peopleSubj = new BehaviorSubject<FirestorePeopleRecord[]>(null);
  org = 'Sherman Street';
  password = '123';

  constructor(
    private db: AngularFirestore,
  ) {
    this.db.collection<FirestorePeopleRecord>('people',
      ref => ref.where('belongsTo', '==', this.org)).valueChanges({ idField: 'id'}).subscribe(
        people => {
          this.people = people;
          // console.log(JSON.stringify(people, null, 2));
          this.peopleSubj.next(this.people);
        }
      );
  }

  getData(): FirestorePeopleRecord[] {
    return this.people;
  }

  getOrg() {
    return this.org;
  }

  addPerson(person: FirestorePeopleRecord): void {
    const { id, ...personWithoutId } = person
    this.db.collection<FirestorePeopleRecord>('people').add(personWithoutId);
  }

  delPerson(person: FirestorePeopleRecord): void {
    this.db.collection<FirestorePeopleRecord>('people').doc(person.id).delete();
  }

  updatePerson(person: FirestorePeopleRecord): void {
    const { id, ...personWithoutId } = person
    this.db.collection<FirestorePeopleRecord>('people').doc(person.id).set(personWithoutId);
  }
}
