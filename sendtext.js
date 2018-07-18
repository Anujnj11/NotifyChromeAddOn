$().ready(function () {
    var MobileNumber = localStorage.getItem('To');
    if (MobileNumber != undefined && MobileNumber !=null && MobileNumber !="undefined") {
        $('#MobileNumber').val(MobileNumber);
        localStorage.removeItem('To');
    }

    $('#BroadCastMessage').click(function () {
        var MNumber = $('#MobileNumber').val().trim();
        var Msg = $('#Message').val().trim();

        if (MNumber == "") {
            $('#MobileNumber').focus();
            return false;
        }
        if (Msg == "") {
            $('#Message').focus();
            return false;
        }


        var OnlyNumber = new RegExp('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$');
        if (!OnlyNumber.test(MNumber)) {
            $('#MobileNumber').focus();
            return false;
        } else {
            chrome.runtime.sendMessage({
                MobileNumber: MNumber,
                Mesg: Msg,
                type: 'BroadCastMessage'
            });
        }
    });
});