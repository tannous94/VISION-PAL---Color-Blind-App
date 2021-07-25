const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendNotification = functions.region('europe-west3').firestore.document('notifications/{userName}').onWrite(async (event) => {
	const uid = event.after.get('userId');
	const title = event.after.get('title');
	const content = event.after.get('content');
	const imgFile = event.after.get('imageFile');
	const myUserName = event.after.get('myUName');
	var next_activity;
	if (title == "Friend Request") {
		next_activity = "OPEN_FRIEND_REQUESTS"
	} else if (title == "New Comment") {
		next_activity = "OPEN_IMAGE_VIEW"
	}
	let userDoc = await admin.firestore().doc(`tokens/${uid}`).get();
	let userToken = userDoc.get('userToken');
	
	var message = {
		token: userToken,
		data: {
			title: title,
			body: content,
			username: uid,
			fileName: imgFile,
			userNameProfile: myUserName
		}
	}
	
	let response = await admin.messaging().send(message);
	console.log(response);
});
