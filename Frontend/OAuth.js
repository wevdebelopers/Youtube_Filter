// //Assuming user came from home page -> redirect to google login page
// let clickLoginBtn = () => {
//   console.log(signed);
//   if(signed === 0){
//     OAuth.click();
//   }  
// }
// window.addEventListener('load', clickLoginBtn);

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
        "scope" : "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube",
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
  //console.log(info);
  document.getElementById('image').setAttribute('src', info.picture);
})

// api key 
let ApiKey = "&key=AIzaSyCN1SYd55iUhGcU5s6eR2wgxTVCcjsd6hE";

//Fetching and Showing the subscribed channels list.
let channelContainer = document.getElementById("channelContainer");
let OrgchannelElement = document.getElementsByClassName("sidebar__subInfo_card")[0];
let subscriptionsApi = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true";
let subscriptionsUrl = subscriptionsApi + ApiKey;
let channelContentApi = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails"
let channelPlaylistApi = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails"
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

      let channelContentUrl = channelContentApi + "&id=" + element.snippet.resourceId.channelId + ApiKey;
      ShowChannelPage(channelContentUrl);

    })
  }
  let nextPageToken = '';
  if(returnedData.nextPageToken)
    nextPageToken = "&pageToken=" + returnedData.nextPageToken;
  subscriptionsUrl = subscriptionsApi + nextPageToken + ApiKey;
}
//

// fetching the user playlists
let playlistContainer = document.getElementById("playlistContainer");
let orgPlaylistElement = document.getElementById("playlistElement");
let playlistApi = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25";
let playlistItemApi = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25";
let playListUrl = playlistApi + "&mine=true" + ApiKey;
let playlistCount = 0;
let playlistItemCount = 0;
let currentPlaylist = document.getElementById("currentPlaylist");
let playlistVideoContainer = document.getElementById("playlistVideoContainer");
let orgPlaylistVideoContainer = playlistVideoContainer.cloneNode(true);
let OrgPlaylistVideoDiv = document.getElementById("playlistVideoDiv");
let smallVideoPlayback = document.getElementById("smallVideoPlayback");
let channelPageContainer = document.getElementById("channelPageContainer");
let opid = false;
let playlistIdsPlaylistId = "";

// Fetching and show user's Playlists

async function getPlaylist(URL){
  playlistCount = 0;
  playlistContainer.innerHTML = '';
  for(let k = 0; k<100; k++)
  {
    let response = await fetch(URL,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })

    let returnedData = await response.json();
    getPlaylistData(returnedData);
    if(returnedData.nextPageToken)
      playlistApi + "&mine=true" + + "&pageToken=" + returnedData.nextPageToken + ApiKey;
    else
      break;
  }

  if(opid === false)
  {
    let x = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus" + ApiKey;
    addPlaylistToLibrary(x);
    location.reload();
  }
} 
getPlaylist(playListUrl).catch(error => {
  console.log("playlist fetch error")
});

function getPlaylistData(returnedData)
{

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
    let channelDiv = playlistElement.childNodes[3].childNodes[3].childNodes[1];
    let imgDiv = playlistElement.childNodes[1].childNodes[1].childNodes[3];
    let videoCountDiv = playlistElement.childNodes[1].childNodes[1].childNodes[1];

    if(playlistTitle === "otherPlaylistIds")
    {
      playlistIdsPlaylistId = element.id;
      opid = true;
      idDescription = element.snippet.description;
      let newIds = idDescription.split(',');
      console.log(newIds.length);
      for(let i in newIds)
      {

        if(newIds[i].length < 10)
        {
          continue;
        }

        async function getpbi(xid)
        {
          let urlfId = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=" + xid + ApiKey;
          const res = await fetch(urlfId, 
          {
            headers:
            {
              'Authorization': `Bearer ${info['access_token']}`,
              'Accept': 'application/json',
            }
          });

          let ret = await res.json();

          let playlistTitle = ret.items[0].snippet.title;
          let channelTitle = ret.items[0].snippet.channelTitle;
          let thumbnail = ret.items[0].snippet.thumbnails.medium.url;
          //let videoCount = ret.items[0].pageInfo.totalResults;
          let playlistTitleNode = document.createTextNode(playlistTitle);
          let channelTitleNode = document.createTextNode(channelTitle);
          //let videoCountNode = document.createTextNode(videoCount);
          let playlistElement = orgPlaylistElement.cloneNode(true);
          let titleDiv = playlistElement.childNodes[3].childNodes[1];
          let channelDiv = playlistElement.childNodes[3].childNodes[3];
          let imgDiv = playlistElement.childNodes[1].childNodes[1].childNodes[3];
          //let videoCountDiv = playlistElement.childNodes[1].childNodes[1].childNodes[1];

          titleDiv.appendChild(playlistTitleNode);
          channelDiv.appendChild(channelTitleNode);
          imgDiv.setAttribute('src', thumbnail);
          //videoCountDiv.appendChild(videoCountNode);
          playlistContainer.appendChild(playlistElement);

          playlistElement.addEventListener('click', function() {

            let playListItemUrl = playlistItemApi + "&playlistId=" + ret.items[0].id + ApiKey;

            currentPlaylist.childNodes[1].textContent = playlistTitle;
            currentPlaylist.childNodes[3].childNodes[1].textContent = channelTitle;
            //currentPlaylist.childNodes[3].childNodes[3].textContent = "1/" + videoCount;
            playlistVideoContainer.innerHTML = '';


            getPlaylistItem(playListItemUrl, res.id).catch(error => {
              console.log("playlist item fetch error");
            })
          })
        }
        getpbi(newIds[i]);
      }
      continue;
    }
    
    titleDiv.appendChild(playlistTitleNode);
    channelDiv.appendChild(channelTitleNode);
    imgDiv.setAttribute('src', thumbnail);
    videoCountDiv.appendChild(videoCountNode);
    playlistContainer.appendChild(playlistElement);

    playlistElement.addEventListener('click', function() {

      let playListItemUrl = playlistItemApi + "&playlistId=" + element.id + ApiKey;

      currentPlaylist.childNodes[1].textContent = playlistTitle;
      currentPlaylist.childNodes[3].childNodes[1].textContent = channelTitle;
      currentPlaylist.childNodes[3].childNodes[3].textContent = "1/" + videoCount;
      playlistVideoContainer.innerHTML = '';


      getPlaylistItem(playListItemUrl, element.id).catch(error => {
        console.log("playlist item fetch error");
      })
    })
  }
}
orgPlaylistElement.remove();

// Finding that plalist exist already or not

let idDescription;
let modifyPlaylistApiUrl = "https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus" + ApiKey;

function findId(des, id)
{
  let elements = des.split(",");
  console.log(elements);
  for(const i in elements)
  {
    if(elements[i] === id)
      return true;
  }
  return false;
}

// Updating the playlistIds in Description of otherPlaylistIds playlist

function updatePlaylistIds(modifyPlaylistApiUrl, Id, des)
{
  let temp = {
    id: Id,
    snippet: {
      title: "otherPlaylistIds",
      description: des,
    }
  }

  const response = fetch(modifyPlaylistApiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${info['access_token']}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
    },
    body: JSON.stringify(temp)
  });
  
  setTimeout(getPlaylist(playListUrl), 300);
  
}

// Creating and adding new playlist to library

async function addPlaylistToLibrary(apiUrl) {
    let temp = {
      snippet: {
        title: "otherPlaylistIds",
        description: "This is a sample playlist description.",
        tags: [
          "sample playlist",
          "API call"
        ],
        defaultLanguage: "en"
      },
      status: {
        privacyStatus: "private"
      }
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${info['access_token']}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify(temp)
    });
}

// 

// Fetching and Showing Playlist Videos

async function getPlaylistItem(URL, id){

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
    if(returnedData1.nextPageToken)
      URL = playlistItemApi + "&pageToken=" + returnedData1.nextPageToken + "&playlistId=" + id + ApiKey;
    else 
      break;
    
  }

  OrgPlaylistVideoDiv.remove();
}

function getPlaylistItemData(returnedData1){

  for(const element of returnedData1.items)
  {
    playlistItemCount++;

    if(element.snippet.title === "Private video")
      continue;
      
    let videoTitle = element.snippet.title;
    let channelTitle = element.snippet.channelTitle;
    let thumbnail = element.snippet.thumbnails.medium.url;
    let videoId = element.contentDetails.videoId;
    let playlistId = element.id;
    let videoDiv = OrgPlaylistVideoDiv.cloneNode(true);
    let videoUrl = "https://www.youtube.com/embed/" + videoId + "?&autoplay=1&rel=0";

    videoDiv.childNodes[5].childNodes[1].textContent = videoTitle;
    videoDiv.childNodes[5].childNodes[3].textContent = channelTitle;
    videoDiv.childNodes[1].textContent = playlistItemCount;
    videoDiv.childNodes[3].childNodes[1].childNodes[1].setAttribute('src', thumbnail);
    playlistVideoContainer.appendChild(videoDiv);

    videoDiv.addEventListener('click', function(){

      smallVideoPlayback.style.display = 'block';
      channelPageContainer.style.display = 'none';
      smallVideoPlayback.childNodes[1].childNodes[1].setAttribute('src', videoUrl);

    })
  }
}

// Fectcing and Showing ChannelPlaylists

async function getChannelPlaylists(URL, channelId)
{
  playlistCount = 0;

  for(let k = 0; k<100; k++)
  {
    let response = await fetch(URL,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })

    let returnedData = await response.json(); //console.log(returnedData);
    ShowChannelPlayList(returnedData);
    if(returnedData.nextPageToken)
      URL = channelPlaylistApi + "&pageToken=" + returnedData.nextPageToken + "&channelId=" + channelId + ApiKey;
    else 
      break;
  }
  orgChannelPlaylistDiv.remove();
}

let channelPageOuterContainer = document.getElementById("outerContainerChannelPage"); 
let channelPlaylistContainerDiv = document.getElementById("channelPlaylistContainer"); 
let tempPlaylistContainerDiv = channelPlaylistContainerDiv.cloneNode(true);
let orgChannelPlaylistDiv = document.getElementById("channelPlaylistDiv"); 

function ShowChannelPlayList(returnedData)
{
  for(const element of returnedData.items)
  {
    playlistCount++;

    let channelPlaylistDiv = orgChannelPlaylistDiv.cloneNode(true);
    let playlistTitle = element.snippet.title;
    let channelTitle = element.snippet.channelTitle;
    let thumbnail = element.snippet.thumbnails.medium.url;
    let videoCount = element.contentDetails.itemCount;
    let playlistTitleNode = document.createTextNode(playlistTitle);
    let channelTitleNode = document.createTextNode(channelTitle);
    let videoCountNode = document.createTextNode(videoCount);
    let addButton = channelPlaylistDiv.childNodes[1].childNodes[3].childNodes[3].childNodes[1];

    

    channelPlaylistDiv.childNodes[1].childNodes[1].childNodes[1].setAttribute('src', thumbnail);
    channelPlaylistDiv.childNodes[1].childNodes[1].childNodes[3].childNodes[3].appendChild(videoCountNode);
    // channelPlaylistDiv.childNodes[1].childNodes[3].appendChild(playlistTitleNode);
    channelPlaylistDiv.childNodes[1].childNodes[3].childNodes[1].appendChild(playlistTitleNode);
    channelPlaylistContainerDiv.appendChild(channelPlaylistDiv);
    
    let URL = playlistItemApi + "&playlistId=" + element.id + ApiKey;
    channelPlaylistDiv.addEventListener('click', ()=>{

      let tempUrl = "https://www.googleapis.com/youtube/v3/playlists?id=" + element.id + "&part=snippet";

      currentPlaylist.childNodes[1].textContent = playlistTitle;
      currentPlaylist.childNodes[3].childNodes[1].textContent = channelTitle;
      currentPlaylist.childNodes[3].childNodes[3].textContent = "1/" + videoCount;

      playlistVideoContainer.innerHTML = '';

      getPlaylistItem(URL, element.id);
    })

    addButton.addEventListener('click', ()=>{
      if(findId(idDescription, element.id) === false)
      {
        idDescription += ",";
        idDescription += element.id;
        updatePlaylistIds(modifyPlaylistApiUrl, playlistIdsPlaylistId, idDescription);
      }
    })
  }
}

// Fetching and Showing channel data

async function ShowChannelPage(URL)
{
  var elements = channelPlaylistContainerDiv.getElementsByClassName("channel_video_preview_container front_playlist");
  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }
  var elements = channelPlaylistContainerDiv.getElementsByClassName("channel_video_preview_container");
  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }

  
  smallVideoPlayback.style.display = 'none';
  channelPageContainer.style.display = 'block';


  let response = await fetch(URL)
  let returnedData2 = await response.json();
  let channelTitle = returnedData2.items[0].snippet.title;
  let channelProfileUrl = returnedData2.items[0].snippet.thumbnails.medium.url;
  let id = returnedData2.items[0].id;
  let playListUrl = channelPlaylistApi + "&channelId=" + id + ApiKey;
  let uploadPlaylistId = returnedData2.items[0].contentDetails.relatedPlaylists.uploads;
  let uploadPlaylistURL =  playlistItemApi + "&playlistId=" + uploadPlaylistId + ApiKey;

  channelPageContainer.childNodes[1].childNodes[1].setAttribute('src', channelProfileUrl);
  channelPageContainer.childNodes[1].childNodes[3].textContent = channelTitle;
  
  GetChannelVideos(uploadPlaylistURL, uploadPlaylistId);
  setWindowToVid();
  getChannelPlaylists(playListUrl, id);
}

// Fetching and Showing Subscribed channel Videos

let orgChannelVideoDiv = document.getElementById("channelVideoDiv");

async function GetChannelVideos(URL, uploadPlaylistId)
{
  for(let k = 0; k<2; k++)
  {
    let response = await fetch(URL,{
      headers:{
        "Authorization":`Bearer ${info['access_token']}`,
        "Accept": 'application/json'
      }
    })

    let returnedData = await response.json();
    ShowChannelVideos(returnedData);
    if(returnedData.nextPageToken)
      URL = playlistItemApi + "&pageToken=" + returnedData.nextPageToken + "&playlistId=" + uploadPlaylistId + ApiKey;
    else 
      break;
  }
  orgChannelVideoDiv.remove();
}

function ShowChannelVideos(returnedData)
{
  for(const element of returnedData.items)
  {
    if(element.snippet.title === "Private video")
      continue;
    if(element.snippet.title.includes("#shorts"))
      continue;
      
    let videoTitle = element.snippet.title;
    let thumbnail = element.snippet.thumbnails.medium.url;
    let videoId = element.contentDetails.videoId;
    let videoDiv = orgChannelVideoDiv.cloneNode(true);
    let videoUrl = "https://www.youtube.com/embed/" + videoId + "?&autoplay=1&rel=0";

    videoDiv.childNodes[1].childNodes[3].textContent = videoTitle;
    videoDiv.childNodes[1].childNodes[1].childNodes[1].setAttribute('src', thumbnail);
    channelPlaylistContainerDiv.appendChild(videoDiv);

    videoDiv.addEventListener('click', function(){

      smallVideoPlayback.style.display = 'block';
      channelPageContainer.style.display = 'none';
      smallVideoPlayback.childNodes[1].childNodes[1].setAttribute('src', videoUrl);

    })
  }
}


















