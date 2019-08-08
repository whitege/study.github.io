/**
 * wuyupeng
 */
(function () {
    function prepare() {

        const imgTask = (img, src) => {
            return new Promise(function (resolve, reject) {
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
        };

        const context = document.getElementById('content').getContext('2d');
        const heroImg = new Image();
        const allSpriteImg = new Image();

        const allresourceTask = Promise.all([
            imgTask(heroImg, './hero.png'),
            imgTask(allSpriteImg, './all.jpg'),
        ]);

        return {
            /**
             * @param {Function} [callback] - 当准备好了之后要调用的回掉函数
             */
            getResource(callback) {
                allresourceTask.then(function () {
                    callback && callback(context, heroImg, allSpriteImg);
                });
            }
        };
    }

    function Init(context, heroImg, allSpriteImg) {

        // monster map
        let monster_map = []

        function Base() {
        }

        Base.prototype.draw = function () {
            this.context
                .drawImage(
                    this.img,
                    this.imgPos.x,
                    this.imgPos.y,
                    this.imgPos.width,
                    this.imgPos.height,
                    this.rect.x,
                    this.rect.y,
                    this.rect.width,
                    this.rect.height
                );
        };

        Base.prototype.fillText = function (blood_volume, x, y) {
            const text = '血量:' + blood_volume; // 需要绘制的文本内容
            this.context.fillStyle = '#ff030a'; // 文本颜色
            this.context.textAlign = 'center'; // 文本对齐方式
            this.context.font = '12px'; // 文本字号、字体
            this.context.fillText(text, x, y);
        }

        Base.prototype.clear = function () {
            this.context.clearRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }

        Base.prototype.clearByArea = function (x, y, width, height) {
            this.context.clearRect(x, y, width, height);
        }

        function Hero(rect) {
            let move_distance = 10;
            this.go = [0, 0, 0, 0];
            this.img = heroImg;
            this.context = context;
            this.imgPos = {x: 0, y: 0, width: 32, height: 32};
            this.rect = rect;
            this.blood_volume = 50;
            this.atk_power = 1
            this.direction = 'down'
            this.moveUp = function () {
                const index = 0;
                this.direction = 'up';
                this.clear();
                this.clearByArea(this.rect.x, this.rect.y + 30, 40, 40);
                this.rect.y -= move_distance;
                let isBoundary = collision(this.rect, {x: 32, y: 32, width: 436, height: 236})
                if (!isBoundary) {
                    this.rect.y += move_distance;
                } else {
                    monster_map.forEach(res => {
                        if (collision(this.rect, res.rect) && isBoundary) {
                            this.rect.y += move_distance;
                            this.attack(res);
                        }
                    })
                }
                this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);
                this.context
                    .drawImage(
                        this.img,
                        this.imgPos.x + 32 * this.go[index],
                        this.imgPos.y + (32 * 3),
                        this.imgPos.width,
                        this.imgPos.height,
                        this.rect.x,
                        this.rect.y,
                        this.rect.width,
                        this.rect.height
                    );
                if (this.go[index] < 3) {
                    this.go[index]++
                } else {
                    this.go[index] = 0
                }
            }

            this.moveDown = function () {
                const index = 1;
                this.direction = 'down';
                this.clear();
                this.clearByArea(this.rect.x, this.rect.y + 30, 40, 40);
                this.rect.y += move_distance;
                let isBoundary = collision(this.rect, {x: 32, y: 32, width: 436, height: 236})
                if (!isBoundary) {
                    this.rect.y -= move_distance;
                } else {
                    monster_map.forEach(res => {
                        if (collision(this.rect, res.rect) && isBoundary) {
                            this.rect.y -= move_distance;
                            this.attack(res);
                        }
                    })
                }
                this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);
                this.context
                    .drawImage(
                        this.img,
                        this.imgPos.x + (32 * this.go[index]),
                        this.imgPos.y,
                        this.imgPos.width,
                        this.imgPos.height,
                        this.rect.x,
                        this.rect.y,
                        this.rect.width,
                        this.rect.height
                    );
                if (this.go[index] < 3) {
                    this.go[index]++
                } else {
                    this.go[index] = 0
                }
            }

            this.moveLeft = function () {
                const index = 2;
                this.direction = 'move_left';
                this.clear();
                this.clearByArea(this.rect.x, this.rect.y + 30, 40, 40);
                this.rect.x -= move_distance;
                let isBoundary = collision(this.rect, {x: 32, y: 32, width: 436, height: 236})
                if (!isBoundary) {
                    this.rect.x += move_distance;
                } else {
                    monster_map.forEach(res => {
                        if (collision(this.rect, res.rect) && isBoundary) {
                            this.rect.x += move_distance;
                            this.attack(res);
                        }
                    })
                }
                ;
                this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);
                this.context
                    .drawImage(
                        this.img,
                        this.imgPos.x + 32 * this.go[index],
                        this.imgPos.y + (32 * 1),
                        this.imgPos.width,
                        this.imgPos.height,
                        this.rect.x,
                        this.rect.y,
                        this.rect.width,
                        this.rect.height
                    );
                if (this.go[index] < 3) {
                    this.go[index]++
                } else {
                    this.go[index] = 0
                }
            }

            this.moveRight = function () {
                const index = 3;
                this.direction = 'move_right';
                this.clear();
                this.clearByArea(this.rect.x, this.rect.y + 30, 40, 40);
                this.rect.x += move_distance;
                let isBoundary = collision(this.rect, {x: 32, y: 32, width: 436, height: 236})
                if (!isBoundary) {
                    this.rect.x -= move_distance;
                } else {
                    monster_map.forEach(res => {
                        if (collision(this.rect, res.rect) && isBoundary) {
                            this.rect.x -= move_distance;
                            this.attack(res);
                        }
                    })
                }
                ;
                this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);
                this.context
                    .drawImage(
                        this.img,
                        this.imgPos.x + 32 * this.go[index],
                        this.imgPos.y + (32 * 2),
                        this.imgPos.width,
                        this.imgPos.height,
                        this.rect.x,
                        this.rect.y,
                        this.rect.width,
                        this.rect.height
                    );
                if (this.go[index] < 3) {
                    this.go[index]++
                } else {
                    this.go[index] = 0
                }
            }

            this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);

            this.attack = function (attacked) {
                attacked.blood_volume -= this.atk_power;
                this.blood_volume--
                attacked.clearByArea(attacked.rect.x, attacked.rect.y + 40, 40, 24);
                attacked.fillText(attacked.blood_volume, attacked.rect.x + 20, attacked.rect.y + 60);
                if (attacked.blood_volume === 0) {
                    attacked.clear()
                    attacked.clearByArea(attacked.rect.x, attacked.rect.y + 40, 40, 24);
                    attacked.rect.x = 0;
                    attacked.rect.y = 0;
                    attacked.rect.width = 0;
                    attacked.rect.height = 0;
                }
                if (this.blood_volume === 0){
                    this.clear()
                }
            }
        }

        function Monster() {
            this.img = allSpriteImg;
            this.context = context;
        }

        function RedMonster(rect) {
            Monster.call(this);
            this.rect = rect;
            this.imgPos = {x: 858, y: 495, width: 32, height: 32};
            this.blood_volume = 10;
            this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);
            monster_map.push(this)
        }

        function BlackMonster(rect) {
            Monster.call(this);
            this.rect = rect;
            this.imgPos = {x: 858, y: 528, width: 32, height: 32}; // 671 413
            this.blood_volume = 20;
            this.fillText(this.blood_volume, this.rect.x + 20, this.rect.y + 60);
            monster_map.push(this)
        }

        // 碰撞检测器
        function collision(collide, bumped) {
            return !(collide.x + collide.width <= bumped.x ||
                bumped.x + bumped.width <= collide.x ||
                collide.y + collide.height <= bumped.y ||
                bumped.y + bumped.height <= collide.y);
        }

        Hero.prototype = Object.create(Base.prototype)
        Monster.prototype = Object.create(Base.prototype)
        RedMonster.prototype = Object.create(Monster.prototype)
        BlackMonster.prototype = Object.create(Monster.prototype)

        let hero = new Hero({x: 0, y: 0, width: 40, height: 40});
        let monster_red = new RedMonster({x: 200, y: 200, width: 40, height: 40});
        let monster_black = new BlackMonster({x: 100, y: 100, width: 40, height: 40});
        hero.draw();
        monster_red.draw();
        monster_black.draw();
        document.addEventListener("keydown", function (e) {
            console.log('keydown:', e.key)
            switch (e.key) {
                case 'ArrowLeft':
                    hero.moveLeft();
                    break
                case 'ArrowRight':
                    hero.moveRight();
                    break
                case 'ArrowUp':
                    hero.moveUp();
                    break
                case 'ArrowDown':
                    hero.moveDown();
                    break
                case 'a':
                    hero.attack()
                    break
                default:
                    break
            }
        });
    }

    let resourceManager = prepare();
    resourceManager.getResource(function (context, heroImg, allSpriteImg) {
        Init(context, heroImg, allSpriteImg);
    });
})();
