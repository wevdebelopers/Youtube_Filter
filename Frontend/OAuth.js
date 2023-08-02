const OAuth = document.querySelector('.header__account_photo');
let signed = 0 ;
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
window.history.pushState({}, document.title,"/Frontend/" + "index.html");

//storing data
let info = JSON.parse(localStorage.getItem("authInfo"));
console.log(info);

function logout()
{
  fetch("https://oauth2.googleapis.com/revoke?token=" + info['access_token'], {
    method:'POST',
    headers:{
      'Content-type':'application/x-www-form-urlencoded'
    }
  })
  .then((data) => {
    window.location.href = "http://127.0.0.1:5500/Youtube_Filter/Frontend/index.html";
  })
}
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

let channelContainer = document.getElementById("channelContainer");
console.log(channelContainer);
let OrgchannelElement = document.getElementsByClassName("sidebar__subInfo_card")[0];
console.log(OrgchannelElement);

let ApiKey = "&key=AIzaSyCN1SYd55iUhGcU5s6eR2wgxTVCcjsd6hE";
let chidApi = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true";
let ApiUrl = chidApi + "&pageToken=CAUQAA" + ApiKey;

let nextPageToken = "";
let res = 0;

async function getall(){
  for(let k = 0; k<100; k++)
  {
    let response = await fetch(ApiUrl,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })
    let returnedData = await response.json();
    getthedata(returnedData);
    console.log(res);
    if(res + returnedData.pageInfo.resultsPerPage == returnedData.pageInfo.totalResults)
      k = 101;
  }
} 
getall().catch(error => {
  console.log("error");
});

OrgchannelElement.remove();

function getthedata(returnedData)
{
    if(returnedData.length == 0)
      isEmpty = true;
    for(const element of returnedData.items)
    {
      res++;
      let text = element.snippet.title;
      const textNode = document.createTextNode(text);
      const urr = element.snippet.thumbnails.medium.url;
      let channelElement = OrgchannelElement.cloneNode(true);
      let elementOfChannelElement = channelElement.childNodes;
      //console.log(elementOfChannelElement);
      let channelImg = elementOfChannelElement[1].childNodes[1];
      let channelName= elementOfChannelElement[3];
      channelImg.setAttribute('src', urr);
      channelName.appendChild(textNode);
      //console.log(textNode);
      channelContainer.appendChild(channelElement);
      //console.log(channelContainer);
      channelElement.addEventListener('click', function(){
      let newLink = "https://www.youtube.com/channel/" + element.snippet.resourceId.channelId;
      let emb = document.getElementById('embedded');
      emb.setAttribute('src', newLink);
      })
    }
    nextPageToken = "&pageToken=" + returnedData.nextPageToken;
    ApiUrl = chidApi + nextPageToken + ApiKey;
}


// function getData(ApiUrl){
//   fetch(ApiUrl,{
//     headers:{
//       "Authorization":`Bearer ${info['access_token']}`,
//       "Accept": 'application/json'
//     }
//   })
//   .then((data) => {
//     return data.json();
//   }).then((returnedData) => {
//     console.log(returnedData);
//     console.log(ApiUrl);
//     if(returnedData.length == 0)
//       isEmpty = true;
//     for(const element of returnedData.items)
//     {
//       let text = element.snippet.title;
//       const textNode = document.createTextNode(text);
//       const urr = element.snippet.thumbnails.medium.url;
//       let channelElement = OrgchannelElement.cloneNode(true);
//       let elementOfChannelElement = channelElement.childNodes;
//       //console.log(elementOfChannelElement);
//       let channelImg = elementOfChannelElement[1].childNodes[1];
//       let channelName= elementOfChannelElement[3];
//       channelImg.setAttribute('src', urr);
//       channelName.appendChild(textNode);
//       //console.log(textNode);
//       channelContainer.appendChild(channelElement);
//       console.log(channelContainer);
//       channelElement.addEventListener('click', function(){
//       let newLink = "https://www.youtube.com/channel/" + element.snippet.resourceId.channelId;
//       window.location.href = newLink;
//       })
//     }
//     nextPageToken = "&pageToken=" + returnedData.nextPageToken;
//     ApiUrl = chidApi + nextPageToken + ApiKey;
//   })
// }









