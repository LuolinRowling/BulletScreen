'user strict'

var express = require('express'),
    bodyParser = require('body-parser'),
    https = require('https'),
    URL = require('url'),
    INFO = require('./token.json');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/wechat/getUserName', function(req, res) {
    console.log("/wechat/getUserName");

	var code = URL.parse(req.url, true).query.code;

    console.log("code: " + code);

    var responseText = "";

    https.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + INFO.appid + "&secret=" + INFO.appsecret + "&code=" + code + "&grant_type=authorization_code", (openidRes) => {

        openidRes.on('data', (d) => {
            responseText += d;
        });

        openidRes.on('end', () => {
            console.log(responseText);  

            var access_token = JSON.parse(responseText).access_token,
                openid = JSON.parse(responseText).openid,
                resText = "";

            https.get("https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN", function(nicknameRes) {
                nicknameRes.on('data', (d) => {
                    resText += d;
                })

                nicknameRes.on('end', () => {
                    console.log(resText)
                    var obj = {
                        nickname: JSON.parse(resText).nickname
                    }
                    console.log(obj);
                    res.send(obj);
                })
            }).on('error', (e) => {
                console.error(e);
            });
        });
        
    }).on('error', (e) => {
        console.error(e);
    });

});

app.post('/wechat/addBullet', function(req, res) {
    console.log('/wechat/addBullet');


    var username = req.body.openid,
        password = req.body.password;
        
    console.log('/')
});

app.listen(9999);
console.log('Listening on port 9999...');
