//log in using oauth2
const OAuth = document.querySelector('.header__account_photo');
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

//decoding url for accesstoken
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


//storing user data
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

//fetching user details
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

// api key 
let ApiKey = "&key=AIzaSyCN1SYd55iUhGcU5s6eR2wgxTVCcjsd6hE";

//Fetching the subscribed channels list.
let channelContainer = document.getElementById("channelContainer");
console.log(channelContainer);
let OrgchannelElement = document.getElementsByClassName("sidebar__subInfo_card")[0];
console.log(OrgchannelElement);
let subscriptionsApi = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true";
let subscriptionsUrl = subscriptionsApi + ApiKey;
let channelCount = 0;

async function getSubscription(){
  channelCount = 0;
  for(let k = 0; k<100; k++)
  {
    let response = await fetch(subscriptionsUrl,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })
    let returnedData = await response.json();
    getChannel(returnedData);
    if(channelCount + returnedData.pageInfo.resultsPerPage == returnedData.pageInfo.totalResults)
      k = 101;
  }
} 
getSubscription().catch(error => {
  console.log("subscription fetch error");
});

OrgchannelElement.remove();

function getChannel(returnedData)
{
  for(const element of returnedData.items)
  {
    channelCount++;
    let text = element.snippet.title;
    const textNode = document.createTextNode(text);
    const urr = element.snippet.thumbnails.medium.url;
    let channelElement = OrgchannelElement.cloneNode(true);
    let elementOfChannelElement = channelElement.childNodes;
    let channelImg = elementOfChannelElement[1].childNodes[1];
    let channelName= elementOfChannelElement[3];
    channelImg.setAttribute('src', urr);
    channelName.appendChild(textNode);
    channelContainer.appendChild(channelElement);
    channelElement.addEventListener('click', function(){
    let newLink = "https://www.youtube.com/channel/" + element.snippet.resourceId.channelId;
    window.location.href = newLink;
    })
  }
  let nextPageToken = "&pageToken=" + returnedData.nextPageToken;
  subscriptionsUrl = subscriptionsApi + nextPageToken + ApiKey;
}

// fetching the user playlists
let playlistContainer = document.getElementById("playlistContainer");
console.log(playlistContainer);
let orgPlaylistElement = document.getElementById("playlistElement");
let playlistApi = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true";
let playlistItemApi = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25";
let playListUrl = playlistApi + ApiKey;
let playlistCount = 0;
let playlistItemCount = 0;
let currentPlaylist = document.getElementById("currentPlaylist");
let playlistVideoContainer = document.getElementById("playlistVideoContainer");
let orgPlaylistVideoContainer = playlistVideoContainer.cloneNode(true);
let OrgPlaylistVideoDiv = document.getElementById("playlistVideoDiv");
let smallVideoPlayback = document.getElementById("smallVideoPlayback");
console.log(OrgPlaylistVideoDiv);
console.log(playlistVideoContainer);
console.log(currentPlaylist);
console.log(orgPlaylistElement);

async function getPlaylist(){
  playlistCount = 0;
  for(let k = 0; k<100; k++)
  {
    let response = await fetch(playListUrl,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })
    let returnedData = await response.json();
    getPlaylistData(returnedData);
    if(playlistCount + returnedData.pageInfo.resultsPerPage >= returnedData.pageInfo.totalResults)
      k = 101;
  }
} 
getPlaylist().catch(error => {
  console.log("playlist fetch error")
});

function getPlaylistData(returnedData)
{
  console.log(returnedData);
  for(const element of returnedData.items)
  {
    playlistCount++;
    let playlistTitle = element.snippet.title;
    let channelTitle = element.snippet.channelTitle;
    let thumbnail = element.snippet.thumbnails.medium.url;
    let videoCount = element.contentDetails.itemCount;
    let playlistTitleNode = document.createTextNode(playlistTitle);
    let channelTitleNode = document.createTextNode(channelTitle);
    let videoCountNode = document.createTextNode(videoCount);
    let playlistElement = orgPlaylistElement.cloneNode(true);
    let titleDiv = playlistElement.childNodes[3].childNodes[1];
    let channelDiv = playlistElement.childNodes[3].childNodes[3];
    let imgDiv = playlistElement.childNodes[1].childNodes[1].childNodes[3];
    let videoCountDiv = playlistElement.childNodes[1].childNodes[1].childNodes[1];
    titleDiv.appendChild(playlistTitleNode);
    channelDiv.appendChild(channelTitleNode);
    imgDiv.setAttribute('src', thumbnail);
    videoCountDiv.appendChild(videoCountNode);
    playlistContainer.appendChild(playlistElement);
    playlistElement.addEventListener('click', function() {
      let playListItemUrl = playlistItemApi + "&playlistId=" + element.id + ApiKey;
      currentPlaylist.childNodes[1].textContent = playlistTitle;
      currentPlaylist.childNodes[3].childNodes[1].textContent = channelTitle;
      playlistVideoContainer.innerHTML = '';
      getPlaylistItem(playListItemUrl).catch(error => {
        console.log("playlist item fetch error");
      })
    })
  }
}
orgPlaylistElement.remove();

async function getPlaylistItem(URL){
  playlistItemCount = 0;
  console.log(URL);
  for(let k = 0; k<100; k++)
  {
    let response = await fetch(URL,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })
    let returnedData1 = await response.json();
    getPlaylistItemData(returnedData1);
    if(playlistCount + returnedData1.pageInfo.resultsPerPage >= returnedData1.pageInfo.totalResults)
      k = 101;
  }
  OrgPlaylistVideoDiv.remove();
}

function getPlaylistItemData(returnedData1){
  console.log(returnedData1);
  for(const element of returnedData1.items)
  {
    playlistItemCount++;
    let videoTitle = element.snippet.title;
    let channelTitle = element.snippet.channelTitle;
    let thumbnail = element.snippet.thumbnails.medium.url;
    let videoId = element.contentDetails.videoId;
    let playlistId = element.id;
    let videoDiv = OrgPlaylistVideoDiv.cloneNode(true);
    videoDiv.childNodes[5].childNodes[1].textContent = videoTitle;
    videoDiv.childNodes[5].childNodes[3].textContent = channelTitle;
    videoDiv.childNodes[1].textContent = playlistItemCount;
    videoDiv.childNodes[3].childNodes[1].childNodes[1].setAttribute('src', thumbnail);
    playlistVideoContainer.appendChild(videoDiv);
    let videoUrl = "https://www.youtube.com/embed/" + videoId;
    //"&list=" + playlistId
    //videoUrl = "http://127.0.0.1:5500/Frontend/video_playback.html";
    videoDiv.addEventListener('click', function(){
      //window.location.href = videoUrl;
      smallVideoPlayback.style.display = 'block';
      //let hqThumbnail = element.snippet.thumbnails.medium.url;
      //smallVideoPlayback.childNodes[1].childNodes[1].setAttribute('src', hqThumbnail);
      smallVideoPlayback.childNodes[1].childNodes[1].setAttribute('src', videoUrl);
    })
  }
}











