
let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-container');
let mainCont = document.querySelector('.main-container');
let addFlag = false;
let textAreaCont = document.querySelector('.text-area');
let allPrioityColours = document.querySelectorAll('.priority-color')
let modalPriorityColor='lightpink';
let removeBtn = document.querySelector('.remove-btn');
let removeBtnFlag = false;
let colors = ['lightpink','lightgreen','lightblue','black'];
let toolBoxColors = document.querySelectorAll('.color')
let lockClass = 'fa-lock';
let unLockClass = 'fa-lock-open';
let ticketsArr=[];
if(localStorage.getItem('tickets')){
    ticketsArr = JSON.parse(localStorage.getItem('tickets'));
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.ticketTask,ticket.modalPriorityColor,ticket.ticketID);
    })
}


addBtn.addEventListener('click', function(){
    addFlag=!addFlag;
    if(addFlag==true){
        modalCont.style.display='flex';
    }else{
        modalCont.style.display='none';
    }
})

modalCont.addEventListener('keydown', function(e){
   
    let key=e.key;
    if(key=='Shift'){
        createTicket(textAreaCont.value,modalPriorityColor);
        modalCont.style.display='none';
        textAreaCont.value='';
    }

})

allPrioityColours.forEach(function(colorElem){
    colorElem.addEventListener('click',function(){
        allPrioityColours.forEach(function(priorityElem){
            priorityElem.classList.remove('active');
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0];
        console.log(modalPriorityColor);
    })
})

function handleLock(ticket,id,ticketTask){
    let ticketLockElem = ticket.querySelector('.ticket-lock');
    let ticketLockIcon = ticketLockElem.children[0];
    let ticketTaskArea = document.querySelector('.ticket-task')
    ticketLockIcon.addEventListener('click',function(){
        let ticketIdx = getIdx(id);
      
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass);
            ticketLockIcon.classList.add(unLockClass);
            ticketTaskArea.setAttribute('contenteditable',true);
        }else{
            ticketLockIcon.classList.remove(unLockClass);
            ticketLockIcon.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable',false);
        }
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem('tickets',JSON.stringify(ticketsArr))
    })
}

removeBtn.addEventListener('click',function(){
  removeBtnFlag = !removeBtnFlag;
  if(removeBtnFlag==true){
    removeBtn.style.color ='red';
  }else{
    removeBtn.style.color ='white';
  }
})
function handleDelete(ticket,id){
    ticket.addEventListener('click',function(){
        let idx = getIdx(id);
        if(!removeBtnFlag) return
    ticket.remove();
    ticketsArr.splice(idx,1);
    localStorage.setItem('tickets',JSON.stringify(ticketsArr));
    }) 

}

function handleColor(ticket,id){
    let ticketColorBand = ticket.querySelector('.ticket-color');
    ticketColorBand.addEventListener('click',function(){
        let ticketIdx = getIdx(id);
        let currentColor= ticketColorBand.classList[1];
         let currentColorIdx = colors.findIndex(function(color){
            return currentColor===color
         })
         currentColorIdx++;
         let newTicketColorIdx = currentColorIdx%colors.length;
         let newTicketColor = colors[newTicketColorIdx];
         ticketColorBand.classList.remove(currentColor);
         ticketColorBand.classList.add(newTicketColor);
         ticketsArr[ticketIdx].modalPriorityColor = newTicketColor;
         localStorage.setItem('tickets',JSON.stringify(ticketsArr));
    })
}

for(let i=0;i<toolBoxColors.length;i++){
 toolBoxColors[i].addEventListener('click',function(){
    let selectedToolBoxColor = toolBoxColors[i].classList[0];
    let filteredTicketsBox = ticketsArr.filter(function(ticket){
        return selectedToolBoxColor=== ticket.modalPriorityColor
    })
    let allTickets = document.querySelectorAll('.ticket-container')
    for(let i=0;i<allTickets.length;i++){
        allTickets[i].remove();
    }
    filteredTicketsBox.forEach(function(filteredTicket){
      createTicket(filteredTicket.ticketTask,filteredTicket.modalPriorityColor,filteredTicket.ticketID);
    }) 
 })
}

function getIdx(id){
    let ticketIdx = ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}

function createTicket(ticketTask,modalPriorityColor,ticketID){
    let id=ticketID || shortid();
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class','ticket-container');
    ticketCont.innerHTML=`
     <div class="ticket-color ${modalPriorityColor}"></div>
     <div class="ticket-id">${id}</div>
     <div class="ticket-task" >${ticketTask}</div>
     <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
     </div>
    `;
    mainCont.append(ticketCont);
    modalCont.style.display='none';
    handleLock(ticketCont,id,ticketTask);
    handleDelete(ticketCont,id);
    handleColor(ticketCont,id);
    if(!ticketID){
        ticketsArr.push({modalPriorityColor,ticketTask,ticketID:id});
        localStorage.setItem('tickets',JSON.stringify(ticketsArr));
    }
   
  
}



