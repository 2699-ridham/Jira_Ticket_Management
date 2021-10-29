var uid = new ShortUniqueId();
// console.log(uid());
// variables
let colors=["pink","blue","green","black"];
let defaultColor="black";
let cFilter="";
let locked = "false";
let deleteMod=false;
// let islocked="false";
// elements
let input=document.querySelector(".input-task");
let mainContainer=document.querySelector(".main-container");
let colorContainer = document.querySelector(".color-group_container"); //bubbling -> pure grp pr evnt listener lga dia taki 
let lockContainer=document.querySelector(".lock-container");
let unlockContainer=document.querySelector(".unlock-container");
let plusContainer=document.querySelector(".plus-container");
let deleteContainer=document.querySelector(".multiply-container");
let colorChooser=document.querySelector(".color_container");
let AllColorElements=document.querySelectorAll(".color_picker");
let modal=document.querySelector(".modal");
// event listners
input.addEventListener("keydown",function(e){
    if(e.code == "Enter" && input.value){
        // console.log("task Value",input.value);
        let id=uid();
        modal.style.display="none";
        createTask(id,input.value,true);
        input.value="";
    }
})

lockContainer.addEventListener("click",function(e){
    let numberOfElements=document.querySelectorAll(".task_main-container>div")
    for(let i=0;i<numberOfElements.length;i++){
        numberOfElements[i].contentEditable = false;
    }
    lockContainer.classList.add("active");
    unlockContainer.classList.remove("active"); // remove ki khass baat h li if clss is not there to remove then it will no shw any error;
})

unlockContainer.addEventListener("click",function(e){
    let numberOfElements=document.querySelectorAll(".task_main-container>div")
    for(let i=0;i<numberOfElements.length;i++){
        numberOfElements[i].contentEditable = true;
    }
    lockContainer.classList.remove("active");
    unlockContainer.classList.add("active");
})

deleteContainer.addEventListener("click",function(e){
    deleteMod =! deleteMod
    if(deleteMod){
        deleteContainer.classList.add("active");

    }else{
        deleteContainer.classList.remove("active");
    }
})

plusContainer.addEventListener("click",function(){
    modal.style.display = "flex";
})
function createTask(id,task,flag,color){
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class","task_container");
    mainContainer.appendChild(taskContainer);
    taskContainer.innerHTML = `
    <div class="task-header ${color?color:defaultColor}"></div>
    <div class="task_main-container">
        <h3 class="task_id">#${id}</h3>
        <div class="text" contentEditable = "true">${task}</div>
    </div>
    `;
    
    // funtionality 
    // local storage -> update content,color change,delete
    let taskHeader=taskContainer.querySelector(".task-header");
    let maintask=taskContainer.querySelector(".task_main-container>div");
    taskHeader.addEventListener("click",function(e){
        let cColor=taskHeader.classList[1];
        console.log(cColor);
        let idx=colors.indexOf(cColor);
        let nextIdx=(idx + 1) % 4;
        let nextColor=colors[nextIdx];
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor);

        //update color in local Storage;
        let IdWalElement=taskHeader.parentNode.children[1].children[0];
        let id=IdWalElement.textContent;
        id=id.split("#")[1];
        let taskString=localStorage.getItem("task");
        let taskArr=JSON.parse(taskString);
        for(let i=0;i<taskArr.length;i++){
            if(taskArr[i].id == id){
                taskArr[i].color = nextColor;
            }
        }
        localStorage.setItem("task",JSON.stringify(taskArr));
    })

    //update content in local storage
    maintask.addEventListener("blur",function(e){
        let content=maintask.textContent;
        let taskString=localStorage.getItem("task");
            let taskArr=JSON.parse(taskString);
            for(let i=0;i<taskArr.length;i++){
                if(taskArr[i].id == id){
                    taskArr[i].task = content;
                }
            }
            localStorage.setItem("task",JSON.stringify(taskArr));
    })
    
    //delete from local storage
    taskContainer.addEventListener("click",function(e){
        if(deleteMod == true){
            let taskString=localStorage.getItem("task");
            let taskArr=JSON.parse(taskString);
            for(let i=0;i<taskArr.length;i++){
                if(taskArr[i].id == id){
                    taskArr.splice(i,1);
                    localStorage.setItem("task",JSON.stringify(taskArr));
                    taskContainer.remove();
                    break;
                }
            }
        }
    })

    if(flag == true){
        let taskString=localStorage.getItem("task");
        let taskArr=JSON.parse(taskString) || [];
        let taskObj={
            id: id,
            task: task,
            color: defaultColor
        }
        taskArr.push(taskObj);
        localStorage.setItem("task",JSON.stringify(taskArr));
    }
    defaultColor = "black";
}

//filttering
// koi b color pr clk ho to chle called e.target;
colorContainer.addEventListener("click",function(e){
    let element = e.target;
    if(element != colorContainer){
        let filterCardColor=element.classList[1];
        filterCards(filterCardColor);
    }
})

colorChooser.addEventListener("click",function(e){
    let element = e.target;
    // console.log("element",element);
    if(element != colorContainer){
        let filterCardColor = element.classList[1];
        defaultColor = filterCardColor;
        //border change
        for(let i=0;i<AllColorElements.length;i++){
            //remove from all
            AllColorElements[i].classList.remove("selected");
        }
        //add
        element.classList.add("selected");
    }
})

// console.log(colorbtns);
// for(let i=0;i<colorbtns.length;i++){
//     colorbtns[i].addEventListener("click",function(){
//         let filterColorCard=colorbtns[i].classList[1];
//         console.log(filterColorCard);
//         filterCards(filterColorCard);
//     }) 
// }

function filterCards(filterColor){
    let alltaskCards=document.querySelectorAll(".task_container");
    if(cFilter != filterColor){
        for(let i=0;i<alltaskCards.length;i++){
            let taskHeader=alltaskCards[i].querySelector(".task-header");
            let taskColor=taskHeader.classList[1];
            if(taskColor == filterColor){
                alltaskCards[i].style.display = "block";
            }else{
                alltaskCards[i].style.display = "none";
            }
        }
        cFilter = filterColor;
    }else{
        cFilter="";
        for(let i=0;i<alltaskCards.length;i++){
            let taskHeader=alltaskCards[i].querySelector(".task-header");
            alltaskCards[i].style.display="block";
        }
    }
}

//check if any of the tasks are in local storage
//bring it to ui


(function () {
    // localStorage
    let tasks = JSON.parse(localStorage.getItem('task')) || [];
    for (let i = 0; i < tasks.length; i++) {
        let { id, task, color } = tasks[i];
        createTask(id, task, false, color);
    }
    modal.style.display="none";
})()

//local storage -> store the data without any expiry date;
// localStorage.setItem("todo","hello");
// localStorage.setItem("todo tomorrow","hello again");
// localStorage.setItem("todo yesterday","hello");
// localStorage.removeItem("todo tomo");
// let get=localStorage.getItem("todo tomorrow");
// console.log("getItem",get);
// let length=localStorage.length;
// console.log("length",length);

