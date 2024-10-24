let apiUtil = window.apiUtil, noteId = "-1";
    
window.appView = {};

window.appView.populateCurrentMailDetails = function(mailData) {
    let rootElement = document.getElementById("mailInfo");
    let _template = '<ul>' +
        '<li class="hasChild">' +
        '<ul>' +
        '<li><strong>Message Id</strong><span id="MSGID" style="color:green"></span></li>' +
        '<li><strong>Subject</strong><span id="SUBJECT"></span></li>' +
        '<li><strong>Summary</strong><span id="SM"></span></li>' +
        // '<li><strong>Content</strong><span id="CONTENT"></span></li>' +
        '<li><strong>From</strong><span id="FROM"></span></li>' +
        '<li><strong>To</strong><span id="TO"></span></li>' +
        '<li><strong>CC</strong><span id="CC"></span></li>' +
        '<li><strong>BCC</strong><span id="BCC"></span></li>' +
        // '<li>' +
        // '<div class="mailbtnwrap">' +
        // '<div class="mailbtn" id="reply">' +
        // '<u>Reply</u>' +
        // '</div>' +
        // '<div class="mailbtn" id="replyAll">' +
        // '<u>Reply All</u>' +
        // '</div>' +
        // '<div class="mailbtn" id="forward">' +
        // '<u>Forward</u>' +
        // '</div>' +
        // '</div>' +
        // '</li>' +
        '</ul>' +
        '</li>' +
        '</ul>';
    if ($.isEmptyObject(mailData)) {
        _template = '<div class="centerDiv">Open a mail to get view details</div>';
        rootElement.innerHTML = _template;
        return;
    }
    _template = _template + "<button id='uploadmail'>Upload</button>";
    rootElement.innerHTML = _template;
    Object.keys(mailData).forEach(function(key) {
        $("#" + key).text(mailData[key] || "-");

    });

    // $(rootElement).find(".mailbtn").click(function(event) {
    //     switch (event.currentTarget.id) {
    //         case "reply":
    //             apiUtil.reply(mailData.MSGID);
    //             break;
    //         case "replyAll":
    //             apiUtil.replyAll(mailData.MSGID);
    //             break;
    //         case "forward":
    //             apiUtil.forwardMail(mailData.MSGID);
    //             break;
    //     }
    // });
};

// window.appView.populateRelationalData = function(msgId) {
//     let rootElement = document.getElementById("relationInfoCont"),
//         _template;
//     if (!msgId) {
//         _template = '<div class="centerDiv">Open an email for relational mapping</div>';
//         rootElement.innerHTML = _template;
//         return;
//     }
//     apiUtil.fetchMailRelationalData(msgId).then(function(rdataObj) {
//         _template = '<div>' +
//             '<ul>' +
//             '<li class="hasChild">' +
//             '<ul>' +
//             '<li>' +
//             '<strong>Relational data for preview mail</strong>' +
//             '<span id="rdata" style="color:green"></span>' +
//             '</li>' +
//             '</ul>' +
//             '</li>' +
//             '</ul>' +
//             '<textarea class="composeBox" id="relationData"></textarea>' +
//             '<ul><li><strong><u>Note</u> : Only Json Object is allowed</strong></li></ul>' +
//             '<span class="PluginButton" id="setMailData">Set Relational Data for preview mail</span>' +
//             '</div>';
//         rootElement.innerHTML = _template;
//         $("#rdata").text(rdataObj ? JSON.stringify(rdataObj) : "No data found");
//         $("#setMailData").click(function() {
//             let rData = $("#relationData").val();
//             try {
//                 rData = JSON.parse(rData);
//             } catch (e) {
//                 return;
//             }
//             apiUtil.setMailRelationalData(msgId, rData).then(function() {
//                 window.appView.populateRelationalData(msgId);
//             });
//         });
//     });
// };

window.appView.populateAttachmentDetails = function(mailData) {
    let rootElement = document.getElementById("attachmentCont");
    rootElement.innerHTML = "";
    if (mailData.type === "attachment") {
        mailData.NEWATTR = mailData.data;
    }
    if (!$.isEmptyObject(mailData.NEWATTR)) {

        mailData.NEWATTR.forEach(function(attachmentData, index) {

            let attachEle = document.createElement("div"),
                btnWrapper = document.createElement("div"),
                fileEle = document.createElement("div"),
                attachData = {
                    groupId: attachmentData.groupId,
                    entityId: attachmentData.entityId,
                    entityType: attachmentData.entityType,
                    attachId: attachmentData.attachId
                };

            fileEle.innerText = attachmentData.name;
            btnWrapper.innerHTML = "<div>" +
                "<span class='PluginButton' id='compose'>Add to Compose</span>" +
                (noteId !== "1" && ["gif", "png", "jpeg", "jpg", "bmp", "tiff", "tif"].includes(attachmentData.fmt) ? "<span class='PluginButton' id='insert'>Add to Notebook</span>" : "") +
                "</div>";
            attachEle.append(fileEle);
            attachEle.append(btnWrapper);
            $(btnWrapper).find("#compose").click(function() {
                apiUtil.downloadAttachment(attachData).then(function(file) {
                    apiUtil.composeNewMail({
                        ATTACHMENT: new File([file], attachmentData.name)
                    });
                });
            });
            if ($(btnWrapper).find("#insert")[0]) {
                $(btnWrapper).find("#insert").click(function() {
                    var callbackApiXhr = {
                        url: "https://notebook.zoho.com/api/v1/cards/image",
                        type: "POST",
                        headers: {},
                        attachPayload: {
                            JSONString: {
                                "notebook_id": noteId,
                                "notecard_name": attachmentData.fn
                            }
                        },
                        payload: {},
                        serviceName: "docedgeConnector",
                        params: {},
                        file: {
                            fileName: attachmentData.fn,
                            fileParamName: "attachment"
                        }
                    };
                    apiUtil.downloadAttachment(attachData, callbackApiXhr).then(function(params) {
                        $(btnWrapper).find("#insert").text("Uploaded");
                        $(btnWrapper).find("#insert").css("pointer-events", "none");
                    });
                });
            }
            rootElement.appendChild(attachEle);
        });
        return;
    }
    rootElement.innerHTML = "<div class='centerDiv'>No attachement found</div>";
};