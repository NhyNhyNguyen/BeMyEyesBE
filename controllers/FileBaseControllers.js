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
            title: '$FooCorp up 1.43% on the day',
            body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.',
        },
        android: {
            priority: "high",
            notification: {
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        },
        data: {
            roomID: "test"
        },
        token: req.query.token,
        apns: {
            payload: {
                aps: {
                    contentAvailable: true
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
                title: 'Send notification',
                body: 'Good night!',
            },
            android: {
                priority: "high",
                notification: {
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                },
            },
            data: {
                roomID: roomId.toString()
            },
            token: tokens[i],
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true
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