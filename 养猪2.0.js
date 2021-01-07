//全局参数
//广告用尽添加猪时间间隔(分钟)
var waitTime=5;
//是否正在玩大转盘
var isPlayGame=false;
//玩游戏时间间隔
var playWaitTime=5;
//全局屏幕宽度、高度
var width=device.width;
var height=device.height;

var lock = threads.lock();
//开启添加猪线程
var add=threads.start(function(){
    log("**开启添加猪线程");
    sleep(3000);
    while(true){
        if(!isPlayGame){
            clickAddPig();
        }else{
            sleep(5000);
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
        log("进入游戏");
        sleep(5000);
    }
    while(true){
        var playBtn=id("lav_button").findOnce();
        if(playBtn!=null){
            isPlayGame=true;//正在游戏
            var playBtnRect=playBtn.bounds();
            click(playBtnRect.centerX(),playBtnRect.centerY());
            log("点击开始作战");
            sleep(5000);
            var adverUseUpBtn=text("战斗能量不足").findOnce();
            if(adverUseUpBtn!=null){//游戏机会用尽
                log("战斗能量不足");
                if(textContains("剩余 0 次").findOnce()!=null){
                    log("剩余0次")
                    while(true){
                        if(id("fl_defense").clickable(true).findOnce()==null){
                            sleep(1000);
                            back();
                            log("点击返回");
                            sleep(2000);
                        }else{
                            break;
                        }
                    }
                    isPlayGame=false;//游戏结束
                    log("游戏结束，进入"+playWaitTime+"分钟等待");
                    sleep(playWaitTime*60*1000);
                    return;
                }else{
                    seeAdvertisement();
                }
            }
            //游戏机会充足
            if(text("提现").findOne(5000)==null&&textContains("剩余").findOnce()==null){
                while(true){
                    click(width/2,height*3/7);
                    log("游戏偷菜操作");
                    sleep(3000);
                    clickConfirm();
                    sleep(5000);
                    if(text("提现").findOnce()!=null){
                        break;
                    }
                }
            }
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
        sleep(random(500,3000));
        if(text("金币不足").findOnce()!=null){
            log("金币不足")
            if(textContains("剩余 0 次").findOnce()!=null){
                log("剩余0次");
                log("关闭添加猪，"+waitTime+"分钟后开启猪添加");
                sleep(2000);
                back();
                sleep(waitTime*60*1000);//*分钟后后才开启添加猪的开关
            }else{
                seeAdvertisement();
            }
        }
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
                sleep(1000);
                if(text(adverVipBtn.text()).clickable().findOnce()==null){
                    return;
                }
            }
        }
        seeAdvertisement();
    }
}
/**
 * 看广告
 */
function seeAdvertisement(){
    var adBtn=text("免广告获得").clickable(true).findOnce();
    if(adBtn!=null){
        while(true){
            var adBtnRect=adBtn.bounds();
            click(adBtnRect.centerX(),adBtnRect.centerY()); 
            log("免广告获得游戏次数");
            sleep(3000);
            if(text(adBtn.text()).clickable(true).findOnce()==null){
                break;
            }
        }
    }
    var adverBtn=textStartsWith("看视频").clickable(true).findOnce();
    if(adverBtn!=null){
        log(adverBtn)
        while(true){
            var adverBtnRect=adverBtn.bounds();
            click(adverBtnRect.centerX(),adverBtnRect.centerY());
            log("点击看视频");
            sleep(2000);
            if(text(adverBtn.text()).clickable(true).findOnce()==null){
                break;
            }
        }
         //点击关闭视频按钮
        while (true) {
            log("看视频中....");
            sleep(2000);
            // if (className("android.widget.ImageView").clickable(true).drawingOrder(2).findOne(1000)) {
            //     关闭 = className("android.widget.ImageView").clickable(true).drawingOrder(2).findOne(500);
            //     关闭.click();
            //     log("点击=》关闭");
            //     break;
            // };
            if (className("android.widget.RelativeLayout").clickable(true).drawingOrder(6).findOne(1000)) {
                关闭 = className("android.widget.RelativeLayout").clickable(true).drawingOrder(6).findOne(500);
                log(关闭);
                关闭.click();
                log("点击=》关闭");
                break;
            };
        };
    }
}


