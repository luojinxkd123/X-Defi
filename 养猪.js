//全局参数
//是否可以添加猪
var canAdd=true;
//广告用尽添加时间间隔(分钟)
var waitTime=5;
//是否正在玩大转盘
var isPlayGame=false;
//玩游戏时间间隔
var playWaitTime=0.5;
//全局屏幕宽度、高度
var width=device.width;
var height=device.height;
//开启添加猪线程
var add=threads.start(function(){
    log("**开启添加猪线程");
    sleep(3000);
    while(true){
        if(!isPlayGame && canAdd){
            clickAddPig();
        }else{
            sleep(5000);
            var adverUseUpBtn=text("视频次数不足").findOnce();
            if(adverUseUpBtn!=null){
                while(true){
                    sleep(1000);
                    back();
                    log("视频次数已用尽");
                    sleep(500);
                    if(text(adverUseUpBtn.text()).clickable().findOnce()==null){
                        break;
                    }
                }
            }
        }
    }
});
//开启合成点击线程
var merge=threads.start(function(){
    log("**开启合成点击线程");
    sleep(3000);
    while(true){
        if(!isPlayGame){
            clickAutoCombinePig();
        }
    }
});
//开启点击确定线程
var confirm=threads.start(function(){
    log("**开启点击确定线程");
    sleep(3000);
    while(true){
        if(!isPlayGame){
            clickConfirm();
        }
    }
});

//开启看广告线程
var advertise=threads.start(function(){
    log("**开启看广告线程");
    sleep(3000);
    while(true){
        if(!isPlayGame){
            seeAdvertisement();
        }
    }
}); 

//开启大转盘线程
var game=threads.start(function(){
    log("**开启大转盘线程");
    sleep(3000);
    while(true){
        palyGame();
    }
}); 

/**
 * 玩转盘游戏
 */
function palyGame(){
    var palyGame =id("fl_defense").clickable(true).findOnce();
    if(palyGame!=null){
        var palyGameRect=palyGame.bounds();
        click(palyGameRect.centerX(),palyGameRect.centerY());
        log("点击进入游戏成功");
        sleep(3000);
    }
    while(true){
        var playBtn=id("lav_button").clickable(true).findOnce();
        if(playBtn!=null){
            isPlayGame=true;//正在游戏
            var playBtnRect=playBtn.bounds();
            click(playBtnRect.centerX(),playBtnRect.centerY());
            log("点击玩游戏成功");
            sleep(5000);
            if(id(playBtn.id()).clickable(true).findOnce()==null){//游戏机会充足
                click(width/2,height*3/5);
                sleep(3000);
                clickConfirm();
                sleep(2000);
            }
            var adverUseUpBtn=text("战斗能量不足").findOnce();
            if(adverUseUpBtn!=null){//游戏机会用尽
                while(true){
                    if(id("fl_defense").clickable(true).findOnce()==null){
                        sleep(1000);
                        back();
                        log("点击返回");
                        sleep(1000);
                    }else{
                        break;
                    }
                }
                isPlayGame=false;//游戏结束
                log("游戏结束，进入"+playWaitTime+"分钟等待");
                sleep(playWaitTime*60*1000);
            }
        }else{
            break;
        }
    }
}
/**
 * 点击确定
 */
function clickConfirm(){
    var confirmBtn=text("确定").clickable(true).findOnce();
    if(confirmBtn!=null){
        var confirmBtnRect=confirmBtn.bounds();
        click(confirmBtnRect.centerX(),confirmBtnRect.centerY());
        log("点击确定成功");
        sleep(1000);
    }
}
/**
 * 点击添加猪
 */
function clickAddPig(){
    var addBtn=id("fl_tab").clickable(true).findOnce();
    if(addBtn!=null){
        var addBtnRect=addBtn.bounds();
        click(addBtnRect.centerX(),addBtnRect.centerY());
        log("添加小猪成功");
        sleep(random(500,1000));
    }
    
}
/**
 * 点击自动合成
 */
function clickAutoCombinePig(){
    if(textStartsWith("自动合成中").findOnce()==null){
        var combineBtn=id("fl_merge").clickable(true).findOnce();
        if(combineBtn!=null){
            var combineBtnRect=combineBtn.bounds();
            click(combineBtnRect.centerX(),combineBtnRect.centerY());
            log("点击合成");
            sleep(2000);
        }
        //针对VIP用户情况
        var adverVipBtn=text("免广告开启").clickable(true).findOnce();
        if(adverVipBtn!=null){
            while(true){
                var adverVipBtnRect=adverVipBtn.bounds();
                click(adverVipBtnRect.centerX(),adverVipBtnRect.centerY());
                log("vip免看视频");
                sleep(500);
                if(text(adverVipBtn.text()).clickable().findOnce()==null){
                    break;
                }
            }
        }
    }
}
/**
 * 看广告
 */
function seeAdvertisement(){
    var adverUseUpBtn=text("视频次数不足").findOnce();
    if(adverUseUpBtn!=null){
        while(true){
            sleep(1000);
            back();
            log("视频次数已用尽");
            sleep(500);
            if(text(adverUseUpBtn.text()).clickable().findOnce()==null){
                canAdd=false;
                log("关闭添加猪的开关，"+waitTime+"分钟后开启猪添加");
                sleep(waitTime*60*1000);//*分钟后后才开启添加猪的开关
                canAdd=true;
                break;
            }
        }
    }
    var adverBtn=text("看视频领取").clickable(true).findOnce();
    if(adverBtn==null){
        adverBtn=text("看视频开启").clickable(true).findOnce();
    }
    if(adverBtn!=null){
        while(true){
            var adverBtnRect=adverBtn.bounds();
            click(adverBtnRect.centerX(),adverBtnRect.centerY());
            log("点击看视频");
            sleep(500);
            if(text(adverBtn.text()).clickable().findOnce()==null){
                break;
            }
        }
         //点击关闭视频按钮
         while (true) {
            log("看视频中....");
            sleep(2000);
            if (className("android.widget.ImageView").clickable(true).drawingOrder(2).findOne(1000)) {
                关闭 = className("android.widget.ImageView").clickable(true).drawingOrder(2).findOne(500);
                关闭.click();
                log("点击=》关闭");
                break;
            };
            if (className("android.widget.RelativeLayout").clickable(true).drawingOrder(6).findOne(1000)) {
                关闭 = className("android.widget.RelativeLayout").clickable(true).drawingOrder(6).findOne(500);
                关闭.click();
                log("点击=》关闭");
                break;
            };
        };
        sleep(5000);
    }
}


