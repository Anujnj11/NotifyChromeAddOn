$().ready(function () {
    var isUserValid = localStorage.getItem('AESToken');
    if (isUserValid != null && isUserValid != undefined && isUserValid != "") {
        $('#PresentData').css('display', 'block');
    } else {
        $('#UserForm').css('display', 'block');
        $('#PresentData').css('display', 'none');

    }

    $('#Savedetails').click(function () {
        ValidateInput();
    });

    $('#Logout').click(function () {
        localStorage.clear('UserDetails');
        $('#UserForm').css('display', 'block');
        $('#PresentData').css('display', 'none');
    });


    $('#getalldata').click(function (event) {
        GetAllData(event);
    });

    $('#createMsg').click(function (event){
        chrome.tabs.create({
            url: chrome.extension.getURL('send-text.html')
        });
    });

    $('#SnoozeCHK').click(function(){
        if ($('#SnoozeCHK').is(':checked')) 
        {
            $('#SnoozeSele').css('display','inline-block');
        }
        else{
            $('#SnoozeSele').css('display','none');      
            $('#SnoozeSele').val("0");      
            $('#getalldata').html("<u>Missed Notification</u>");
            localStorage.removeItem('SnoozeSele');
            localStorage.removeItem('IsSnooze');
            localStorage.removeItem('SnoozeValue');
            
        }
    });

    $('#SnoozeSele').change(function(){
        Snooze();
    });

    IsSnooze();
});


// function GetAllData(event) {
//     var isUserValid = localStorage.getItem('AESToken');
//     if (isUserValid != null && isUserValid != undefined) {
//         //var ParseData = JSON.parse(atob(localStorage.getItem('UserDetails')))
//         var http = new XMLHttpRequest();
//         // var url = "http://localhost:9899/api/getallLogDetails";
//         var url = "https://socketnotifymeapi.herokuapp.com/api/getAESallLogDetails";
//         var params = "AESToken=" + isUserValid;
//         http.open("POST", url, true);
//         //Send the proper header information along with the request
//         http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//         http.onreadystatechange = function () { //Call a function when the state changes.
//             if (http.readyState == 4 && http.status == 200) {
//                 // console.log(http.responseText);
//                 if (http.responseText != "" && http.responseText != null && http.responseText != undefined) {
//                     var parseData = JSON.parse(http.responseText);
//                     if (parseData.success && parseData.Data.length > 0) {
//                         var TableData = "<table border = '1'><tr><th>Date</th><th>Text Message</th><th>Call</th></tr>";
//                         for (let i = parseData.Data.length; i--;) {
//                             TableData += "<tr><td>" + parseData.Data[i].Date + "</td><td>" + parseData.Data[i].Message + "</td><td>" + parseData.Data[i].CallLog + "</td></tr>";
//                         }
//                         TableData += "</table>";
//                         var opened = window.open("");
//                         opened.document.write("<html><head><title>Notification</title></head><body>" + TableData + "</body></html>");
//                     } else {
//                         var opened = window.open("");
//                         opened.document.write("<html><head><title>Notification</title></head><body><b>We didn't find any more information about this User</b>.</body></html>");
//                     }
//                 }
//             }
//         }
//         http.send(params);
//     }
// }

function GetAllData(event) {
    var isUserValid = localStorage.getItem('AESToken');
        if (isUserValid != null && isUserValid != undefined && isUserValid != "") {
            window.open("https://socketnotifymeapi.herokuapp.com/getaeslog?aestoken=" + isUserValid);
        }
}


function ValidateInput() {
    var UserName = $('#Username').val();
    var UserMAC = $('#Mac').val();
    if (UserName == "") {
        $('#Username').focus();
        return false;
    } else if (UserMAC == "") {
        $('#Mac').focus();
        return false;
    } else if (UserName == "" && UserMAC == "")
        return false;
    else {
        // var UserDetails = {
        //     'UserName':UserName,
        //     'Mac':UserMAC
        // };
        // localStorage.setItem("UserDetails",btoa(JSON.stringify(UserDetails)));
        getAESToken(UserName, UserMAC, (IsValid) => {
            if (IsValid) {
                $('#UserForm').css('display', 'none');
                $('#PresentData').css('display', 'block');
                $('#ErrorAes').css('display','none');
                return true;
            } else {
                $('#ErrorAes').css('display', 'block').html('Invalid Credentials');
                return false;
            }
        });
    }
}


function getAESToken(UserName, password, callBack) {
    var http = new XMLHttpRequest();
    var url = "https://socketnotifymeapi.herokuapp.com/api/GetLoginToken";
    var params = "Username=" + UserName.trim() + "&password=" + password.trim();
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            // console.log(http.responseText);
            if (http.responseText != "" && http.responseText != null && http.responseText != undefined) {
                var parseData = JSON.parse(http.responseText);
                if (parseData.success) {
                    if (parseData.AESToken != undefined && parseData.AESToken != "") {
                        localStorage.setItem("AESToken", parseData.AESToken);
                        localStorage.setItem("AESTokenValidity", new Date().toDateString());
                        
                        callBack(true);
                    }
                } else {
                    callBack(false);
                }
            }
        }
    }
    http.send(params);
}

function Snooze()
{
    if ($('#SnoozeCHK').is(':checked') && $('#SnoozeSele').val() != "0") 
    {
        localStorage.setItem('SnoozeValue',$('#SnoozeSele').val());
        var Objdate = new Date();
        Objdate =  Objdate.getHours() + parseInt($('#SnoozeSele').val());
        localStorage.setItem('IsSnooze',Objdate);
        $('#getalldata').html("<u>Don't worry still you can see missed notification</u>");
    }
    else{
        localStorage.removeItem('IsSnooze');     
    }

}

function IsSnooze()
{
    var SnoozeValue = localStorage.getItem('SnoozeValue');
    if(SnoozeValue !=undefined && SnoozeValue!=null)
    {
        $('#SnoozeCHK').attr('checked',true);
        $('#SnoozeSele').val(SnoozeValue); 
        $('#SnoozeSele').css('display','inline-block');
        $('#getalldata').html("<u>Don't worry still you can see missed notification</u>");
        
    }
}
