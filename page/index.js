// Sử dụng thư viện
var request = require('sync-request');
var fs = require('fs');
var filePath = "/Users/user10/A42/CDCNPM/BeYourEyeBE/page/person.json"
// Lấy danh sách idol từ file filtered-person.json
var idols = require('/Users/user10/A42/CDCNPM/BeYourEyeBE/page/filtered-person.json');

let key = 'b03443c1421e4e3eb682d10beff7f1a7'; // Thay thế bằng key của bạn
let groupId = 'tesst';

// NodeJS không có thread.sleep nên ra dùng tạm function này
function sleep(time) {
    console.log('Begin Sleep');
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
    console.log('End Sleep');
}

// Tạo idol trên hệ thống
function submitIdol(idol) {
    let url = `https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons`;
    console.log(`Begin submit idol: ${idol.id} - ${idol.name}`);

    var res = request('POST', url, {
        headers: {
            'Ocp-Apim-Subscription-Key': key
        },
        json: {
            name: idol.name,
            userData: idol.id,
            recognitionModel: "recognition_01"
        }
    });

    if (res.statusCode == 200) {
        var person = JSON.parse(res.getBody('utf8'));
        console.log(`SUCCESS - Submit idol ${idol.id} - ${idol.name}. Person ID: ${person.personId}`);
        addPerson(person.personId, idol.id, idol.name);
        // Bỏ 4 ảnh đầu
        for (let i = 0; i < 1; i++) {
            // Submit ảnh của idol lên hệ thống
            try {
                submitIdolFace(person.personId, idol.images[i].image);
                sleep(4 * 1000); // Sleep 4 giây vì limit 20 call/phút
            } catch (err) {
                console.log('ERROR');
                console.log(err);
            }
        }
    } else {
        console.log(res.getBody('utf8'));
    }

}

// Submit ảnh của idol lên hệ thống
function submitIdolFace(personId, faceUrl) {
    console.log(`Begin submit image ${faceUrl.substring(20, 60)} for person id ${personId}`);
    let url = `https://eastus.api.cognitive.microsoft.com/face/v1.0/persongroups/${groupId}/persons/${personId}/persistedFaces?detectionModel=detection_01`;
    var res = request('POST', url, {
        headers: {
            'Ocp-Apim-Subscription-Key': key
        },
        json: {
            url: "https://firebasestorage.googleapis.com/v0/b/test-ce13a.appspot.com/o/chats%2F2020-10-24%2011%3A47%3A00.992604.png?alt=media&token=77ce41a6-e571-44fd-8da0-93153bcb1182"
        }
    });

    if (res.statusCode == 200) {
        console.log(`SUCCESS - Submit image ${faceUrl.substring(20, 60)} for person id ${personId}.`);
        addPerson(personId, null, null, JSON.parse(res.getBody('utf8'))['persistedFaceId']);
    }
}


function addPerson(personId, id, name, persistedFaceId) {
    const data = fs.readFileSync(filePath);
    const stats = JSON.parse(data);
    const person = stats.find(person => person.personId === personId);
    if (!person) {
        stats.push({
                'id': id,
                'name': name,
                'personId': personId,
                'persistedFaceIds': []
            }
        )
        fs.writeFileSync(filePath, JSON.stringify(stats))
        return
    } else {
        if (!persistedFaceId) {
            return;
        }
        person.persistedFaceIds.push(persistedFaceId)
        const newStats = stats.map(p => {
            if (p.id === personId.id) {
                return person;
            } else {
                return p;
            }
        });
        fs.writeFileSync(filePath, JSON.stringify(newStats));
    }
};

var i = 0;
submitIdol(idols[1]);
