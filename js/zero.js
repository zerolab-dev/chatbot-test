document.addEventListener("DOMContentLoaded",async()=>{
 await loadKnowledge();
 const form=document.getElementById("zero-form"),input=document.getElementById("zero-input"),conversation=document.getElementById("zero-conversation"),app=document.querySelector(".zero-app");
 function addMessage(text,role,action=null){
  const wrap=document.createElement("div");wrap.className=`message ${role}`;
  const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;wrap.appendChild(bubble);
  if(action){const a=document.createElement("a");a.className="zero-action";a.textContent=action.label;a.href=action.target;
   if(action.type==="open_external"){a.target="_blank";a.rel="noopener noreferrer";}wrap.appendChild(a);}
  conversation.appendChild(wrap);conversation.scrollTop=conversation.scrollHeight;
 }
 function send(){const text=input.value.trim();if(!text)return;app.classList.add("chat-active");addMessage(text,"user");input.value="";input.style.height="auto";const r=findKnowledge(text);setTimeout(()=>addMessage(r.response,"zero",r.action),250);}
 form.addEventListener("submit",e=>{e.preventDefault();send();});
 input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}});
 input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,140)+"px";});
});