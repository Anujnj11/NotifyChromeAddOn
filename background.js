'use strict';
var Objdate = new Date();
if(23>Objdate.getHours()){   
    setInterval(GetNotify,15000);
}

function GetNotify()
{
    var isUserValid = localStorage.getItem('AESToken');     
    if(isUserValid !=null && isUserValid!=undefined && isUserValid !="")
    {
        try
        {
            getAJAXCall(isUserValid);            
            // getAJAXCall(btoa(ParseData.UserName).toUpperCase(),ParseData.Mac);
        }
        catch(error){

        }
        // console.log('present');
    }
    else
    {
        // console.log('not present');
    }
}

function CallAlter(MSG){
    var notification = {
    type:"basic",
    title:"Call",
    message:MSG,
    iconUrl:"images/phone-call.png"
};
chrome.notifications.create("notfyId",notification);

}


 function MessageAlert(MSGtEXT){
    var notification = {
        type:"basic",
        title:"Message",
        message:MSGtEXT,
        iconUrl:"images/chat.png"
    };
    chrome.notifications.create("notfyId",notification);

    
 }

 function getAJAXCall(AESToken){
        var http = new XMLHttpRequest();
        // var url = "http://localhost:9899/api/getLogDetails";
        var url = "https://notifyapi.herokuapp.com/api/getAESLogDetails";
        var params = "AESToken="+ AESToken;
        http.open("POST", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                // console.log(http.responseText);
                if(http.responseText != "" && http.responseText !=null && http.responseText!=undefined){
                    var parseData = JSON.parse(http.responseText);
                    if(parseData.success){
                        if(parseData.Data !=undefined){
                            if(parseData.Data.IsCall){
                                CallAlter(parseData.Data.CallLog);
                            }
                            else{
                                MessageAlert(parseData.Data.Message);
                            }
                        }
                    } 
                }
            }
        }
        http.send(params);
}