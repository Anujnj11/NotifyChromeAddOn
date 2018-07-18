'use strict';
(function () {
    if (23 > new Date().getHours()) {
        setInterval(SocketGetNotify, 15000);
    }
})();
const socketSetting = {
    socket: ""
};

const notification = {
    type: "basic",
    title: "",
    message: "",
    iconUrl: "images/chat.png",
    buttons: []
};


function CallAlter(MSG) {

    if (new Date().getHours() >= parseInt(localStorage.getItem('IsSnooze') == null ? 0 : localStorage.getItem('IsSnooze'))) {
        var notification = {
            type: "basic",
            title: "Call",
            message: MSG,
            iconUrl: "images/phone-call.png",
            buttons: [{
                title: "Reply"
            }]
        };
        // notification.title = "Call";
        // notification.message = MSG;
        // iconUrl: "images/phone-call.png"
        // notification.buttons =  [{
        //     title: "Reply"
        //     // iconUrl: "/path/to/yesIcon.png"
        // }];

        chrome.notifications.create(MSG, notification);
        chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
            if (btnIdx === 0) {
                chrome.tabs.create({
                    url: chrome.extension.getURL('send-text.html')
                });
            }
        });
    }
}


function MessageAlert(MSGtEXT, From) {
    if (new Date().getHours() >= parseInt(localStorage.getItem('IsSnooze') == null ? 0 : localStorage.getItem('IsSnooze'))) {
        notification.title = From;
        notification.message = MSGtEXT;
        // notification.iconUrl="images/chat.png";
        notification.buttons = [{
            title: "Reply"
            // iconUrl: "/path/to/yesIcon.png"
        }];

        chrome.notifications.create(From, notification);
        chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
            // localStorage.setItem('To',notifId);      
            // if (notifId === myNotificationID) {
            if (btnIdx === 0) {
                chrome.tabs.create({
                    url: chrome.extension.getURL('send-text.html')
                });
                // localStorage.setItem('IsPageViewedOnce',"1");
            }
        });
    }
}


function SocketGetNotify() {
    var isUserAESTokenValid = localStorage.getItem('AESTokenValidity');
    if (isUserAESTokenValid != undefined && isUserAESTokenValid == new Date().toDateString()) {
        var isUserValid = localStorage.getItem('AESToken');
        if (isUserValid != null && isUserValid != undefined && isUserValid != "") {
            try {
                if (localStorage.getItem('IsConnected') == null && 
                localStorage.getItem('IsConnected') != "true")
                // if(socket != undefined && !socket.connected)
                {
                    InitilizeSocket();
                } else if (socketSetting.socket.connected == undefined) {
                    InitilizeSocket();
                }
                // else{
                //     // localStorage.removeItem('IsConnected');
                // }
            } catch (error) {

            }
            // console.log('present');
        } else {
            // console.log('not present');
        }
    } else {
        if (socketSetting.socket != undefined && socketSetting.socket != "") {
            socketSetting.socket.disconnect();
            socketSetting.socket = "";
        }
        localStorage.clear();
    }
}

//Event Listner
chrome.runtime.onMessage.addListener(function (EventToBeExceuted, tabInfo) {
    if (EventToBeExceuted.type == 'BroadCastMessage') {
        // console.log(tabInfo);
        var MessageBody = {};
        MessageBody.Message = EventToBeExceuted.Mesg;
        MessageBody.Date = new Date();
        MessageBody.AESToken = localStorage.getItem('AESToken');
        MessageBody.MobileNumber = EventToBeExceuted.MobileNumber;
        // console.log(MessageBody);
        if (socketSetting.socket != undefined && socketSetting.socket.connect)
            socketSetting.socket.emit('reply message', MessageBody);
        chrome.tabs.remove(tabInfo.tab.id);
        // callback( some_method(request.name));
    }
    //else if (request.type == 'localStorage - step 5') {
    //     localStorage.setItem(request.name, request.value);
    // }
});

function InitilizeSocket() {
    try {
        socketSetting.socket = io.connect('https://socketnotifymeapi.herokuapp.com');
        // socketSetting.socket = io.connect('http://localhost:4555');
        socketSetting.socket.on('connect', function () {
            socketSetting.socket.emit('AESGroup', localStorage.getItem('AESToken'));
            localStorage.setItem('IsConnected', true);
        });

        socketSetting.socket.on('SocketNotifyAES', function (msg) {
            if (msg.AESToken == localStorage.getItem('AESToken')) {
                localStorage.setItem('To', msg.MobileNumber);
                if (msg.IsCall) {
                    CallAlter(msg.CallLog);
                } else MessageAlert(msg.Message, msg.CallLog);
            }
        });
        socketSetting.socket.on('incoming text', function (msg) {
            alert('Done!');
        });

        socketSetting.socket.on('lost message', function (data) {
            console.log(data);
        });


        socketSetting.socket.on('disconnect', function () {
            socketSetting.socket.disconnect();
            localStorage.removeItem('IsConnected');
            socketSetting.socket = "";
        });
    } catch (err) 
    {

    }

}