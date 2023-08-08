/*--------------------------------------------------------------------------------*/

/*Setting the main window with respect to width of the left sidebar */

var setMainWindow = () => {
    const leftSidebar = document.querySelector('.sidebar__container');
    const root1 = document.querySelector(':root');

    root1.style.setProperty('--leftSpacing', `${leftSidebar.clientWidth+9}px`)
}

window.addEventListener('resize', setMainWindow);
//For intial load
window.addEventListener('DOMContentLoaded', setMainWindow);

/*--------------------------------------------------------------------------------*/

/*Setting main window width to take up remaining space*/

var setMainWindow_width = () => {
    const rightSidebar = document.querySelector('.rightSideBar__Container');
    const leftSidebar1 = document.querySelector('.sidebar__container');
    const root2 = document.querySelector(':root');
    const remWidth = window.innerWidth - rightSidebar.clientWidth - leftSidebar1.clientWidth - 7.5;

    root2.style.setProperty('--max-width-main', `${remWidth}px`);
}

window.addEventListener('resize', setMainWindow_width);
window.addEventListener('DOMContentLoaded', setMainWindow_width);

/*--------------------------------------------------------------------------------*/

/*Setting main window height to take up remaining space*/

var setMainWindow_height = () => {
    const header = document.querySelector('.headerContainer');
    const root3 = document.querySelector(':root');
    const remHeight = window.innerHeight - header.clientHeight-0.5;

    root3.style.setProperty('--height-main', `${remHeight}px`);
}

window.addEventListener('resize', setMainWindow_height);
window.addEventListener('DOMContentLoaded', setMainWindow_height);


/*--------------------------------------------------------------------------------*/

/*Setting video playback height*/

var setVideo_height = () => {
    const container = document.querySelector('.main__video_playback');
    const root4 = document.querySelector(':root');
    console.log("wd");
    console.log(container.clientWidth);
    console.log(container.clientHeight);
    //-20px -> considering padding too
    //const playback_Height = ((container.clientWidth)*9)/16;
    //root4.style.setProperty('--video-playback-height', `${playback_Height}px`);
}

window.addEventListener('resize', setVideo_height);
window.addEventListener('DOMContentLoaded', setVideo_height);

/*--------------------------------------------------------------------------------*/