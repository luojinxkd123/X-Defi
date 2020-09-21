//-------------------------------------------------------------------------------------------------//脚本参数
//解锁密码
var unLockPass=[1,4,7,8,9,6];
//是否开启解锁
var openUnLock=false;
//app运行超时时间[毫秒]
var timeOut=1*60*1000; //默认1分钟
//设备名称
var deviceName="nova3";//nova3,mi5s,minote
//--------------------------------------------------------------------------------------------------//脚本参数
//apps
var apps=[
    "X-DeFi",
    "X-DeFi分身1",
    '下线1','下线2','下线3','下线4','下线5','下线6','下线7','下线8','下线9','下线10',
    '下线11','下线12','下线13','下线14','下线15','下线16','下线17','下线18','下线19','下线20',
    '下线21','下线22','下线23','下线24','下线25','下线26','下线27','下线28','下线29','下线30',
    '下线31','下线32','下线33','下线34','下线35','下线36','下线37','下线38','下线39','下线40',
    '下线41','下线42','下线43','下线44','下线45','下线46','下线47','下线48','下线49','下线50'
];

//全局屏幕宽度、高度
var width=device.width;
var height=device.height;

//唤醒解锁屏幕
if(openUnLock){
    doUnLock();
}
log('检查是否启动无障碍模式')
//检查是否启动无障碍模式
auto.waitFor();
home();
closeApp();
//开始收矿
for(i=0;i<apps.length;i++){
    log('4444')
    var lunchResult=startThreadRunApp(apps[i]);
    var isSuccess=lunchResult.isSuccess;
    var isNeedReLunch=lunchResult.isNeedReLunch;
    var lunchLog=lunchResult.lunchLog;
    if(!isSuccess){
        sendEmail("("+deviceName+")"+apps[i]+":"+lunchLog);
    }
    closeApp();
}

/**
 * 开启一个线程运行app
 * @param {*} appName 
 */
function startThreadRunApp(appName){
    var errorMsg="";
    var appTimeOut=timeOut;
    console.log("**开启app线程执行["+appName+"]");
    var start = new Date().getTime();
    
    var appThread = threads.start(function(){
        try{
            startApp(appName);
        }catch(error){
            console.log(error.stack);
            errorMsg=error.message;
        }
    });
    console.log("主线程进入等待.............");
    appThread.join(appTimeOut);//如果子线程过久没有执行完成,则主线程继续运行
    var end =new Date().getTime();
    console.log("主线程等待完毕,耗时："+(end-start)+"mm");
    if(appThread!=null){
        console.log("**杀死app线程["+appName+"]");
        appThread.interrupt();
    }
    if(end-start>=appTimeOut){
        return new LunchResult(false,false,"[错误信息]:超时了");
    }else if(errorMsg!=""){
        return new LunchResult(false,false,"[错误信息]:"+errorMsg);
    }
    return new LunchResult(true,false,"完成任务");
}
/**
 * 开始应用
 * @param {*} appName 
 */
function startApp(appName){
    console.log("------------[appName:"+appName+"] 开始运行------------");
    var status=app.launchApp(appName);
    if(status){
        console.log("["+appName+"]运行成功");
    }else{
        console.log("["+appName+"]应用不存在");
        throw new Error("运行失败，应用不存在");
    }
    var welcome=text("跳过").findOne(5000);
    if(welcome!=null){
        var welcomeRect=welcome.bounds();
        click(welcomeRect.centerX(),welcomeRect.centerY());
        log("点击跳过");
    }
    //首页加载
    console.log("检查首页加载状况......");
    if(text("领取").findOne(10000)==null){//如果10s加载不到，需要检测原因
        var login=text("登录").findOnce();
        if(login!=null){
            console.log("登录失效...");
            throw new Error("登录失效...");
        }
        if(text("领取").findOnce()!=null){
            console.log("首页加载失败...");
            throw new Error("restart,首页加载失败...");
        }
    }
    //挖矿
    console.log("挖矿");
    var get=text("领取").findOnce();
    if(get!=null){
        for(var i=0;i<8;i++){
            var getWorkRect=get.bounds();
            click(getWorkRect.centerX(),getWorkRect.centerY());
            sleep(500);
        }
    }
    console.log("------------[appName:"+appName+"] 结束运行------------");
}

/**
 * 发送邮件
 * @param {*} msg 
 */
function sendEmail(msg){

}
/**
 * 唤醒解锁手机
 */
function doUnLock(){
    console.log("唤醒解锁手机");
    device.wakeUpIfNeeded();
    sleep(2000);
    swipe(width/2,height-500,width/2,0,random(16,18*50));
    for(i=0;i<unLockPass.length;i++){
        desc(unLockPass[i]).findOne().click();
        sleep(500);
    }
}

/**
 * 关闭应用
 */
function closeApp(){
    home();
    sleep(1500);
    recents();
    sleep(1500);
    var btn=id("clear_all_recents_image_button").findOnce();
    if(deviceName=="nova3"){
        btn=id("clear_all_recents_image_button").findOnce();
    }else if(deviceName=="mi5s"){
        btn=id("clearAnimView").findOnce();
    }else if(deviceName=="minote"){
        btn=text("全部清除").findOnce();
    }
    if(btn!=null){
        var btnRect=btn.bounds();
        click(btnRect.centerX(),btnRect.centerY());
    }else{
        home();
    }
    sleep(2000);
}

/**
 * 运行结果对象
 * @param {*} isSuccess 是否运行成功
 * @param {*} isNeedReLunch  是否需要重新运行
 * @param {*} lunchLog 运行结果日志
 **/
function LunchResult(isSuccess,isNeedReLunch,lunchLog){
    this.isSuccess=isSuccess;
    this.isNeedReLunch=isNeedReLunch;
    this.lunchLog=lunchLog;
}