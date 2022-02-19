let connected = false
const usernameInp = document.getElementById("username")
const button = document.getElementById("join_leave")
const container = document.getElementById("container")
const count = document.getElementById("count")
let room

function connectButtonHandler(event) {
    event.preventDefault()
    if (!connected) {
        let username = usernameInp.value
        if (!username) {
            alert("Enter your name")
            return
        }
        button.disabled = true
        button.innerHTML = "Connecting..."
        connect(username).then(() => {
            button.innerHTML = "leave call"
            button.disabled = false
        }).catch(() => {
            alert("connection failed") //backend fail?
            button.innerHTML = "join call"
            button.disabled = false
        })
    } else {
        disconnect()
        button.innerHTML = "join call"
        connected = false
    }
}

// Client contacts server, authenticate, request for access token received, client calls twilio-video with token to connect
function connect(username) {
    let promise = new Promise((resolve,reject) => {
        //fetch token
        fetch("/login", {
            method: "POST",
            body: JSON.stringify({"username":username})
        }).then(res => res.json()).then(data => {
            //join vid call
            console.log(data.token)
            return Twilio.Video.connect(data.token)
        }).then(_room => {
            room = _room;
            room.participants.forEach(participantConnected);
            room.on("participantConnected",participantConnected);
            room.on("participantDisconnected",participantDisconnected);
            connected = true;
            updateParticipantCount();
            resolve();
        }).catch(() => {
            reject()
        })
    })
    return promise
}

function updateParticipantCount() {
    if (!connected) {
        count.innerHTML = "Disconnected"
    } else {
        count.innerHTML = (room.participants.size + 1) + " participants online"
    }
}

function addLocalVideo() {
    Twilio.Video.createLocalVideoTrack().then(track => {
        let video = document.getElementById('local').firstChild
        video.appendChild(track.attach())
    })
}

addLocalVideo()
button.addEventListener("click",connectButtonHandler)