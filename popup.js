$().ready(function()
{
    var isUserValid = localStorage.getItem('UserDetails');
    if(isUserValid !=null && isUserValid!=undefined){
        $('#PresentData').css('display','block');
    }
    else{
        $('#UserForm').css('display','block');
        $('#PresentData').css('display','none');
        
    }

    $('#Savedetails').click(function()
    {
       if(ValidateInput()){
        $('#UserForm').css('display','none');
        $('#PresentData').css('display','block');
       }
    });

    $('#Logout').click(function(){
        localStorage.clear('UserDetails');
        $('#UserForm').css('display','block');
        $('#PresentData').css('display','none');
    });


    $('#getalldata').click(function(event){
        GetAllData(event);
    });
    
});


function GetAllData(event){
    var isUserValid = localStorage.getItem('UserDetails');    
    if(isUserValid !=null && isUserValid!=undefined)
    {
    var ParseData = JSON.parse(atob(localStorage.getItem('UserDetails')))
    var http = new XMLHttpRequest();
        // var url = "http://localhost:9899/api/getallLogDetails";
        var url = "https://notifyapi.herokuapp.com/api/getallLogDetails";
        var params = "Username="+ ParseData.UserName + "&MacId=" +ParseData.Mac;
        http.open("POST", url, true);
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                // console.log(http.responseText);
                if(http.responseText != "" && http.responseText !=null && http.responseText!=undefined){
                    var parseData = JSON.parse(http.responseText);
                    if(parseData.success && parseData.Data.length>0){
                        var TableData = "<table border = '1'><tr><th>Date</th><th>Text Message</th><th>Call</th></tr>";
                        for(let i=parseData.Data.length;i--;){
                            TableData += "<tr><td>"+ parseData.Data[i].Date + "</td><td>" + parseData.Data[i].Message + "</td><td>" + parseData.Data[i].CallLog +"</td></tr>";   
                        }
                        TableData += "</table>";
                        var opened = window.open("");
                        opened.document.write("<html><head><title>MyTitle</title></head><body>"+ TableData +"</body></html>");
                    }
                    else{
                        var opened = window.open("");
                        opened.document.write("<html><head><title>MyTitle</title></head><body><b>We didn't find any more information about this User</b>.</body></html>");
                    } 
                }
            }
        }
        http.send(params);
    }
}


function ValidateInput(){
    var UserName = $('#Username').val();
    var UserMAC = $('#Mac').val();
    if(UserName == ""){
        $('#Username').focus();
        return false;
    }
    else if( UserMAC == ""){
        $('#Mac').focus();
        return false;
    }
    else if(UserName == "" && UserMAC == "" )
        return false;
        else{
            var UserDetails = {
                'UserName':UserName,
                'Mac':UserMAC
            };
            localStorage.setItem("UserDetails",btoa(JSON.stringify(UserDetails)));
            return true;
        }
}

function GetNotify(){
    console.log("Getting call");
    var notification = {
        type:"basic",
        title:"Hello",
        message:"Anuj",
        iconUrl:"images/get_started16.png"
    };
    chrome.notifications.create("notfyId",notification);

}