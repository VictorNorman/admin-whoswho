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

export interface FirestoreOrgRecord {
  adminSecret: string;
  organization: string;
  secret: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private people: FirestorePeopleRecord[] = [];
  public peopleSubj = new BehaviorSubject<FirestorePeopleRecord[]>(null);
  public org = '';

  constructor(
    private db: AngularFirestore,
  ) {
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

  checkOrgAndPassword(org: string, passwd: string): Promise<string> {
    return new Promise(async (resolve) => {
      const res = await this.db.collection<FirestoreOrgRecord>('organization',
        ref => ref.where('organization', '==', org)).get().toPromise();
      if (res.empty) {
        return resolve('Bad organization name');
      }
      // Should be only 1 doc.
      res.forEach((doc) => {
        if (doc.data().adminSecret === passwd) {
          this.org = org;
          this.db.collection<FirestorePeopleRecord>('people',
            ref => ref.where('belongsTo', '==', this.org)).valueChanges({ idField: 'id' }).subscribe(
              people => {
                this.people = people;
                // console.log(JSON.stringify(people, null, 2));
                this.peopleSubj.next(this.people);
              }
            );

          return resolve('Success');
        }
      });
      return resolve('Bad admin password');
    });
  }
}
