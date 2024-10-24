var clicker = {
    base_url : "",
    byteContent : "",
    fileName : ""
};

const { jsPDF } = window.jspdf;

$('#loginbutton').click(function(){    
    clicker.base_url = document.getElementById("docedgeurl").value;    
    var login = document.getElementById("docedgeusername").value;
    var password = document.getElementById("docedgepassword").value;

    newsoapapis.docEdgeLoginApi(login, password);
    // previewsectiondisplay();
});

$(document).on("click", function(event){
    if(event.target.id === "uploadmail"){        
        createEmlFile(newinitApp.info);
        newsoapapis.getdocEdgeWorkspaceApi();
    }
});

clicker.previewsectiondisplay = function(){
    document.getElementById('loginsection').style.display="none";
    document.getElementById('previewmailsection').style.display = "block";
}

clicker.reloadingnewPage = function(list){  
    if(list == null || list.length < 1)
        return;
    
    document.getElementById('loginsection').style.display="none";
    document.getElementById('previewmailsection').style.display = "none";
    
    let section = document.getElementById("foldersection");
    section.style.display = "flex";

    let buttondivelement = document.createElement("div");
    let buttonelement = document.createElement("button");
    buttonelement.innerHTML = "Upload";
    buttonelement.classList.add('foldersectionbutton');
    buttonelement.id = "uploaddoc";
    buttondivelement.appendChild(buttonelement);
    buttondivelement.classList.add('foldersectionbuttondivclass');

    buttonelement.addEventListener("click", () => {        
        let folder = document.getElementsByClassName('folderdivclickclass')[0];
        let folderId = folder.id;
        newsoapapis.docedgeUploadDocumentApi(folderId, clicker.fileName, clicker.byteContent);        
    });    

    let container = document.getElementById("folderContainer");
    container.innerHTML = "";
    
    for(let i = 0 ; i < list.length; i++){
        let divelement = document.createElement("div");
        divelement.classList.add("folderdivclass");
        
        let imgelement = document.createElement("img");
        imgelement.src = "/app/img/cube_blue16.png";
        imgelement.alt = "Folder Image";
        imgelement.classList.add("folderimgclass");
        
        let headingelement = document.createElement("h2");
        headingelement.classList.add("folderh2class");

        divelement.id = list[i].id.textContent;        
        headingelement.textContent = list[i].name.textContent;

        divelement.appendChild(imgelement);
        divelement.appendChild(headingelement);

        divelement.addEventListener("click", () => {
            let activeElements = document.getElementsByClassName("folderdivclickclass");
            for(let activeElement of activeElements){
                activeElement.classList.remove("folderdivclickclass");
            }
            divelement.classList.add("folderdivclickclass");
            document.getElementsByClassName('foldersectionbuttondivclass')[0].style.display = "block";
        });

        divelement.addEventListener("dblclick", () => {            
            let folder = document.getElementsByClassName('folderdivclickclass')[0];
            let folderId = folder.id;            
            listingdocEdgeFolderChildren(folderId);
        });      

        container.appendChild(divelement);        
    }

    section.appendChild(buttondivelement);
}

let listingdocEdgeFolderChildren = function(id){   
    if((newsoapapis.sessionId === null || newsoapapis.sessionId === "" || newsoapapis.sessionId === undefined)){
        alert("No session found");
    }
    else if(id === null || id === "" || id === undefined){
        alert("Folder Id undefined");
    }
    else{
        newsoapapis.getdocEdgeListChildrenApi(newsoapapis.sessionId, id);
    }    
}

function createEmlFile(content) {
    // let match = content.CONTENT.match(/<div>(.*?)<\/div>/);
    // const firstDivContent = match ? match[1] : '';
    
    clicker.fileName = content.SUBJECT + ".pdf";
    let cleanContent = content.CONTENT.replace(/<[^>]*>/g, '').trim();
    let nbspContent = cleanContent.replace(/&nbsp;/g, '').trim();
    
    const emlContent = `From: ${content.FROM}\n` +
        `To: ${content.TO}\n` +
        `Subject: ${content.SUBJECT}\n` +
        `\n` +        
        nbspContent;

    creatingFile(emlContent);

    // let byteString = bytesToBase64(new TextEncoder().encode(emlContent));
    // clicker.byteContent = byteString;
}

function bytesToBase64(bytes) {
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}

function creatingFile(emlContent){
    const pdf = new jsPDF();

    const lines = pdf.splitTextToSize(emlContent, 180);

    pdf.text(lines, 10, 10);    

    const base64String = pdf.output('datauristring'); 

    const base64Content = base64String.split(',')[1];

    clicker.byteContent = base64Content;    
}

function base64UsingFileReader(){
    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const reader = new FileReader();
    reader.onloadend = function() {
        const base64String = reader.result.split(',')[1];
        clicker.byteContent = base64String;
        console.log(base64String);
    };
    
    reader.readAsDataURL(blob);
}