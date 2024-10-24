var apiCore = {
    /**
     * Get Mail details using message ID
     */
    getMailDetails: function(messageId) {
        return AppSDK.get(["mailInfo", messageId]);
    },

    /**
     * Download attachment from mail and upload to url using callbackApiXhr
     */
    downloadAttachment: function(attachObj, callbackApiXhr) {
        return AppSDK.dispatch("downloadAttachment", {
            attachInfo: attachObj,
            callbackApiXhr
        });
    },

    setMailRelationalData: function(messageId, data) {
        data.msgId = messageId
        return AppSDK.dispatch("associateApp", data);
    },

    /**
     * Get app data for an email
     */
    fetchMailRelationalData: function(messageId) {
        return AppSDK.dispatch("integData", {
            msgId: messageId
        });
    },

    /**
     * Send request to other service
     */
    executeURL: function(xhrObj) {
        return AppSDK.dispatch("invokeUrl", {
            xhrObj
        });
    },

    /**
     * Store data specific to the app
     */
    setAppData: function(appData) {
        return AppSDK.dispatch("data", {
            operation: "set",
            data: appData
        });
    },
};

window.apiUtil = apiCore;