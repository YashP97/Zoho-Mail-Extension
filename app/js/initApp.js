/**
 * Initialise App to get events from Mail
 * Return @param {*} initObj contains the Night Mode, language and font details
 */
/*window.AppSDK = SigmaSDK.MAIL.init(() =>{
    AppSDK.dispatch("drop",{isListen: true}); 
    window.appView.populateNotebooks();
    window.appView.populateAppData();
});*/

let populateMailDetails = function(mailInfo) {
    window.appView.populateCurrentMailDetails(mailInfo);
    window.appView.populateAttachmentDetails(mailInfo);
    if (mailInfo.FROM) {
        $(".search_input").val(mailInfo.FROM);
        $("#contactBtn").click();
    }
    window.appView.populateRelationalData(mailInfo.MSGID);
};

/**
 * Subscribe to Events you need using ZMSDK.app.on()
 */
AppSDK.on("mail_preview", function(mailObj) {
    window.apiUtil.getMailDetails(mailObj.MSGID).then(function(mailInfo) {
        console.log(mailInfo);
        populateMailDetails(mailInfo);
        document.getElementById("uploadmail").addEventListener('click', function() {
            createEmlFile(mailInfo);
        });
    });
});

/**
 *  Event to detect compose window open
 */
// AppSDK.on("compose_open", () => {
//     window.apiUtil.getComposeDetails().then((composeInfo) => {
//         console.log(composeInfo);
//         window.appView.populateCurrentComposeDetails(composeInfo);
//     });
// });

/**
 *  Event to get saved draft content
 */

AppSDK.on("draft_save", (draftContent) => {
    console.log(draftContent);
    window.appView.populateSavedDraftDetails(draftContent);
});

/**
 * Event to get dragged mail content
 */
AppSDK.on("drop", function(dropInfo) {
    console.log(dropInfo);
    let data = dropInfo.data && dropInfo.data[0];
    if (dropInfo.type === "mail") {
        populateMailDetails(data);
        return;
    }
    window.appView.populateAttachmentDetails(dropInfo);
    if (!$("#attachmentInfo").find(".cs_accTitle").hasClass("active")) {
        $("#attachmentInfo").find(".cs_accTitle").click();
    }
});

/**
 * Event to detect preview mail close
 */
AppSDK.on("mail_close", function() {
    window.appView.populateCurrentMailDetails({});
    window.appView.populateContactDetails();
    window.appView.populateRelationalData();
});

/**
 * Get the Night Mode and Font settings of the inbox, inside your application.
 */

AppSDK.on("mail_setting", function(mailSettingsData) {
    console.log(mailSettingsData);
});

$(document).ready(function() {
    window.appView.bindAppEvents();
    window.appView.bindApiEvents();
});