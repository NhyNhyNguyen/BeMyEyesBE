// Sử dụng thư  viện
var request = require('sync-request');

// Đọc thông tin idol trong file filtered-person.json và thông tin person đã lưu từ API
var idols = require('./filtered-person.json');
var idolPerson = require('./person.json');

var falseData = require('./falseData.json');

let key = 'b03443c1421e4e3eb682d10beff7f1a7'; // Thay thế bằng key của bạn
let groupId = 'tesst';

// NodeJS không có thread.sleep nên ra dùng tạm function này

module.exports = {
    sleep: function (time) {
        console.log('Begin Sleep');
        var stop = new Date().getTime();
        while (new Date().getTime() < stop + time) {
            ;
        }
        console.log('End Sleep');
    },

// Phát hiện khuôn mặt trong ảnh (Face Detection)
    detect: function (imageUrl) {
        console.log(`Begin to detect face from image: ${imageUrl}`);
        let url = `https://eastus.api.cognitive.microsoft.com/face/v1.0/detect`;
        var res = request('POST', url, {
            headers: {
                'Ocp-Apim-Subscription-Key': key
            },
            json: {
                url: imageUrl
            }
        });

        if (res.statusCode == 200) {
            var result = JSON.parse(res.getBody('utf8'));
            console.log(`Found ${result.length} faces.`);
            return result;
        }
    },

// Tìm khuôn mặt giống nhất trong Person Group (Face Recognition)
    identify: function (faceIds) {
        console.log(`Begin to identity face.`);
        let url = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/identify';
        var res = request('POST', url, {
            headers: {
                'Ocp-Apim-Subscription-Key': key
            },
            json: {
                "personGroupId": groupId,
                "faceIds": faceIds,
                "maxNumOfCandidatesReturned": 5,
            }
        });

        if (res.statusCode == 200) {
            console.log(`Finish identity face.`);
            return JSON.parse(res.getBody('utf8'));
        } else {
            console.log('Error');
            console.log(res.getBody('utf8'));
        }
    },

// Nhận diện vị trí khuôn mặt và tên idol từ URL ảnh
    recognize: function (imageUrl) {
        console.log(`Begin to recognize image: ${imageUrl}`);
        var detectedFaces = this.detect(imageUrl);

        // if (detectedFaces.length == 0) {
        //     console.log("Can't detect any face");
        //     return;
        // }

        // Sau khi đã phát hiện các khuôn mặt,
        // So sánh chúng với mặt đã có trong person group
        console.log(JSON.stringify(detectedFaces) + "====");
        var identifiedResult = this.identify(detectedFaces.map(face => face.faceId));

        var allIdols = identifiedResult.map(result => {

            // Lấy vị trí khuôn mặt trong ảnh để hiển thị
            result.face = detectedFaces.filter(face => face.faceId == result.faceId)[0].faceRectangle;

            console.log("result" + JSON.stringify(result))
            var length = result.candidates.length;
            if (length > 0) {
                result.idol = {
                    id: idolPerson[0].id,
                    name: idolPerson[0].name
                };
                for (var i = 0; i < length; i++) {
                    var idolId = result.candidates[i].personId;
                    try {
                     //   var idol = idolPerson.filter(person => person.personId == idolId)[0];
                        result.personId = idolId
                        //if(idol != null){
                        console.log("founded")
                        result.person = {
                            id: idolPerson[0].id,
                            name: idolPerson[0].name
                        };
                        return result;
                        // }
                    } catch (e) {

                    }
                }
            } else {
                result.person = {
                    id: 0,
                    name: 'Unknown'
                }
            }
            return result;
        });

        console.log(`Finish recognize image: ${imageUrl}`);
        return allIdols;
    },

// function getPositiveTestData() {
//     var testData = [];
//     for (let idol of idols) {
//         for (let i = 0; i < 4; i++) {
//             let image = idol.images[i].image;
//             testData.push({
//                 id: idol.id,
//                 name: idol.name,
//                 image: image
//             });
//         }
//     }
//     return testData;
// }
//
// function runPositiveTest() {
//     var positiveTestData = getPositiveTestData();
//     let total = 0;
//     let truePositive = 0;
//
//     for (let data of positiveTestData) {
//         try {
//             let result = recognize(data.image);
//             if (result[0].idol.id == data.id) {
//                 truePositive++;
//                 console.log(`HIT: ${data.id} - ${data.name}`);
//             } else {
//                 console.log(`MISS. Data ${data.id} - ${data.name}. Found ${result[0].idol.id} - ${result[0].idol.name}`);
//             }
//             total++;
//             console.log(`True Positive: ${truePositive}. Total ${total}`);
//
//             sleep(7 * 1000); // Sleep 7s vì mỗi lần recognize là 2 calls. Limit 1 phút/ 20 calls
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }
//
// function getNegativeTestData() {
//     var testData = [];
//     for (let idol of falseData) {
//         for (let i = 0; i < 10; i++) {
//             let image = idol.images[i].image;
//             testData.push({
//                 id: 0,
//                 name: 'Unknown',
//                 image: image
//             });
//         }
//     }
//     return testData;
// }
//
// function runNegativeTest() {
//     var negativeTestData = getNegativeTestData();
//     let total = 0;
//     let trueNegative = 0;
//
//     for (let data of negativeTestData) {
//         try {
//             let result = recognize(data.image);
//             if (result[0].idol.id == data.id) {
//                 trueNegative++;
//                 console.log(`HIT: ${data.id} - ${data.name}`);
//             } else {
//                 console.log(`MISS. Data ${data.id} - ${data.name}. Found ${result[0].idol.id} - ${result[0].idol.name}`);
//             }
//             total++;
//             console.log(`True Negative: ${trueNegative}. Total ${total}`);
//
//             sleep(7 * 1000); // Sleep 7s vì mỗi lần recognize là 2 calls. Limit 1 phút/ 20 calls
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

// Chạy test độ chính xác của API
// runPositiveTest();
//
// runNegativeTest();

// Test method recognize
}

// var result = recognize('https://giadinh.mediacdn.vn/thumb_w/640/2019/10/30/ngoc-trinh-5-1572423107231301246873-crop-15724237122011649225014.jpg');
// console.log(JSON.stringify(result, null, 2));
