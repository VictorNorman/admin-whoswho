import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/app';


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
    const { id, ...personWithoutId } = person;
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
      const doc = await this.db.collection<FirestoreOrgRecord>('organization').doc(org).get().toPromise();
      if (!doc.data()) {
        return resolve('Bad organization name');
      }
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
      } else {
        return resolve('Bad admin password');
      }
    });
  }

  getRandomPeople(num: number): FirestorePeopleRecord[] {
    // https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
    return this.people
      .map(x => ({ x, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(a => a.x)
      .slice(0, num);
  }

  saveDailyQuizSelections(dailyQuizPeople: FirestorePeopleRecord[]) {
    const people = dailyQuizPeople.map(dqp => {
      return {
        doc: dqp.id
      }
    });
    // https://stackoverflow.com/questions/49942109/how-to-access-firestore-timestamp-from-firebase-cloud-function
    this.db.collection(`organization/${this.org}/dailies`).add({
      timestamp: firebase.firestore.Timestamp.now(),
      people
    });
  }
}

// function x() {
//   get each organization;
//   foreach organization org {
//     get people list;
//     randPeople = getRandomPeople(10);
//     saveDailyQuizSelections(randPeople)
//   }

