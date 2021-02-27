import React from 'react';

import './GameField.css';

export default class GameField extends React.Component {
    constructor() {
        super();

        this.state = {
            // field legend:
            // 0 - empty
            // 1 - snake
            // 2 - food
            // 3 - obstacle
            //-----------------
            // -x+  - horizontally
            // -
            // y    - vertically
            // +
            fieldX: 20,
            fieldY: 20,
            fieldXxY: [],
            snake: [],
            obstaclesArr: [],
            snakeSpeed: 300,        // Интервал между перемещениями змейки
            foodTimer: 5000,        // Таймер для еды
            obstacleInt: 7000,
            noObstacleInt: 11000,

            direction: 'x+',

            gameIsRunning: false,   // Запущена ли игра
            snakeTimer: null,       // Таймер змейки
            obstacleTimer: null,
            noObstacleTimer: null,
            score: 0,               // Результат
            obstacles: true,
            obstaclesDisap: true,
            noWalls: true
        };
    }

    componentDidMount() {
        this.gameTableInit();
        document.addEventListener('keydown', this.changeDirection);
    }

    changeDirection = (e) => {
        let {direction} = this.state;
    
        switch (e.code) {
            case 'ArrowLeft': 
                if (direction !== 'x+') {
                    direction = 'x-'
                }
                break;
            case 'ArrowUp': 
                if (direction !== 'y-') {
                    direction = 'y+'
                }
                break;
            case 'ArrowRight':
                if (direction !== 'x-') {
                    direction = 'x+'
                }
                break;
            case 'ArrowDown': 
                if (direction !== 'y+') {
                    direction = 'y-'
                }
                break;
        }
        this.setState({direction: direction});
        console.log(direction);
    }

    gameTableInit = () => {
        let arr = [[]];
        let arrSn = [];

        for(let y = 0; y < this.state.fieldY; y++) {
            arr.push([]);
            for(let x = 0; x < this.state.fieldX; x++) {
                arr[y].push(0);
            }
        }

        let y = Math.floor(this.state.fieldY / 2);
        let x = Math.floor(this.state.fieldX / 2);
        arr[y][x] = arr[y][x + 1] = 1;                  // snake start

        this.setState({fieldXxY: arr});

        arrSn.push(`${y}-${x}`, `${y}-${x + 1}`)
        this.setState({snake: arrSn});
    }

    snakeDraw =() => {
        let arr = this.state.fieldXxY.map((item) => {
            const i = item;
            return (
                i.map((subitem) => {
                    return (
                        subitem === 1 ? 0 : subitem
                    )
                })
            )
        })

        arr = arr.map((item, index) => {
            return (
                item.map((subitem, i) => {
                    return (
                        this.state.snake.includes(`${index.toString()}-${i.toString()}`) ? 1 : subitem
                    )
                })
            )
        })

        this.setState({fieldXxY: arr});
    }

    startGame = () => {
        this.setState({gameIsRunning: true});

        this.setState({snakeTimer: setInterval(this.move, this.state.snakeSpeed)});
        setTimeout(this.createFood, this.state.foodTimer);
        if (this.state.obstacles) {
            this.setState({obstacleTimer: setInterval(this.createObstacle, this.state.obstacleInt)});
        }
        if (this.state.obstaclesDisap) {
            this.setState({noObstacleTimer: setInterval(this.deleteObstacle, this.state.noObstacleInt)});
        }

    }

    createFood = () => {
        this.createFoodOrObstacle(2);
    }

    createObstacle = () => {
        this.createFoodOrObstacle(3);
    }

    deleteObstacle = () => {
        let {obstaclesArr, fieldXxY} = this.state;
        // let obstaclesArr = [];
        // let i = -1;
        // while ((i = ))
        
        // let arr = this.state.obstaclesArr;
        let i = Math.floor(Math.random() * obstaclesArr.length);
        // arr.splice(i, 1);



        fieldXxY[obstaclesArr[i].split('-')[0]][obstaclesArr[i].split('-')[1]] = 0;
        obstaclesArr.splice(i, 1);


        this.setState({obstaclesArr: obstaclesArr});
        this.setState({fieldXxY: fieldXxY});

        

        // while (1) { 
        //     var food_x = Math.floor(Math.random() * this.state.fieldX);
        //     var food_y = Math.floor(Math.random() * this.state.fieldY);
    
        //     if (arr[food_y][food_x] === 0) {
        //         arr[food_y][food_x] = item;
        //         break;
        //     }
        // }

        // arr = arr.map((item, index) => {
        //     return (
        //         item.map((subitem, i) => {
        //             return (
        //                 this.state.snake.includes(`${index.toString()}-${i.toString()}`) ? 1 : subitem
        //             )
        //         })
        //     )
        // })
    }

    createFoodOrObstacle = (item) => {

        let arr = this.state.fieldXxY;
    
        while (1) { 
            var food_x = Math.floor(Math.random() * this.state.fieldX);
            var food_y = Math.floor(Math.random() * this.state.fieldY);
    
            if (arr[food_y][food_x] === 0) {
                arr[food_y][food_x] = item;
                break;
            }
        }

        if (item === 3) {
            this.setState({obstaclesArr: [...this.state.obstaclesArr, `${food_y}-${food_x}`]});
        }

        this.setState({fieldXxY: arr});
    }

    fieldNumber = (coord) => {
        let [y, x] = [...coord.split('-')];
        return (this.state.fieldXxY[+y][+x]);

    }

    move = () => {
        let {direction, snake, noWalls} = this.state;

        let head = snake[snake.length - 1].split('-');
        let headNew = '';
        let newx = head[1];
        let newy = head[0];

        switch (direction) {
            case 'x-':
                // headNew = `${head[0]}-${parseInt(head[1]) - 1}`;
                newx = parseInt(head[1]) - 1;
                break;
            case 'x+':
                // headNew = `${head[0]}-${parseInt(head[1]) + 1}`;
                newx = parseInt(head[1]) + 1;
                break;
            case 'y+':
                // headNew = `${parseInt(head[0]) - 1}-${head[1]}`;
                newy = parseInt(head[0]) - 1;
                break;
            case 'y-':
                // headNew = `${parseInt(head[0]) + 1}-${head[1]}`;
                newy = parseInt(head[0]) + 1;
                break;
        }
        
        // wall
        if (newx > (this.state.fieldX - 1) || 
            newx < 0 ||
            newy > (this.state.fieldY - 1) || 
            newy < 0) {

                if (noWalls) {
                    if (newx > this.state.fieldX - 1) {newx = 0};
                    if (newx < 0) {newx = this.state.fieldX - 1};
                    if (newy > this.state.fieldY - 1) {newy = 0};
                    if (newy < 0) {newy = this.state.fieldY - 1};
                    
                } else {
                    this.finishTheGame();
                }
        } 

        headNew = `${newy}-${newx}`;

        if (snake.includes(headNew)) {
            this.finishTheGame();
        }
        let arr = snake;
        arr.push(headNew);
        this.setState({snake: arr})
        
        // obstacle
        if (this.fieldNumber(headNew) === 3) {
            this.finishTheGame();
        }
        // food
        if (this.fieldNumber(headNew) === 2) {
            this.createFood(2);
        } else {
            snake.splice(0, 1);
            this.setState({snake: snake});
            this.snakeDraw();
        }
    }

    finishTheGame = () => {
        this.setState({gameIsRunning: false});
        clearInterval(this.state.snakeTimer);
        clearInterval(this.state.obstacleTimer);
        alert('Вы проиграли! Ваш результат: ' + this.state.snake.length);
    }

    render() {
        return <>
        <div className='snake-field'>
            <table className='game-table'>
                <tbody>
                {
                    this.state.fieldXxY.map((item, index) => {
                        return (
                            <tr key={`r-${index}`} className={`game-table-row row-${index}`}>
                                {
                                    item.map((subitem, i) => {
                                        return (
                                            <td key={`c-${i}`} className={`game-table-cell cell-${index}-${i} game-table-cell-status-${subitem}`}></td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
        <button onClick={this.startGame}>Start</button>
        </>
    }
}