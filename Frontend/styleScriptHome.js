var setPreviewVideoHeight = () => {
    const videoContainerFront = document.querySelector('.front_thumbnail_container');
    const root1 = document.querySelector(':root');

    var height = videoContainerFront.clientWidth*9/16;
    root1.style.setProperty('--height-front-video-preview', `${height}px`);
}

window.addEventListener('resize', setPreviewVideoHeight);
window.addEventListener('DOMContentLoaded', setPreviewVideoHeight);


var setChannelPagePlaylistHeight = () => {
    const videoContainer = document.querySelector('.front_thumbnail_container');
    const root1 = document.querySelector(':root');

    var height = videoContainer.clientHeight;
    root1.style.setProperty('--height-playlist-rightinfo-container', `${height}px`);
    root1.style.setProperty('--height-playlist-right-title-container', `${height*(2/3)-4}px`);
    root1.style.setProperty('--height-playlist-right-btn-container', `${height*(1/3)+4}px`);
}

window.addEventListener('resize', setChannelPagePlaylistHeight);
window.addEventListener('DOMContentLoaded', setChannelPagePlaylistHeight);



const frontVideoBtn = document.querySelector('.front_video_section_title');
const frontPlaylistBtn = document.querySelector('.front_playlist_section_title');

var setWindowToVid = ()=> {
    const vidBlock = document.querySelectorAll('.channel_video_preview_container');
    const playlistBlock = document.querySelectorAll('.front_playlist');

    //make vidblock visible and hide playlist block
    vidBlock.forEach((item) => {
        item.style.display = "flex";
    })
    
    playlistBlock.forEach((item) => {
        item.style.display = "none";
    })

    frontVideoBtn.style.setProperty('border-color', 'white');
    frontPlaylistBtn.style.setProperty('border-color', '#0f0f0f');
}

var setWindowToPlaylist = ()=> {
    const vidBlock = document.querySelectorAll('.channel_video_preview_container');
    const playlistBlock = document.querySelectorAll('.front_playlist');

    //hide vidblock  and make playlist visible
    vidBlock.forEach((item) => {
        item.style.display = "none";
    })
    
    playlistBlock.forEach((item) => {
        item.style.display = "flex";
    })

    frontVideoBtn.style.setProperty('border-color', '#0f0f0f');
    frontPlaylistBtn.style.setProperty('border-color', 'white');
}

frontVideoBtn.addEventListener('click', setWindowToVid);
frontPlaylistBtn.addEventListener('click', setWindowToPlaylist);


const headerProfilePhoto = document.querySelector('.header__account_photo');
var profile_extended = 0;

headerProfilePhoto.addEventListener('click', () => {
    const logOutContainer = document.querySelector('.header__logout_container');
    if(profile_extended == 0){
        logOutContainer.style.display = 'block';
        profile_extended = 1;
    }else{
        logOutContainer.style.display = 'none';
        profile_extended = 0;
    }
})

//If clicked anywhere outside and profile is also extended -> retract
document.addEventListener('click', (event) => {
    const logOutContainer = document.querySelector('.header__logout_container');
    if(event.target.className != logOutContainer.className && profile_extended == 1 && event.target.className != headerProfilePhoto.className){
        profile_extended = 0;
        logOutContainer.style.display = 'none';
    }
})