let a = ["to rediscover Youtube.", 
        "for minimal distractions.",
        "to unclutter your feed."]
let change_text_idx = 0;
let changeTextLen = a.length;
let changeText = ()=>{
    const textContainer = document.querySelector('.homepage_changing_text');

    change_text_idx = (change_text_idx+1)%changeTextLen;
    // textContainer.innerText = a[change_text_idx];
    textContainer.innerHTML = "";
    currAlp = 0;
    animateBackTime = 0;
}

let currAlp = 0;
let animateBackTime = 0;
let animateText = () => {
    const textContainer = document.querySelector('.homepage_changing_text');
    let currLen = a[change_text_idx].length;
    if(currAlp < currLen){
        let tempStr = textContainer.innerHTML;
        textContainer.innerHTML = tempStr.substring(0, tempStr.length-1);
        textContainer.innerHTML += a[change_text_idx][currAlp] + '&#9615;';
        currAlp++;
    }else{
        if(animateBackTime < 30){
            animateBackTime++;
        }else{
            let tempStr = textContainer.innerHTML;
            textContainer.innerHTML = tempStr.substring(0, tempStr.length-2) + '&#9615;';
        }
    }
}

setInterval(animateText, 45);
setInterval(changeText, 5000);


//From OAuth.js file
const OAuth = document.querySelector('.homepage_login_btn');
let signed = 0 ;
let currentLocation = window.location.href;
OAuth.addEventListener('click', function() {
  if(signed === 0)
  {
    let oauth2ep = "https://accounts.google.com/o/oauth2/v2/auth";
    let form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2ep);
    let params = {
        "client_id" : "182985029199-aq3p34sjqeteo762eahvlllbpffjegns.apps.googleusercontent.com",
        "redirect_uri" : "http://127.0.0.1:5500/Frontend/index.html",
        "response_type" : "token",
        "scope" : "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly",
        "include_granted_scopes" : "true",
        "state" : "pass-through-value"
    }
    for(var p in params)
    {
        let input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", p);
        input.setAttribute("value", params[p]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
    stats = 1;
    console.log('OAuth was clicked!');
    signed = 1;
  }
  else
  {
    // logout();
    // signed = 0;
  }
});