var serverAddress = ''
window.onload = function() {

    // Get code
    var url = window.location.search;

    if (url.indexOf('?') != -1) {
        
        if (url.split('?')[1].split('&').length < 2) return;

        var code = url.split('?')[1].split('&')[0].split('=')[1];

        var httpRequest = new XMLHttpRequest(),
            url = "/wechat/getUserName?code=" + code;

        if (!httpRequest) {
            cosole.log("Cannot create an XMLHTTP instance")
            return false;
        }

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var response = JSON.parse(httpRequest.responseText);
                    if (response.nickname != undefined) localStorage.setItem("nickname", response.nickname);
                } else {
                    // alert('There was a problem with the request.');
                }
            }
        }

        httpRequest.open('GET', url);
        httpRequest.setRequestHeader('Content-Type', "application/json");
        httpRequest.send();
    }

    var height = document.getElementsByClassName('bullet-content')[0].offsetHeight,
        width = document.getElementsByClassName('bullet-content')[0].offsetWidth,
        bullet = ["Hello, World!"],
        counter = 0,
        color = ['#000', '#337ab7', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f'],
        maxDuration = 8000,
        minDuration = 5000;

    var screen = document.getElementsByClassName('bullet-content')[0];

    for (var i = 0; i < bullet.length; i++) {
        pushBulletContent(bullet[i]);
    }

    // Push bullet content to the screen
    function pushBulletContent(bulletContent) {
        var elem = document.createElement("div");

        elem.style.width = (4 * width) + "px";
        elem.style.color = color[counter % color.length];
        elem.style.fontSize = "1.2rem";
        elem.style.position = "absolute";
        elem.style.top = (height / 10 * Math.random() * ( 9 - 0 )) + "px";
        elem.style.left = width + "px";
        elem.innerHTML = bulletContent;

        if (bulletContent.length <= 25) 
            elem.className = "move_25";
        else
            elem.className = "move_50";

        screen.appendChild(elem);
        
        counter++;
    }

    var pushBulletContentListener = function(e) {

        if (e.type != 'click' && e.type != 'keypress') return;
        if (e.type == 'keypress' && e.which != 13) return; 

        var bulletContent = document.getElementsByClassName('bullet-input')[0].value;
    
        if (bulletContent.length == 0) return;

        if (bulletContent.length > 50) {
            alert("弹幕字数超出50个字！");
            return;
        }

        if (localStorage.getItem("nickname") == null || localStorage.getItem("nickname") == "undefined") {
            pushBulletContent(bulletContent);
        } else {
            pushBulletContent(localStorage.getItem("nickname") + ": " + bulletContent);
        }

        document.getElementsByClassName('bullet-input')[0].value = "";
        
    }
    
    // Add click listener on submit button
    document.getElementsByClassName('submit-btn')[0].addEventListener("click", pushBulletContentListener, false);

    // Add keypress listener on input (check "Enter" press)
    document.getElementsByClassName('bullet-input')[0].addEventListener("keypress", pushBulletContentListener, false);

}