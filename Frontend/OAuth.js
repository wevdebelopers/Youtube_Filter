const OAuth = document.querySelector('.header__account_photo');
OAuth.addEventListener('click', function() {
    let oauth2ep = "https://accounts.google.com/o/oauth2/v2/auth";
    let form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", oauth2ep);
    let params = {
        "client_id" : "182985029199-aq3p34sjqeteo762eahvlllbpffjegns.apps.googleusercontent.com",
        "redirect_uri" : "http://127.0.0.1:5500/Youtube_Filter/Frontend/index.html",
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
});

// var url = window.location;
// var access_token = new URLSearchParams(window.location.hash).get('access_token');

let params = {};
let regex = /([^&=]+)=([^&]*)/g, m;
let authInfo;
while(m = regex.exec(window.location.hash))
{
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if(Object.keys(params).length > 0)
{
    localStorage.setItem("authInfo", JSON.stringify(params));
}

//hiding the access token
window.history.pushState({}, document.title,"/Youtube_Filter/Frontend/" + "index.html");

//storing data
let info = JSON.parse(localStorage.getItem("authInfo"));
console.log(info);

//calling API
fetch("https://www.googleapis.com/oauth2/v3/userinfo",{
  headers:{
    "Authorization":`Bearer ${info['access_token']}`
  }
})
.then((data) => data.json())
.then((info) => {
  console.log(info);
  document.getElementById('image').setAttribute('src', info.picture);
})

let channelList = [];
channelList[0] = document.querySelector("#ch1");
channelList[1] = document.querySelector("#ch2");
channelList[2] = document.querySelector("#ch3");
channelList[3] = document.querySelector("#ch4");
channelList[4] = document.querySelector("#ch5");

let pi = []
pi[0] = document.querySelector("#chi1");
pi[1] = document.querySelector("#chi2");
pi[2] = document.querySelector("#chi3");
pi[3] = document.querySelector("#chi4");
pi[4] = document.querySelector("#chi5");

fetch("https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&key=AIzaSyD9DQ5vZPpX8eWpF6z8-E7c1N2Ts8V4kAA",{
  headers:{
    "Authorization":`Bearer ${info['access_token']}`,
    "Accept": 'application/json'
  }
})
.then((data) => {
  return data.json();
}).then((returnedData) => {
  console.log(returnedData);
  let idx = 0;
  for(const element of returnedData.items)
  {
    let text = element.snippet.title;
    const textNode = document.createTextNode(text);
    channelList[idx].appendChild(textNode);
    const urr = element.snippet.thumbnails.medium.url;
    console.log(urr);
    pi[idx].setAttribute('src', urr);
    pi[idx].addEventListener('click', function(){
      let newLink = "https://m.youtube.com/channel/" + element.snippet.resourceId.channelId;
      console.log(newLink);
      window.location.href = newLink;
    })
    idx++;
  }
})






