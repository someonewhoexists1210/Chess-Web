GLOBALS = {}
const sqSize = 60, boardSize = sqSize * 8;
function imageLoad() {
    GLOBALS.Images = new Map([
        ['WHITE_PAWN', '..\\imgs\\wpawn.png'],
        ['WHITE_KNIGHT', '..\\imgs\\wknight.png'],
        ['WHITE_BISHOP', '..\\imgs\\wbishop.png'],
        ['WHITE_ROOK', '..\\imgs\\wrook.png'],
        ['WHITE_QUEEN', '..\\imgs\\wqueen.png'],
        ['WHITE_KING', '..\\imgs\\wking.png'],
        ['BLACK_PAWN', '..\\imgs\\blpawn.png'],
        ['BLACK_KNIGHT', '..\\imgs\\blknight.png'],
        ['BLACK_BISHOP', '..\\imgs\\blbishop.png'],
        ['BLACK_ROOK', '..\\imgs\\blrook.png'],
        ['BLACK_QUEEN', "..\\imgs\\blqueen.png"],
        ['BLACK_KING', '..\\imgs\\blking.png']
    ]);
    let imageCounter = 0;
    GLOBALS.Images.forEach(function (value, key) {
    let image = new Image();
    image.src = value;
    image.onload = function () {
        GLOBALS.Images.set(key, image);
        imageCounter++;
        if (imageCounter == GLOBALS.Images.size) {
            console.log('Images loaded');
            GLOBALS.Images = new Map([
                ['Pawn', [GLOBALS.Images.get('WHITE_PAWN'), GLOBALS.Images.get('BLACK_PAWN')]],
                ['Bishop', [GLOBALS.Images.get('WHITE_BISHOP'), GLOBALS.Images.get('BLACK_BISHOP')]],
                ['Knight', [GLOBALS.Images.get('WHITE_KNIGHT'), GLOBALS.Images.get('BLACK_KNIGHT')]],
                ['Rook', [GLOBALS.Images.get('WHITE_ROOK'), GLOBALS.Images.get('BLACK_ROOK')]],
                ['Queen', [GLOBALS.Images.get('WHITE_QUEEN'), GLOBALS.Images.get('BLACK_QUEEN')]],
                ['King', [GLOBALS.Images.get('WHITE_KING'), GLOBALS.Images.get('BLACK_KING')]],
            ]);
        }
    }

})
};

const boardpos = new Map();

for (let i = 0; i <= 7; i++){
    for (let y = 0; y <= 7; y++){
        boardpos.set(String.fromCharCode(i+97) + (y+1), [i * sqSize, boardSize - (sqSize * (y+1))])
    }}

class Board {
    constructor() {
        this.whites_turn = true;
        this.pieces = [];
        this.selected = undefined;
    }

    /**
     * 
     * @param {String} sq A square on the board
     * @param {Boolean} isBlack If you want to check for specific color piece. Put null if you don't care
     * @param {Boolean} returnpiece If you want to return the piece object
     * @returns {Boolean} If the square is occupied 
     */
    squareoccupied(sq, isBlack=null, returnpiece = false) {
        for (let x of this.pieces) {
            if (x.sq == sq){
                if ((isBlack == x.isBlack) || (isBlack == null)){
                    return (returnpiece) ? x:true
                }
            }
        }

        return (returnpiece) ? null:false
    }
    
    /**
     * 
     * @param {String} sq A square on the board
     * @returns {String} The square in front of sq
     */
    sqfro(sq)  {
        if (sq == null){return null} 
        let x = sq[0] + (Number(sq[1]) + 1);
        if (Number(x[1]) > 8) {
            return null;
        }
        return x;
    }
    /**
     * 
     * @param {String} sq A square on the board
     * @returns {String} The square back of sq
     */
    sqback(sq)  {
        if (sq == null){return null} 
        let x = sq[0] + (Number(sq[1]) - 1);
        if (Number(x[1]) < 1) {
            return null;
        }
        return x;
    
    }
    /**
     * 
     * @param {String} sq A square on the board
     * @returns {String} The square to the right of sq
     */
    sqright(sq)  {
        if (sq == null){return null} 
        let x = String.fromCharCode(charcode(sq[0]) + 1 + 96) + sq[1];
        if (x[0] == 'i'){
            return null;
        }
        return x;
    
    }
    /**
     * 
     * @param {String} sq A square on the board
     * @returns {String} The square to the left of sq
     */
    sqleft(sq)  {
        if (sq == null){return null} 
        let x = String.fromCharCode(charcode(sq[0]) - 1 + 96) + sq[1];
        if (x[0] == '`'){
            return null;
        }
        return x;
    
    }

    /**
     * 
     * @param {Boolean} whiteDown 
     * @returns {void} Flips the board
     */
    flipBoard(whiteDown = true){
        if (whiteDown){
            for (let i = 0; i <= 7; i++){
                for (let y = 0; y <= 7; y++){
                    let sq = String.fromCharCode(i+97) + (y+1)
                    boardpos.set(sq, [i * sqSize, boardSize - (sqSize * (y+1))])
                }}
        }else {
            for (let i = 0; i <= 7; i++){
                for (let y = 0; y <= 7; y++){
                    let sq = String.fromCharCode(i+97) + (y+1)
                    boardpos.set(sq, [boardSize - (sqSize * (i+1)), y * sqSize])
                }
            }
        }
    }
}class Piece {
    constructor(isBlack, sq, points) {  
        this.isBlack = isBlack;
        this.img = n,ull;
        this.sq = sq;
        this.points = points;
        this.moves = new Set()
    }
    
    draw() {
        let [x, y] = boardpos.get(this.sq);
        gameCanvas.context.drawImage(this.img, x, y, sqSize, sqSize);
    }
    getMoves() {
        return self.moves;
    }

    select() {
        
        gameCanvas.drawBoard()
        for (let move of this.moves) {
            
            if (!move.capture) {
            gameCanvas.context.beginPath();
            gameCanvas.context.arc(boardpos.get(move.to)[0] + (sqSize/2), boardpos.get(move.to)[1] + (sqSize/2), 17, 0, 2 * Math.PI, false);
            gameCanvas.context.fillStyle = 'gray';
            gameCanvas.context.fill();
            }
            else {
                gameCanvas.context.fillStyle = 'rgb(129, 133, 137)';
                gameCanvas.context.fillRect(boardpos.get(move.to)[0], boardpos.get(move.to)[1], sqSize, sqSize);
                gameCanvas.context.fillStyle = 'azure';
                gameCanvas.context.fillRect(boardpos.get(move.to)[0] + 5, boardpos.get(move.to)[1] + 5, sqSize * 0.85, sqSize * 0.85);
            }
        }
        for (let x of GLOBALS.currentBoard.pieces){x.draw()}
    }

    straight(len) {
        let front = new Set();
        if (len == null){len = 9};let orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqfro(temp)
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }front.add(new Move(this.sq, temp));
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }

        let back = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqback(temp)
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }back.add(new Move(this.sq, temp))
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let right = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqright(temp)
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }right.add(new Move(this.sq, temp))
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let left = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqleft(temp)
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            };left.add(new Move(this.sq, temp))
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        return new Set([...back, ...front, ...right, ...left])
    }

    diag(len) {
        let topright = new Set();
        if (len == null){len = 9};let orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqright(GLOBALS.currentBoard.sqfro(temp))
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }topright.add(new Move(this.sq, temp));
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }

        let topleft = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqleft(GLOBALS.currentBoard.sqfro(temp))
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }topleft.add(new Move(this.sq, temp));
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let bottomright = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqright(temp))
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }bottomright.add(new Move(this.sq, temp));
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let bottomleft = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqleft(temp))
            if (temp == null || GLOBALS.currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }bottomleft.add(new Move(this.sq, temp));
            if(GLOBALS.currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        return new Set([...topright, ...topleft, ...bottomright, ...bottomleft])
    }
    


}

const gameCanvas = {
    canvas: document.createElement('canvas'),
    size: [boardSize, boardSize],
    drawBoard: function (){
        for (let i = 0; i <= 7; i++){
            for (let y = 0; y <= 7; y++){
                if (i%2 == 0) {
                    if (y%2 == 0){
                        this.context.fillStyle = "azure"
                        this.context.fillRect(y*sqSize, i*sqSize, sqSize, sqSize);
                    }
                    else {
                        this.context.fillStyle = "darkgreen"
                        this.context.fillRect(y*sqSize, i*sqSize, sqSize, sqSize);
                    }
                }
                else {
                    if (y%2 == 0){
                        this.context.fillStyle = "darkgreen"
                        this.context.fillRect(y*sqSize, i*sqSize, sqSize, sqSize);
                    }
                    else {
                        this.context.fillStyle = "azure"
                        this.context.fillRect(y*sqSize, i*sqSize, sqSize, sqSize);
                    }
                }
            }
        }
    },
    start: function() {
        imageLoad()
        this.canvas.width = this.size[0];
        this.canvas.height = this.size[1];
        this.context = this.canvas.getContext('2d');
        let canvasContainer = document.getElementById("canvas")
        canvasContainer.appendChild(this.canvas)
        this.drawBoard()
        this.canvas.style.display = "block"
    }
};



function loadPage() {
    gameCanvas.start()
    GLOBALS.currentBoard = new Board()
}