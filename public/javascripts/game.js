// startup
let phaserGame;

let music;
let btnList;
let game;
let sound;
let score;

function register_music(){
    switch(this.dataset.musicNumber){
        
        case "1":
            number = 1;
            src = 'BKOJ001_91BPM.mp3';
            note = 'BKOJ001_91BPM.json';
            time = 75000;
            bpm = 91;
            first_ts = 11300;
            break;
        case "2":
            number = 2;
            src = 'BKOJ002_81BPM.mp3';
            note = 'BKOJ002_81BPM.json';
            time = 96000;
            bpm = 81;
            first_ts = 1200;
            break;
        case "3":
            number = 3;
            src = 'BKOJ003_120BPM.mp3';
            note = 'BKOJ003_120BPM.json';
            time = 48500;
            bpm = 120;
            first_ts = 8600;
            break;
        case "4":
            number = 4;
            src = 'canon.mp3';
            note = 'canon.json';
            time = 87000;
            bpm = 90;
            first_ts = 11500;
            break;
        default:
            throw new Error('Not registered music number');
    }
    music = new Music(number, src, note, time);
}

function sleep(waitMsec) {
    var startMsec = new Date();
   
    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
  }

function tearDown(){
    game.destroy(removeCanvas=true);
}

btnList = document.querySelectorAll(".btn-selector")
for(let i=0; i<btnList.length; i++) {
    btnList[i].addEventListener('click', register_music);
}

closeBtn = document.querySelector(".btn-close");
closeBtn.addEventListener('click', tearDown);

modal = document.getElementById("exampleModal");
modal.addEventListener("shown.bs.modal", () => {
    if (phaserGame == null) {
        phaserGame = new PhaserGame();
    }
    phaserGame.init();
});

class Music {
    
    constructor(number, src, note, time){
        this.number = number;
        this.src = src;
        this.note = note;
        this.time = time; 
    }
}

class PhaserGame {
    init() {
        let config = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: 'modal-body',
            width: 1920,
            height: 1080,
            scene: MenuScene,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
        };

        game = new Phaser.Game(config);
    }
}

/**
 * First Scene: html games require user to focus the window (click or key down) before playing audio so we do this
 */
class MenuScene {
    create() {
        this.text = this.add.text(
            1920 / 2,
            1080 / 2,
            "SPACEで開始",
            { fontFamily: "arial", fontSize: "100px" }
        );
        this.text.setOrigin(0.5, 0.5);
    }

    update() {
        if (isKeyPressed("Space")) {
            this.scene.add("main", MainScene);
            this.scene.start("main");
        }
    }
}

class MainScene {
    preload() {
        console.log(music.src);
        this.load.audio("music", "/musics/" + music.src);
        this.load.image("Stamp", "/images/nikukyu.png");
        this.load.image("KeyA", "/images/keyA.png");
        this.load.image("KeyB", "/images/keyB.png");
        this.load.image("KeyC", "/images/keyC.png");
        this.load.image("KeyD", "/images/keyD.png");
        this.load.image("KeyE", "/images/keyE.png");
        this.load.image("KeyF", "/images/keyF.png");
        this.load.image("KeyG", "/images/keyG.png");
        this.load.image("KeyH", "/images/keyH.png");
        this.load.image("KeyI", "/images/keyI.png");
        this.load.image("KeyJ", "/images/keyJ.png");
        this.load.image("KeyK", "/images/keyK.png");
        this.load.image("KeyL", "/images/keyL.png");
        this.load.image("KeyM", "/images/keyM.png");
        this.load.image("KeyN", "/images/keyN.png");
        this.load.image("KeyO", "/images/keyO.png");
        this.load.image("KeyP", "/images/keyP.png");
        this.load.image("KeyQ", "/images/keyQ.png");
        this.load.image("KeyR", "/images/keyR.png");
        this.load.image("KeyS", "/images/keyS.png");
        this.load.image("KeyT", "/images/keyT.png");
        this.load.image("KeyU", "/images/keyU.png");
        this.load.image("KeyV", "/images/keyV.png");
        this.load.image("KeyW", "/images/keyW.png");
        this.load.image("KeyX", "/images/keyX.png");
        this.load.image("KeyY", "/images/keyY.png");
        this.load.image("KeyZ", "/images/keyZ.png");
        this.load.image('sky', '/images/sky.png');
        this.load.image('sax_cat_center', '/images/sax_cat.png');
        this.load.image('sax_cat_left', '/images/sax_cat_left.png');
        this.load.image('sax_cat_right', '/images/sax_cat_right.png');
        }

    create() {
        // Notes timestamps, made with the other script "record.html". They are relative to the start of the song, meaning a value of 1000 equals to 1 second after the song has started
        this.notesTimestamps = this.getNote();
        this.timeToFall = 2000; // ms, time for the note to go to the bottom. The lower the faster/hardest
        this.lastNoteIndex = 0; // last note spawned
        this.notes = [];        // array of notes already spawned
        this.colliders = [];    // colliders for player input vs falling note
        this.characters = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ"];
        this.charIndex = 0;
        this.endTimestamp = music.time;
        this.firstKeysPressed = [];
        this.firstKeyPressed = {
            code: 'init',
            parsed: false
        };
        

        this.backImage = this.add.image(1920 / 2, 1080 / 2, 'sky').setDisplaySize(1920,1080);
        this.noteBar = this.add.rectangle(1920 / 2, 800, 1920, 300, 0x808000);
        this.targetBar = this.add.rectangle(200, 800, 10, 300, 0x000000);

        this.sax_cat = this.add.image(1920 / 2, 400, 'sax_cat_center');

        // The score text
        this.scoreText = this.add.text(100, 100, "SCORE", { fontFamily: "arial", fontSize: "100px" });
        score = 0;

        this.scene.add("result", ResultScene);
        // We create the audio object and play it
        sound = this.sound.add("music");
        sound.volume = 0.1;
        
        if (!this.sound.locked)
        {
            // already unlocked so play
            console.log("a");
            sound.play();
        }
        else
        {
            // wait for 'unlocked' to fire and then play
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
                console.log("b");
                sound.play();
            })
        }

        
        // set the start time of the game
        this.startTime = Date.now();
    }

    update() {
        this.handlePlayerInput();
        this.spawnNotes();
        this.checkNoteCollisions();
        this.backgroundAnimation();
        this.checkFinished();
    }

    spawnNotes() {
        // lets look up to the 10 next notes and spawn if needed
        for (let i = this.lastNoteIndex; i < this.lastNoteIndex + 10; i++) {
            let note = this.notesTimestamps[i];
            if (!note) break;

            // Spawn note if: is not already spawned, and the timing is right. From the start of the song, we need to consider the time it takes for the note to fall so we start it at the timestamp minus the time to fall
            if (
                note.spawned != true
                && note.timestamp <= Date.now() - this.startTime + this.timeToFall
            ) {
                this.spawnNote();
                this.lastNoteIndex = i;
                note.spawned = true;
            }
        }
    }

    spawnNote() {
        // This is self explanatory. Spawn the note and let it fall to the bottom.
        //let note = this.add.circle(1920 / 2, 0, 20, 0xffff00);
        this.charIndex = Math.floor(Math.random() * this.characters.length);
        let note = this.add.image(1920, 800, this.characters[this.charIndex]).setDisplaySize(150,150);
        this.notes.push(note);
        this.physics.add.existing(note);
        this.physics.moveTo(note, 200, 800, null, this.timeToFall);
    }

    handlePlayerInput() {
        this.firstKeysPressed = getFirstKeysPressed()
        if (this.firstKeysPressed.length != 0) {
            // we create a new collider at the position of the red bar
            let collider = this.add.image(200, 800, "Stamp").setDisplaySize(150,150);

            // attach physics
            this.physics.add.existing(collider);

            // little tween to grow
            this.tweens.add({
                targets: collider,
                //scale: 2,
                duration: 100,
                alpha: 0,
                onComplete: () => {
                    collider.destroy();

                    // If the collider did not hit a note, its a miss, so lets lower the score
                    if (collider.collided != true) {
                        this.cameras.main.shake(100, 0.01);
                        score -= 200;
                        this.updateScoreText();
                    }
                }
            });

            // add the collider to the list
            this.colliders.push(collider);
            this.firstKeyPressed = this.firstKeysPressed[0]
        }
    }

    checkNoteCollisions() {
        this.physics.overlap(this.colliders, this.notes, (collider, note) => {
            if(this.firstKeyPressed.code==note.texture.key){
                // the collider collided
                console.log("success!")
                collider.collided = true;

                 // remove the collider from list
                 this.colliders.splice(this.colliders.indexOf(collider), 1);

                 // destroy the note and remove from list
                 note.destroy();
                 this.notes.splice(this.notes.indexOf(note), 1);

                 // increase the score and update the text
                 score += 100;
                 this.updateScoreText();
            }
        });
    }

    updateScoreText() {
        this.scoreText.text = score;
    }

    backgroundAnimation() {
        switch (Math.floor((Date.now() - this.startTime) / 1000 )%4){
            case 0:
                this.sax_cat.destroy();
                this.sax_cat = this.add.image(1920 / 2, 400, 'sax_cat_center');
                break;
            case 1:
                this.sax_cat.destroy();
                this.sax_cat = this.add.image(1920 / 2, 400, 'sax_cat_left');
                break;
            case 2:
                this.sax_cat.destroy();
                this.sax_cat = this.add.image(1920 / 2, 400, 'sax_cat_center');
                break;
            case 3:
                this.sax_cat.destroy();
                this.sax_cat = this.add.image(1920 / 2, 400, 'sax_cat_right');
                break;

        }
    }
    

    checkFinished() {
        
        if (Date.now() - this.startTime >= this.endTimestamp) {
            this.scene.start("result");
        }
    }

    getNote() {
        var request = new XMLHttpRequest();
        request.open("GET", "/jsons/" + music.note, false);
        request.send(null);
        return JSON.parse(request.responseText);
    }
}

class ResultScene {
    create() {
        this.text = this.add.text(
            1920 / 2,
            1080 / 2,
            `あなたのスコア： ${score}\n\nSPACE：再トライ\n\nENTER：結果を保存して終了`,
            { fontFamily: "arial", fontSize: "100px" }
        );
        this.text.setOrigin(0.5, 0.5);
    }

    update() {
        if (isKeyPressed("Space")) {
            sound.stop();
            this.scene.start("main");
        }

        if (isKeyPressed("Enter")) {
            let scoreId = "score-" + music.number;
            let maxScore = document.getElementById(scoreId).textContent;
            if(score > maxScore) {
                alert("ハイスコア更新！")
            }
            document.getElementById(scoreId).textContent = Math.max(maxScore, score);

            let data= new Object();
            data.music_id = music.number;
            data.score = score;
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.onreadystatechange = function()
            {
                var READYSTATE_COMPLETED = 4;
                var HTTP_STATUS_OK = 200;

                if( this.readyState == READYSTATE_COMPLETED
                && this.status == HTTP_STATUS_OK )
                {
                    // レスポンスの表示
                    alert( this.responseText );
                }
            }
            xmlHttpRequest.open('POST', '/save_score');

            // データをリクエスト ボディに含めて送信する
            xmlHttpRequest.setRequestHeader("content-type", "application/json");
            xmlHttpRequest.send(JSON.stringify(data));

            closeBtn.click();
        }
    }
}