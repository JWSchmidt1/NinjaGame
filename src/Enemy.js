import { gsap } from "gsap";
import setRandomInterval from "set-random-interval";
import * as PIXI from "pixi.js"
import { Spine, spine } from "pixi-spine";

export default class Enemy {

    constructor(items) {

        console.log(items);

        this.resname = items.name;
        this.container = items.addTo;

        this.startFrom = 0;
        this.endAt = 0;
        this.front = 0;
        this.enemyArray = [];
        this.enemyDuration = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40, 50];
        this.from = ["left", "right"]

        this.counter = 0;

        const interval = setRandomInterval(() => {

            this.counter++;

            let getFrom = this.from[Math.floor(Math.random() * this.from.length)];
            
            if(getFrom == "left") {

                this.startFrom = -400;
                this.endAt = 1700;
                this.front = -1;

            }else {

                this.startFrom = 1700;
                this.endAt = -400;
                this.front = 1;

            };

            this.enemyContainer = new PIXI.Container();
            this.enemyContainer.data = this.enemyDuration[Math.floor(Math.random() * this.enemyDuration.length)];
            this.enemyContainer.alive = true;
            this.enemyContainer.id = this.counter;
            this.enemyContainer.x = this.startFrom;
            this.enemyContainer.y = 768 - 50;
            this.enemyContainer.scale.x = this.front;
            this.enemyContainer.zIndex = 1;
            this.container.addChild(this.enemyContainer);
            this.enemyArray.push(this.enemyContainer);

            const alienEnemy = new Spine(this.resname.spineData);
            alienEnemy.x = 0;
            alienEnemy.y = 0;
            alienEnemy.state.setAnimation(0, 'walk', true);
            this.enemyContainer.addChild(alienEnemy);

            const hitarea = new PIXI.Graphics();
            hitarea.beginFill(0xDE3249);
            hitarea.drawRect(-25, -75, 50, 50);
            hitarea.alpha = .5;
            hitarea.endFill();
            this.enemyContainer.addChild(hitarea);

            gsap.to(this.enemyContainer, {

                duration: this.enemyContainer.data,
                x: this.endAt,
                ease: "Power0.easeNone",
                onComplete: () => {

                    this.container.removeChild(this.enemyArray[0]);
                    this.enemyArray.shift();

                } // END onComplete

            }); // END gsap

            console.log(alienEnemy);

        }, 1000, 5000); // END interval

    }; // END constructor

    get enemies() {

        return this.enemyArray;

    };

}; // END class