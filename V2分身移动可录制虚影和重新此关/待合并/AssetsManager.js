/*
 资源加载器
负责预加载游戏所需的所有资源（图片、音频、字体等）并提供全局访问接口。
确保在游戏开始前所有资源都已准备好，避免运行时加载导致的卡顿和错误。
*/

/*-----------声明全局变量来存储加载的资源-----------*/
//字体
let customFont;

//故事文案
let storyTexts;

//主页动图
let followerImg1;
let followerImg2;

//背景图bgImage
//背景图的地址全部在：
//assets\images\bg\...
let bgImageMenu;

//设置页背景图
let bgImageSettings;

//关卡选择页背景图
let bgImageLevelChoice;

//开场动画背景图
let bgImageOpeningScene;

//Credits页背景图
let bgImageCredits;


//关卡背景图
let bgImageLevel1;
let bgImageLevel2;

/*
let bgImage_cutscene;
let menuBGM;
let level1BGM;
let level2BGM;
let level3BGM;
let customFont;
let tileImage_ground;
let tileImage_platform;
let goalImage;

// 本体贴图（6方向）
let playerImg_right;
let playerImg_left;
let playerImg_up;
let playerImg_upRight;
let playerImg_upLeft;

// 分身贴图（6方向，文件名后加2）
let cloneImg_right;
let cloneImg_left;
let cloneImg_up;
let cloneImg_upRight;
let cloneImg_upLeft;

*/

//在 p5.js 中，preload() 是一个特殊的生命周期函数
// 它会在 setup() 之前自动执行
// 并且会等待所有异步加载任务完成后再调用setup()
// 确保资源在使用前已经准备好
function preload() {
/*-----------加载字体-----------*/
  customFont = loadFont('assets/fonts/HYPixel11pxU-2.ttf',
    () => console.log('字体加载成功'),
    (err) => console.warn('字体加载失败：', err)
  );

/*-----------加载故事文案-----------*/
  storyTexts = loadStrings('assets/text/story.txt',
    () => console.log('故事文案加载成功'),
    (err) => console.warn('故事文案加载失败：', err)
  );

/*-----------加载动图-----------*/
  followerImg1 = loadImage('assets/images/bg/follower1.png',
    () => console.log('动图加载成功'),
    (err) => console.warn('动图加载失败：', err)
  );
  followerImg2 = loadImage('assets/images/bg/follower2.png',
    () => console.log('动图加载成功'),
    (err) => console.warn('动图加载失败：', err)
  );


/*-----------加载背景图-----------*/

//菜单背景图
    bgImageMenu = loadImage('assets/images/bg/menu.png',
        () => console.log('菜单背景加载成功'),
        (err) => console.warn('菜单背景加载失败：', err)
    );

//设置页背景图
    bgImageSettings = loadImage('assets/images/bg/settings.png',
        () => console.log('设置页背景加载成功'),
        (err) => console.warn('设置页背景加载失败：', err)
    );
//关卡选择页背景图
    bgImageLevelChoice = loadImage('assets/images/bg/level_choice.png',
        () => console.log('关卡选择页背景加载成功'),
        (err) => console.warn('关卡选择页背景加载失败：', err)
    );

//开场动画背景图
    bgImageOpeningScene = loadImage('assets/images/bg/opening_scene.png',
        () => console.log('开场动画背景加载成功'),
        (err) => console.warn('开场动画背景加载失败：', err)
    );

//Credits页背景图
    bgImageCredits = loadImage('assets/images/bg/credits.png',
        () => console.log('Credits页背景加载成功'),
        (err) => console.warn('Credits页背景加载失败：', err)
    );

//关卡背景图
    bgImageLevel1 = loadImage('assets/images/bg/level1.png',
        () => console.log('关卡1背景加载成功'),
        (err) => console.warn('关卡1背景加载失败：', err)
    );
    bgImageLevel2 = loadImage('assets/images/bg/level2.png',
        () => console.log('关卡2背景加载成功'),
        (err) => console.warn('关卡2背景加载失败：', err)
    );
  
}