let textarea = document.querySelector(".codeTextArea");
let button = document.querySelector(".checkCode");
let canShoot = false;
let isRunning = false;
let enableBtn = true;
let enableAnimation = true;
let movingDefenders = false;
let enemyAnimation = [];
let timelines = [];

let jfContent = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"];
let alignContent = ["flex-start", "flex-end", "center", "stretch", "baseline"];
let selectFirstLine = {
    option: "",
    value: ""
};

let selectSecondLine = {
    option: "",
    value: ""
};

let levels = [
    {
        "level": 1,
        "justify-content": "center",
        "maxTurrets": 2,
        "maxEnemies": 6,
        "diverse": 0
    },
    {
        "level": 2,
        "justify-content": "flex-start",
        "maxTurrets": 3,
        "maxEnemies": 10,
        "diverse": 10
    },
    {
        "level": 3,
        "justify-content": "space-around",
        "maxTurrets": 3,
        "maxEnemies": 15,
        "diverse": 15

    },
    {
        "level": 4,
        "justify-content": "space-evenly",
        "maxTurrets": 3,
        "maxEnemies": 23,
        "diverse": 16
    },
    {
        "level": 5,
        "justify-content": "flex-end",
        "maxTurrets": 3,
        "maxEnemies": 30,
        "diverse": 18
    },
    {
        "level": 6,
        "justify-content": "space-between",
        "maxTurrets": 3,
        "maxEnemies": 36,
        "diverse": 18
    },
    {
        "level": 7,
        "justify-content": "flex-start",
        "maxTurrets": 4,
        "maxEnemies": 42,
        "diverse": 20
    },
    {
        "level": 8,
        "justify-content": "center",
        "maxTurrets": 4,
        "maxEnemies": 45,
        "diverse": 24
    },
    {
        "level": 9,
        "justify-content": "space-evenly",
        "maxTurrets": 5,
        "maxEnemies": 45,
        "diverse": 25
    },
    {
        "level": 10,
        "justify-content": "space-around",
        "maxTurrets": 5,
        "maxEnemies": 10,
        "diverse": 30
    }
];

let currentLevel = localStorage.getItem("currentLevel");
let maxLevel = localStorage.getItem("maxLevel");

let placedTurrets = 0;
let currentJcontent;
let maxTurrets;

let enemysAlive; //Überpüfen wie viele noch am leben sind
let defendersAlive;

let myTimer;


function initGame() {
    if (currentLevel == null || maxLevel == null) {
        currentLevel = 0;
        maxLevel = 0;
        localStorage.setItem("currentLevel", currentLevel.toString());
        localStorage.setItem("maxLevel", maxLevel.toString());
    }
    currentJcontent = levels[currentLevel]["justify-content"];
    maxTurrets = levels[currentLevel].maxTurrets;

    if (currentLevel >= 1 && currentLevel <= 5) {
        myTimer = setInterval(changeWave, 8 * 1000);
    } else if (currentLevel >= 5 && currentLevel <= 10) {
        myTimer = setInterval(changeWave, 6 * 1000);
    }

    spawnEnemys();

    enemysAlive = levels[currentLevel].maxEnemies;
    defendersAlive = 0;
    document.querySelector(".enemyField").style.justifyContent = currentJcontent;
    updateText();

}

function spawnEnemys() {
    for (let i = 0; i < maxTurrets; i++) {
        createEntityElement(null, "enemy-block");
    }

    const enemies = document.querySelectorAll(".enemy-block");
    enemies.forEach(enemy => {
        let randomNumber = generateRandomNumber(80, 120);
        enemy.style.transform = `translateY(${randomNumber}px)`;
    })
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

initGame();

document.addEventListener("DOMContentLoaded", function () {
    let defenders = document.querySelectorAll(".defense-block");
    let enemys = document.querySelectorAll(".enemy-block");


    gsap.from(defenders, { y: -100, duration: 1, rotation: 360 });
    gsap.from(enemys, { y: 100, duration: 1, rotation: 360 });

    gsap.to(".defense-img", {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });


    //Starte spiel
    button.addEventListener("click", function () {
        let defense = document.querySelectorAll(".defense-block");
        let enemies = document.querySelectorAll(".enemy-block")


        if (placedTurrets == levels[currentLevel].maxTurrets) {
            checkCode();

            if (isRunning && enableAnimation) {
                enableAnimation = false;

                let targetY = -document.querySelector(".enemyField").offsetHeight + 50;

                if (!enableAnimation) {
                    enemies.forEach(enemie => {
                        let tl = gsap.timeline();
                        let duration = getEnemyDuration(enemie);
                        tl.to(enemie, {
                            y: targetY,
                            duration: duration,
                            ease: "linear",
                            onUpdate: function () {

                                defense.forEach(def => {
                                    enemies.forEach(en => {
                                        if (isCollision(def, en)) {
                                            tl.progress(0).pause();
                                            tl.play();
                                            gsap.killTweensOf(def);
                                            def.querySelector(".shoot").remove();
                                            def.style.visibility = 'hidden';
                                            defendersAlive--;

                                        }

                                    })
                                })

                            },
                            onComplete: () => {
                                gsap.set(enemys, { y: 120 });
                                stopShooting();
                                stopMovingAnimation();
                                getWinLose("VERLOREN", "loseWindow");
                                defendersAlive = 0;

                                reset();

                            }
                        });
                        enemyAnimation.push(tl)
                    })



                    startShooting();
                }
            }

            enableBtn = false;
            inGame = true;


        } else {
            getError(`Platziere bitte ${levels[currentLevel].maxTurrets} Turrets!`);
        }

    });

});

function hitTest() {
    let defense = document.querySelectorAll(".defense-block");
    let enemies = document.querySelectorAll(".enemy-block")


    defense.forEach(def => {
        enemies.forEach(en => {
            if (isCollision(def, en)) {
                return true;
            }
        })
    })

    return false;
}

function startShooting() {
    let targetY = document.querySelector(".gameField").offsetHeight + 50;
    let enemys = document.querySelectorAll(".enemy-block");
    let defenders = document.querySelectorAll(".defense-block");

    defenders.forEach((block) => {
        let shootAnimation = gsap.timeline();

        let bullet = block.querySelector(".shoot");
        let shootDuration = getShootDuration(block);

        shootAnimation.to(bullet, {
            y: targetY,
            duration: shootDuration,
            ease: "linear",
            repeat: -1,
            delay: 1,
            onUpdate: function () {
                enemys.forEach((enemy) => {
                    if (isCollision(bullet, enemy)) {
                        enemysAlive--;
                        shootAnimation.progress(0).pause();
                        shootAnimation.play();
                        if (enemysAlive >= 0) {
                            const enemyTween = enemyAnimation[Array.from(enemys).indexOf(enemy)];
                            enemyTween.progress(0).pause();
                            enemyTween.play();


                            let rnd = generateRandomNumber(5, levels[currentLevel].diverse);
                            let img = enemy.querySelector("img");
                            if (rnd >= levels[currentLevel].diverse) {
                                img.src = "../assets/Blue_Walk_Gif.gif";
                            } else {
                                img.src = "../assets/Green_Walk_Gif.gif";

                            }
                        } else {
                            enemy.style.visibility = 'hidden';
                            gsap.killTweensOf(enemy);
                        }
                        checkWin();
                    }
                })
            },
        });
        timelines.push(shootAnimation);

    });
}

function getShootDuration(block) {
    let turret = block.querySelector("img");
    let imgSrc = turret.src;
    let duration;

    if (imgSrc.includes("Turret-01.png")) {
        duration = 10;
    } else if (imgSrc.includes("Turret-02.png")) {
        duration = 8;
    } else if (imgSrc.includes("Turret-03.png")) {
        duration = 6;
    }

    return duration;
}

function getEnemyDuration(enemy) {
    let img = enemy.querySelector("img");
    let imgSrc = img.src;
    let duration;

    if (imgSrc.includes("Green")) {
        duration = 19;
    } else if (imgSrc.includes("Blue")) {
        duration = 21;
    }

    return duration;
}

function stopShooting() {

    timelines.forEach(tl => {
        tl.restart();
        tl.pause();
    });
}

function continueShooting() {
    timelines.forEach(tl => {
        tl.start();
    });
}

function stopMovingAnimation() {
    enemyAnimation.forEach(tl => {
        tl.restart();
        tl.pause();
    })
}

function reset() {
    let entities = document.querySelectorAll(".entity");
    placedTurrets = 0;
    resetAnimation();

    entities.forEach(entity => {
        entity.remove();
    })
    if (defendersAlive == 0) {
        initGame();
    }
    updateText();
    clearInterval(myTimer);
    isRunning = false;
    enableBtn = true;
    enableAnimation = true;
}

function nextLevel() {
    if (currentLevel < 10) {
        currentJcontent = levels[currentLevel]["justify-content"];
        maxTurrets = levels[currentLevel].maxTurrets;

        spawnEnemys();

        let enemyfield = document.querySelector(".enemyField");

        resetAnimation();

        enemyfield.style.justifyContent = currentJcontent;
        enemysAlive = levels[currentLevel].maxEnemies;
        defendersAlive = 0;
    }
}

function checkWin() {
    if (enemysAlive == 0) {
        //Gewonnen
        if (currentLevel == maxLevel) {
            maxLevel++;
            localStorage.setItem("maxLevel", maxLevel);
        }

        currentLevel++;
        localStorage.setItem("currentLevel", currentLevel);
        getWinLose("GEWONNEN", "winWindow");
        reset();
        nextLevel();
        if (currentLevel == 10) {
            //Herzlichen Glückwunsch! Du hast alle Level geschafft!
            getWinLose("Herzlichen Glückwunsch! Du hast alle Level geschafft!", "winWindow");
            currentLevel = 0;
            updateText();
            return;
        }

        if (currentLevel >= 1 && currentLevel <= 5) {
            myTimer = setInterval(changeWave, 8 * 1000);
        } else if (currentLevel >= 5 && currentLevel < 10) {
            myTimer = setInterval(changeWave, 6 * 1000);
        }
        updateText();
    }

}

let cLeft = document.querySelector('.cLeft');
let cRight = document.querySelector('.cRight');

cLeft.addEventListener('click', function () {
    if (currentLevel == 0) {
        return;
    }
    else {
        currentLevel--;
        localStorage.setItem("currentLevel", currentLevel);
        reset();
        updateText();
    }
});

cRight.addEventListener('click', function () {
    if (currentLevel == maxLevel) {
        return;
    }
    else {
        currentLevel++
        localStorage.setItem("currentLevel", currentLevel);
        reset();
        updateText();
    }
});


function checkLose() {
    if (defendersAlive == 0) {
        //Verloren
        getWinLose("VERLOREN");
        reset();
    }
}

function resetAnimation() {
    enemyAnimation.forEach(em => {
        em.pause();
    })
    timelines.forEach(tl => {
        tl.pause();
    })
    enemyAnimation = [];
    timelines = [];
}


function createNewBullet() {
    let shoot = document.querySelectorAll(".shoot");
    shoot.forEach(bullet => {
        bullet.style.display = "block";
        gsap.set(bullet, { y: bullet.originY });
    });
    startShooting();
}

function isCollisionWithDefender(shoot, defenders) {
    for (const bullet of shoot) {
        const bulletRect = bullet.getBoundingClientRect();

        for (const defender of defenders) {
            const defenderRect = defender.getBoundingClientRect();

            if (
                bulletRect.bottom > defenderRect.top &&
                bulletRect.top < defenderRect.bottom &&
                bulletRect.right > defenderRect.left &&
                bulletRect.left < defenderRect.right
            ) {
                return true;
            }
        }
    }

    return false;
}

function isCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.bottom > rect2.top &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.left < rect2.right
    );
}






function enemysReachedTarget(enemys, targetY) {
    for (var i = 0; i < enemys.length; i++) {
        if (enemys[i].getBoundingClientRect().top >= targetY) {
            return false;
        }
        if (enemys[i].getBoundingClientRect().bottom <= targetY) {
            return false;
        }
    }
    return true;
}

function displayDefenders() {
    let defenseField = document.querySelector(".gameField");
    let defenders = document.querySelectorAll(".defense-block");
    let enemyField = document.querySelector(".enemyField");
    let enemys = document.querySelectorAll(".enemy-block");

    if (selectFirstLine != null || selectSecondLine != null) {
        let firstOption = selectFirstLine.option;
        let firstValue = selectFirstLine.value;
        let secondOption = selectSecondLine.option;
        let secondValue = selectSecondLine.value;


        if (firstOption == "justify-content" && secondOption == "align-items") {
            moveAll(defenseField, defenders, "justifyContent", "alignItems", firstValue, secondValue);
        } else if (firstOption == "align-items" && secondOption == "justify-content") {

            moveAll(defenseField, defenders, "justifyContent", "alignItems", secondValue, firstValue);
        } else if (firstOption == "justify-content") {
            moveAll(defenseField, defenders, "justifyContent", "alignItems", firstValue, secondValue);
        } else if (firstOption == "align-items") {
            moveAll(defenseField, defenders, "justifyContent", "alignItems", secondValue, firstValue);
        }


    }
}

let runAnimation = false;
function moveAll(field, objects, property, property2, newValue, newValue2) {
    let timeLine = gsap.timeline();

    if (!runAnimation) {
        runAnimation = true;
        timeLine.to(field, {
            [property]: newValue,
            [property2]: newValue2,
            duration: 1,
            ease: "power2.inOut",
            onComplete: function () {
                runAnimation = false;
            }
        }).from(objects, {
            x: "-100", opacity: 0, stagger: 0.2, duration: 0.5, ease: "power2.inOut"
        }, "-=1");
    }
}



let field = document.querySelector(".gameField");

if (!isRunning) {
    Draggable.create(".defense", {
        onDragStart: function () {
            originX = this.x;
            originY = this.y;
        },
        onDragEnd: function () {
            if (this.hitTest(field, "50%") && enableBtn) {
                if (placedTurrets < levels[currentLevel].maxTurrets) {
                    createEntityElement(this.target.children[0], 'defense-block');
                    placedTurrets++;
                    defendersAlive = placedTurrets;
                    updateText();
                }
            }
            gsap.to(this.target, { x: this.startX, y: this.startY });

        }
    });
}

function shouldGenerateDiverseEnemy(diverse) {
    let rnd = generateRandomNumber(1, 100);
    return rnd >= diverse; // Überprüfe, ob die Zufallszahl innerhalb der Diversität liegt
}

function createEntityElement(target, enitity) {
    const defenseContainer = document.createElement('div');
    defenseContainer.classList.add(enitity, 'entity');

    const bullet = document.createElement("div");
    bullet.classList.add("shoot");

    const imgElement = document.createElement('img');
    imgElement.alt = 'Enemy Image';

    let shootImg = document.createElement("img");
    shootImg.classList.add("shootImg");

    if (target != null) {
        if (target.classList.contains("turret-01")) {
            imgElement.src = "../assets/Turret-01.png";
            shootImg.src = "../assets/Munition_Blau.gif";
        } else if (target.classList.contains("turret-02")) {
            imgElement.src = "../assets/Turret-02.png";
            shootImg.src = "../assets/Munition_Rot.gif";
        } else if (target.classList.contains("turret-03")) {
            imgElement.src = "../assets/Turret-03.png";
            shootImg.src = "../assets/Munition_Grün.png";
            shootImg.classList.add("bullet");
        }
    }

    if (enitity == "enemy-block") {
        if (shouldGenerateDiverseEnemy(levels[currentLevel].diverse)) {
            imgElement.src = "../assets/Blue_Walk_Gif.gif";
        } else {
            imgElement.src = "../assets/Green_Walk_Gif.gif";
        }
    }

    if (enitity == "defense-block") {
        defenseContainer.appendChild(imgElement);
        defenseContainer.appendChild(bullet);
        bullet.appendChild(shootImg);

        const entityContainer = document.querySelector('.gameField');
        entityContainer.appendChild(defenseContainer);
    } else if (enitity == "enemy-block") {
        defenseContainer.appendChild(imgElement);

        const entityContainer = document.querySelector('.enemyField');
        entityContainer.appendChild(defenseContainer);
    }
}

function checkCode() {
    const textContent = textarea.value;
    const lines = textContent.split('\n');


    function setOptionValue(line, selectLine, options) {
        const match = line.match(/([^:]+)\s*:\s*(.+?)\s*;?$/);

        if (match) {
            const property = match[1];
            const value = match[2];

            if (options.includes(value)) {
                selectLine.option = property.startsWith("justify-content") ? "justify-content" : "align-items";
                selectLine.value = value;
            } else {
                //Ungültiger Wert:
                getError(`Ungültiger Wert: ${value}`);
                throw new Error("Ungültiger Wert eingegeben");
            }
        } else {
            //Ungültiges Format
            getError("Ungültiges Format: " + line);
            throw new Error("Ungültiges Format eingegeben");
        }
    }



    try {
        if (lines.length >= 1) {
            setOptionValue(lines[0], selectFirstLine, jfContent);
        } else {
            //Fehler in der ersten Zeile!
            getError("Fehler in der ersten Zeile!");
            return;
        }

        if (lines.length >= 2) {
            setOptionValue(lines[1], selectSecondLine, jfContent);
        }

        if (enableBtn) {
            // startShooting = true;
        }

        displayDefenders();

        if (!isRunning) {
            isRunning = true;

            // startGame();
        }
    } catch (error) {
        // Fehlerbehandlung, falls ein ungültiger Wert eingegeben wurde
        console.error(error.message);
    }
}

function updateText() {
    let level = document.querySelector(".currentLevel");
    let placed = document.querySelector(".placedTurrets");
    let maxTurrets = document.querySelector(".maxTurrets");

    if (currentLevel < 10) {
        level.innerText = levels[currentLevel].level;
        placed.innerText = placedTurrets;
        maxTurrets.innerText = levels[currentLevel].maxTurrets;
    }
}

updateText();

function changeWave() {
    let random = Math.floor(Math.random() * levels.length + 1);
    let enemyfield = document.querySelector(".enemyField");
    enemyfield.style.justifyContent = jfContent[random];

}

document.querySelector("#restart").addEventListener("click", function () {
    initGame();
    reset();
    updateText();
});

function getError(text) {
    let errorContainer = document.querySelector(".notifyContainer");
    let error = document.createElement('div');
    error.setAttribute("class", "errorWindow");

    error.innerText = text;

    errorContainer.appendChild(error);

    setTimeout(() => {
        error.remove();
    }, 5 * 1000);
}

function getWinLose(showText, className) {
    let notifyContainer = document.querySelector(".notifyContainer");
    let statusDiv = document.createElement('div');

    statusDiv.setAttribute("class", className);
    statusDiv.innerText = showText;
    notifyContainer.appendChild(statusDiv);

    setTimeout(() => {
        statusDiv.remove();
    }, 5 * 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.querySelector(".codeTextArea");

    textarea.addEventListener('input', function () {
        limitTextareaRows(textarea, 3);
    });

    function limitTextareaRows(textarea, maxRows) {
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
        const currentRows = textarea.scrollHeight / lineHeight;

        if (currentRows > maxRows) {
            textarea.value = textarea.value.slice(0, -1);
        }
    }

    window.addEventListener("resize", () => {
        let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (screenWidth < 1500) {
            alert("Dein Bildschirm ist zu klein :( \nMindestens 1500px")
        }
    });
});