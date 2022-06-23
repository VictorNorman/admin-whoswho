import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
admin.initializeApp();
export const createDailyQuiz = functions.pubsub.schedule("every day 02:00")
    .onRun(async () => {
      const db = admin.firestore();
      const people = await db.collection("people")
          .where("belongsTo", "==", "Sherman Street").get();
      const peopleIds: { doc: string }[] = [];
      people.forEach((q) => peopleIds.push({
        doc: q.id,
      }));
      const quizPeople = peopleIds
          .map((x) => ({x, r: Math.random()}))
          .sort((a, b) => a.r - b.r)
          .map((a) => a.x)
          .slice(0, 10);

      db.collection("organization/Sherman Street/dailies").doc().create({
        timestamp: admin.firestore.Timestamp.now(),
        people: quizPeople,
      });
    });
