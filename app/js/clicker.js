var clicker = {
    base_url : ""
};

$('#loginbutton').click(function(){    
    clicker.base_url = document.getElementById("docedgeurl").value;    
    var login = document.getElementById("docedgeusername").value;
    var password = document.getElementById("docedgepassword").value;

    docEdgeLoginApi(login, password);
});


function reloadingnewPage(list){  
    if(list == null || list.length < 1)
        return;
    
    document.getElementById('loginsection').style.display="none";
    
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
        //imgelement.id = list[i].id.textContent;
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
    if((sessionId === null || sessionId === "" || sessionId === undefined)){
        alert("No session found");
    }
    else if(id === null || id === "" || id === undefined){
        alert("Folder Id undefined");
    }
    else{
        getdocEdgeListChildrenApi(sessionId, id);
    }    
}