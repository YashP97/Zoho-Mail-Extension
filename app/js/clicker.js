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
    document.getElementById('loginsection').style.display="none";
    document.getElementById('foldersection').style.display="flex";
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
        });

        divelement.addEventListener("dblclick", (e) => {            
            let elementid = e.target.id;
            console.log(elementid);
            listingdocEdgeFolderChildren(elementid);
        });

        container.appendChild(divelement);
    }
}

let listingdocEdgeFolderChildren = function(id){
    console.log("starts listingdocEdgeFolderChildren");
    console.log("sessionId = " + sessionId);    
    // if((sessionId === null || sessionId === "" || sessionId === undefined) && (id === null || id === "" || id === undefined)){
    //     console.log("sessionId not get");
    // }else{
        getdocEdgeListChildrenApi(sessionId, "98442272");
    // }    
}