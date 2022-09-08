import * as PIXI from 'pixi.js';
import Stage from './Stage';
import { gsap } from 'gsap';
import { Howl } from 'howler'
import Enemy from './Enemy';
import HitTest from './HitTest';

export default class Game {

  constructor() {

    this.enemy;

    this.myStage = new Stage();
    this.scene = this.myStage.scene;
    this.scene.sortableChildren = true;
    this.background = this.myStage.bg;
    this.si = this.myStage.stageInfo;

    let assets = [

      '../assets/spritesheet/ninjarack.json',
      '../assets/images/background.jpg',
      '../assets/images/ninja-jump.png',
      '../assets/images/play.png',

    ];

    const loader = PIXI.Loader.shared
    .add(assets)
    .add('alienspine', '../assets/spritesheet/alien-spine/alienboss.json')
    .load((loader, res) => {

      let bgTexture = PIXI.Texture.from('../assets/images/background.jpg');
      let _bg = new PIXI.Sprite(bgTexture);
      this.background.addChild(_bg);

      let sheet = PIXI.Loader.shared.resources['../assets/spritesheet/ninjarack.json'].spritesheet;

      this.ninja = new PIXI.AnimatedSprite(sheet.animations['alien']);
      this.ninja.anchor.set(0.5);
      this.ninja.x = 512;
      this.ninja.y = 768 - 150;
      this.ninja.interactive = true;
      this.ninja.zIndex = 2;
      this.ninja.animationSpeed = 0.5;
      this.ninja.play();
      this.scene.addChild(this.ninja);

      this.si.app.stage.interactive = true;

      this.si.app.stage.on('pointerdown', (event) => {

        this.ninja.stop();

        this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-jump.png');

        let newPosition = event.data.getLocalPosition(this.background);
        
        console.log(newPosition);

        gsap.to(this.ninja, {

          duration: 0.2,
          x: newPosition.x - 300,
          y: newPosition.y,
          ease: "circ.easeOut",
          onComplete: () => {

            gsap.to(this.ninja, {

              duration: 0.3,
              x: 512,
              y: 768 - 150,
              ease: "Circ.easeOut"

            })

            this.ninja.play();

          } // END oncomplete

        }); // END gsap

        let mX = event.data.global.x;
        
        mX > this.si.appWidth/2 ? this.ninja.scale.x = -1 : this.ninja.scale.x = 1

        console.log(mX);

      }) // END eventListener

      let playTexture = PIXI.Texture.from('../assets/images/play.png');

      let play = new PIXI.Sprite(playTexture);
      play.anchor.set(.5);
      play.x = 512;
      play.y = 250;
      play.interactive = true;
      this.scene.addChild(play);

      let boxArray = [

        '../assets/images/left_box.png',
        '../assets/images/middle_box.png',
        '../assets/images/right_box.png'

      ];

      let boxXPos = [

        -200,
        350,
        900

      ];

      let boxYPos = [

        500,
        460,
        500

      ];

      boxArray.forEach((item, index) => {
        
        let boxes = PIXI.Texture.from(boxArray[index]);

        let boxSprite = new PIXI.Sprite(boxes);
        boxSprite.x = boxXPos[index];
        boxSprite.y = boxYPos[index];

        this.scene.addChild(boxSprite);

      });

      // let leftBox = PIXI.Texture.from('../assets/images/left_box.png');
      // let middleBox = PIXI.Texture.from('../assets/images/middle_box.png');
      // let rightBox = PIXI.Texture.from('../assets/images/right_box.png');

      

      // let whiteLight = PIXI.Texture.from('./assets/images/white-light.png');

      // let playWhiteLight = new PIXI.Sprite(whiteLight)
      // playWhiteLight.anchor.set(.5);
      // playWhiteLight.x = 545;
      // playWhiteLight.y = -210;
      // playWhiteLight.rotation = 0;
      // playWhiteLight.repeat = -1;
      // playWhiteLight.interactive = true;
      // this.scene.addChild(playWhiteLight)

      play.on('pointerdown', (event) => {

        event.stopPropagation();
        this.si.app.stage.interactive = true; 

        gsap.to(event.currentTarget, {
          duration: 0.5,
          delay:0.2,
          y: play.y - 350,
          ease: "Elastic.easeInOut",
        });

        let soundSwirp = new Howl({
          src:['./assets/sound/effekt_swish.mp3'],
          volume: 0.2,
        });

        let timerid = setTimeout(() => {
          soundSwirp.play();
          }, 300);

        let sound = new Howl({
          src:['./assets/sound/musicloop.mp3'],
          loop: true,
          volume: 0.5,
          musicLooper: setTimeout(() => {
            sound.play();
          }, 800)
        });

        this.enemy = new Enemy({

          name: res.alienspine,
          addTo: this.scene,

        });

      }); // END eventListener

    }); // END load

    this.ht = new HitTest();
    let ticker = PIXI.Ticker.shared;

    ticker.add(() => {

      console.log("ticker")

      if(this.enemy != undefined) {

        console.log("true");

      }else {

        console.log("undefined");

      };

    })
    
  }; // END constructor

}; // END class
