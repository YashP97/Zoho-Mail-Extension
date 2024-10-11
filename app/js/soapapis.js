const document_url = "https://docedge.pericent.com/services/Document";
var baseurl = "";
var sessionId = "";

let docEdgeLoginApi = function(username, password) {
    baseurl = clicker.base_url;

    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:auth="http://auth.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <auth:login>         
                    <username>${username}</username>         
                    <password>${password}</password>
                </auth:login>
            </soapenv:Body>
        </soapenv:Envelope>
    `
    getdocEdgeSession(soaprequest);
}

let getdocEdgeRootFolderApi = function(sid) {
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fol="http://folder.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <fol:getRootFolder>
                    <!--Optional:-->
                    <sid>${sid}</sid>
                </fol:getRootFolder>
            </soapenv:Body>
        </soapenv:Envelope>
    `
    getdocEdgeRootFolder(soaprequest);
};

let getdocEdgeWorkspaceApi = function(sid){
    let soaprequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fol="http://folder.webservice.docedge.com/">
        <soapenv:Header/>
        <soapenv:Body>
            <fol:listWorkspaces>                
                <sid>${sid}</sid>
            </fol:listWorkspaces>
        </soapenv:Body>
    </soapenv:Envelope>
    `
    getdocEdgeWorkspaces(soaprequest);
}

let getdocEdgeListChildrenApi = function(sid, folderId){
    console.log("getdocEdgeListChildrenApi starts");
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fol="http://folder.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <fol:listChildren>         
                    <sid>${sid}</sid>
                    <folderId>${folderId}</folderId>
                </fol:listChildren>
            </soapenv:Body>
        </soapenv:Envelope>
    `
    getdocEdgeChildFolders(soaprequest);
}

let docedgeUploadDocumentApi = function(sid, folderId, filename, content){
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:doc="http://document.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <doc:upload>         
                    <sid>${sid}</sid>         
                    <folderId>${folderId}</folderId>         
                    <filename>${filename}</filename>         
                    <content>${content}</content>
                </doc:upload>
            </soapenv:Body>
        </soapenv:Envelope>
    `
}

function getdocEdgeSession(soaprequest){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', baseurl + "/services/Auth?wsdl", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    //xhr.setRequestHeader('SOAPAction', 'http://auth.webservice.docedge.com/login');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {                
                var parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
                const result = xmlDoc.getElementsByTagName("return")[0].textContent;
                sessionId = result;
                getdocEdgeWorkspaceApi(result);             
            } else {
                alert('Failed to get login Id');
            }
        }
    };

    xhr.send(soaprequest);    
}

function getdocEdgeRootFolder(soaprequest){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Folder", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");                
                const result = xmlDoc.getElementsByTagName("id")[0].textContent;                
            } else {
                alert('Failed to get root folder');
            }
        }
    };

    xhr.send(soaprequest);
}

function getdocEdgeWorkspaces(soaprequest){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Folder", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var list = [];
                var parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");                
                const result = xmlDoc.getElementsByTagName("workspaces");                
                for(let i = 0; i < result.length; i++){
                    let idd = result[i].getElementsByTagName("id");
                    let nname = result[i].getElementsByTagName("name");

                    list.push({id : idd[0], name : nname[0]});
                }

                reloadingnewPage(list);               
            } else {
                alert("Failed to get folders");
            }
        }
    };

    xhr.send(soaprequest);
}

function getdocEdgeChildFolders(soaprequest){
    console.log("getdocEdgeChildFolders starts");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Folder", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var list = [];
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xhr.responseText, 'application/xml');
                const folders = xmlDoc.getElementsByTagName("folder");
                for(let i=0; i<folders.length; i++){
                    let idd = folders[i].getElementsByTagName("id");
                    let nname = folders[i].getElementsByTagName("name");

                    list.push({id : idd[0], name : nname[0]});
                }

                reloadingnewPage(list);
            }else{
                alert("Failed to get folders");
            }
        }
    };

    xhr.send(soaprequest);
}

function createEmlFile(content) {
    console.log("content.FROM = " + content.FROM + " \ncontent.TO = " + content.TO + " \ncontent.SUBJECT = " + content.SUBJECT +
        "\ncontent.SM = " + content.SM + "\ncontent.Content = " + content.CONTENT);
    // const emlContent = `From: ${content.FROM}\n` +
    //     // `To: ${content.TO}\n` +
    //     `Subject: ${content.SUBJECT}\n` +
    //     `\n` + // Blank line separates headers from body
    //     `${content.SM}`;
    
    const emlContent = `${content.CONTENT}`;
}