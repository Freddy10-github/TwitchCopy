const Accept = 'application/vnd.twitchtv.v5+json';
const limit = 18;
const clientId = 'luz7ktst4nb0p2ur5eee2apvgmf837'; 
var nowIndex = 0 ;
var isLoading = false;

//https://github.com/Lidemy/forum/discussions/138#discussion-3400596

const getData = (cb) => {       
    const apiUrl = 'https://api.twitch.tv/kraken/streams/?game=League%20of%20Legends&limit=' + limit + '&offset=' + nowIndex;
    isLoading = true;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.setRequestHeader('Accept',Accept);
    xhr.setRequestHeader('Client-id',clientId);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200){
            var responseData =JSON.parse(this.responseText);
            cb(null, responseData);   
        }
}
}
const appendData = () => {
    getData((err, data) => {
        const streams = data.streams;
        const $row = $('.row');
        for (let index = 0; index < streams.length; index++) {
            $row.append(getColumn(streams[index]));        
        }
    })
    nowIndex += limit ;
    setTimeout(() => {isLoading = false;}, 1500);
    
}

const getColumn = data => {
    return `
    <div class="col" onclick="window.open('${data.channel.url}', '_blank')">
                <div class="preview"><img src="${data.preview.medium}" onload="this.style.opacity=1"></div>
                <div class="buttom">
                    <div class="manPhoto"><img src="${data.channel.logo}" onload="this.style.opacity=1"></div>
                    <div class="channel_info">
                        <div class="channel_name"> ${data.channel.status}</div>
                        <div class="channel_owner">${data.channel.display_name}</div>
                    </div>
                </div>
            </div>`;
}

appendData();
$(window).scroll(function(){
    //console.log($(window).scrollTop() + $(window).height());
    if($(window).scrollTop() + $(window).height()>= $(document).height()-300){
        //load new channel
        if(!isLoading)
            appendData();
    }        
})
