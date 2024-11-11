var baseurl = "";

let newsoapapis = {
    sessionId : "",
    sessionValid : false,
    maindocId : "",
    attachdocId : ""
};

newsoapapis.docEdgeLoginApi = function(username, password) {
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
    newsoapapis.getdocEdgeSession(soaprequest);
}

newsoapapis.validSessionApi = function() {
    let soaprequest = `
         <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:auth="http://auth.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <auth:valid>                    
                    <sid>${newsoapapis.sessionId}</sid>
                </auth:valid>
            </soapenv:Body>
        </soapenv:Envelope>
    `

    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Auth", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
                const result = xmlDoc.getElementsByTagName("return")[0].textContent;
                newsoapapis.sessionValid = result;
            }else{
                alert("Not able to check session authenticity");
            }
        }
    };

    xhr.send(soaprequest);
}

newsoapapis.logoutSessionApi = function(){
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:auth="http://auth.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <auth:logout>
                    <!--Optional:-->
                    <sid>${newsoapapis.sessionId}</sid>
                </auth:logout>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Auth", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                               
            }else{
                alert("Not able to logout the session");                
            }
        }
    };

    xhr.send(soaprequest);    
}

newsoapapis.getdocEdgeRootFolderApi = function() {
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fol="http://folder.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <fol:getRootFolder>
                    <!--Optional:-->
                    <sid>${newsoapapis.sessionId}</sid>
                </fol:getRootFolder>
            </soapenv:Body>
        </soapenv:Envelope>
    `
    newsoapapis.getdocEdgeRootFolder(soaprequest);
};

newsoapapis.getdocEdgeWorkspaceApi = function(){
    let soaprequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fol="http://folder.webservice.docedge.com/">
        <soapenv:Header/>
        <soapenv:Body>
            <fol:listWorkspaces>                
                <sid>${newsoapapis.sessionId}</sid>
            </fol:listWorkspaces>
        </soapenv:Body>
    </soapenv:Envelope>
    `
    newsoapapis.getdocEdgeWorkspaces(soaprequest);
}

newsoapapis.getdocEdgeListChildrenApi = function(folderId){
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fol="http://folder.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <fol:listChildren>         
                    <sid>${newsoapapis.sessionId}</sid>
                    <folderId>${folderId}</folderId>
                </fol:listChildren>
            </soapenv:Body>
        </soapenv:Envelope>
    `
    newsoapapis.getdocEdgeChildFolders(soaprequest);
}

newsoapapis.docedgeUploadDocumentApi = function(folderId, filename, content){
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:doc="http://document.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <doc:upload>         
                    <sid>${newsoapapis.sessionId}</sid>         
                    <folderId>${folderId}</folderId>         
                    <filename>${filename}</filename>         
                    <content>${content}</content>
                </doc:upload>
            </soapenv:Body>
        </soapenv:Envelope>
    `

    newsoapapis.uploadDocumentstodocEdge(soaprequest);
}

newsoapapis.docedgeLinkDocumentsApi = function(){
    let soaprequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:doc="http://document.webservice.docedge.com/">
            <soapenv:Header/>
            <soapenv:Body>
                <doc:link>
                    <sid>${newsoapapis.sessionId}</sid>
                    <doc1>${newsoapapis.maindocId}</doc1>
                    <doc2>${newsoapapis.attachdocId}</doc2>
                    <type>normal</type>
                </doc:link>
            </soapenv:Body>
        </soapenv:Envelope>
    `

    newsoapapis.linkDocumentsindocEdge(soaprequest);
}

newsoapapis.getdocEdgeSession = function(soaprequest){
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
                newsoapapis.sessionId = result;   
                clicker.previewsectiondisplay();             
                // getdocEdgeWorkspaceApi(result);             
            } else {
                alert('Failed to get session id');
            }
        }
    };

    xhr.send(soaprequest);    
}

newsoapapis.getdocEdgeRootFolder = function(soaprequest){
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

newsoapapis.getdocEdgeWorkspaces = function(soaprequest){
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

                clicker.reloadingnewPage(list);               
            } else {
                alert("Failed to get workspaces");
            }
        }
    };

    xhr.send(soaprequest);
}

newsoapapis.getdocEdgeChildFolders = function(soaprequest){
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
                clicker.reloadingnewPage(list);
            }else{
                alert("Failed to get folders");
            }
        }
    };

    xhr.send(soaprequest);
}

newsoapapis.uploadDocumentstodocEdge = function(soaprequest){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Document", false);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                alert("Document Uploaded !");                
            }else{
                alert("Failed to upload documents");
            }
        }
    };

    xhr.send(soaprequest);
}

newsoapapis.linkDocumentsindocEdge = function(soaprequest){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseurl + "/services/Document", fasle);
    xhr.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                alert("Document Linked!");
            }else{
                alert("Documents not able to linked");
            }
        }
    };

    xhr.send(soaprequest);
}