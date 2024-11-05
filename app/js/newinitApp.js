/**
 * Initialise App to get events from Mail
 * Return @param {*} initObj contains the Night Mode, language and font details
 */

let newinitApp = {};

let populateMailDetails = function(mailInfo) {
    window.appView.populateCurrentMailDetails(mailInfo);
    // window.appView.populateAttachmentDetails(mailInfo);
    if (mailInfo.FROM) {
        $(".search_input").val(mailInfo.FROM);
        $("#contactBtn").click();
    }
};

/**
 * Subscribe to Events you need using ZMSDK.app.on()
 */
AppSDK.on("mail_preview", function(mailObj) {
    window.apiUtil.getMailDetails(mailObj.MSGID).then(function(mailInfo) {               
        newinitApp.info = mailInfo;
        populateMailDetails(mailInfo);        
    });
});

/**
 * Event to detect preview mail close
 */
AppSDK.on("mail_close", function() {
    window.appView.populateCurrentMailDetails({});
    window.appView.populateContactDetails();
    // window.appView.populateRelationalData();
});

/**
 * Get the Night Mode and Font settings of the inbox, inside your application.
 */

AppSDK.on("mail_setting", function(mailSettingsData) {
    console.log(mailSettingsData);
});