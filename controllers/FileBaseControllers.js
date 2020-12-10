var firebase = require('firebase');
var admin = require("firebase-admin");

var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test-ce13a.firebaseio.com"
});

exports.sendNotification = function (req, res) {
    var message = {
        notification: {
            title: 'Send Notification',
            body: 'Some one need you help!',
        },
        android: {
            priority: "high",
            notification: {
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                defaultVibrateTimings: true,
            },
        },
        data: {
            roomID: "test",
        },
        token: req.query.token,
        apns: {
            payload: {
                aps: {
                    contentAvailable: true,
                    defaultVibrateTimings: true,
                }
            }
        }
    };
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return res.json('Successfully sent message');
        })
        .catch((error) => {
            console.log(error);
            return res.json('Error sending message');
        });
}

exports.sendNotifications = function (tokens, roomId) {
    for(let i = 0; i < tokens.length; i++){
        var message = {
            notification: {
                title: 'Send Notification',
                body: 'Some one need you help!',
            },
            android: {
                priority: "high",
                notification: {
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    defaultVibrateTimings: true,
                },
            },
            data: {
                roomID: roomId.toString()
            },
            token: tokens[i],
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                        defaultVibrateTimings: true,
                    }
                }
            }
        };
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log(tokens[i] + ' Successfully sent message');
            })
            .catch((error) => {
                console.log(tokens[i] + ' Error sending message');
            });
    }
}