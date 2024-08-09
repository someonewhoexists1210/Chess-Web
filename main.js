
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

const charcode = (l) => l.charCodeAt(0) - 96 ;
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const boardpos = new Map();

for (let i = 0; i <= 7; i++){
    for (let y = 0; y <= 7; y++){
        boardpos.set(String.fromCharCode(i+97) + (y+1), [i * sqSize, boardSize - (sqSize * (y+1))])
    }}

class Move{
    constructor(from, to, passant = false){
        this.from = from;
        this.to = to;
        this.capture = GLOBALS.currentBoard.squareoccupied(to)
        if (passant){this.capture = true}
        this.piece = GLOBALS.currentBoard.squareoccupied(from, null, true)
        if (!this.piece){debugger}
        this.color = Number(this.piece.isBlack)
        if (this.capture){
            this.takenPiece = GLOBALS.currentBoard.squareoccupied(to, null, true)   
            if (passant){
                this.passant = true
                let frontOrBack = (this.color) ? to[0] + (Number(to[1]) + 1):to[0] + (Number(to[1]) - 1)
                this.takenPiece = GLOBALS.currentBoard.squareoccupied(frontOrBack, null, true)
            }
        }
    }
}

class Board {
    constructor() {
        this.bking = new King(true, 'e8');
        this.wking = new King(false, 'e1');
        this.selected = undefined;
        this.whites_turn = true;
        this.pieces = [
            new Pawn(false, 'a2'),
            new Pawn(false, 'b2'),
            new Pawn(false, 'c2'),
            new Pawn(false, 'd2'),
            new Pawn(false, 'e2'),
            new Pawn(false, 'f2'),
            new Pawn(false, 'g2'),
            new Pawn(false, 'h2'),

            new Pawn(true, 'a7'),
            new Pawn(true, 'b7'),
            new Pawn(true, 'c7'),
            new Pawn(true, 'd7'),
            new Pawn(true, 'e7'),
            new Pawn(true, 'f7'),
            new Pawn(true, 'g7'),
            new Pawn(true, 'h7'),

            new Bishop(false, 'c1'),
            new Bishop(false, 'f1'),
            new Bishop(true, 'c8'),
            new Bishop(true, 'f8'),

            new Knight(false, 'b1'),
            new Knight(false, 'g1'),
            new Knight(true, 'b8'),
            new Knight(true, 'g8'),

            new Rook(false, 'h1'),
            new Rook(false, 'a1'),
            new Rook(true, 'a8'),
            new Rook(true, 'h8'),

            new Queen(false, 'd1'),
            new Queen(true, 'd8'),

            this.bking, this.wking
        ];
        this.wpieces = [];
        this.bpieces = [];
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

    getSq(pos){
        for (let sq of boardpos.keys()){
            let [posX, posY] = boardpos.get(sq)
            if (posX <= pos[0] && pos[0] <= posX + sqSize){
                if (posY <= pos[1] && pos[1] <= posY + sqSize){
                    return sq
                }
            }
        }
        return null
    }

    async checkClick(e){
        let pos = getMousePosition(e);
        if (pos[0] <= boardSize && pos[1] <= boardSize) {
            let sq = this.getSq(pos)
            for (let x of this.pieces){
                if (x.sq == sq) {
                    if (this.whites_turn != x.isBlack && this.whites_turn != this.color){
                        x.select();
                        this.selected = {sq: sq, piece: x};
                        return;
                    }
                }
            }
            if (this.selected != undefined){
                for (let o of this.selected.piece.moves){
                    if (o.to == sq){
                        //Move Piece
                        this.selected = undefined
                        return;
                    }
                }
            }
            
            gameCanvas.drawBoard()            
            for (let x of this.pieces){x.draw()}
        }
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
    
};
class Piece {
    constructor(isBlack, sq, points) {  
        this.isBlack = isBlack;
        this.img = null;
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
    


}class Pawn extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 1);
        this.img = GLOBALS.Images.get("Pawn")[Number(isBlack)];
        
    }

    getMoves() {
        let moves = new Set();
        let sqinfro = (this.isBlack) ? GLOBALS.currentBoard.sqback(this.sq) : GLOBALS.currentBoard.sqfro(this.sq)
        
        
        if (!GLOBALS.currentBoard.squareoccupied(sqinfro, null)){
            moves.add(new Move(this.sq, sqinfro))
        }
        if ((this.sq[1] == '7' && this.isBlack) && !GLOBALS.currentBoard.squareoccupied(GLOBALS.currentBoard.sqback(sqinfro), null) && moves.size == 1){
            moves.add(new Move(this.sq, GLOBALS.currentBoard.sqback(sqinfro)))
        
        }else if ((this.sq[1] == '2' && !this.isBlack) && !GLOBALS.currentBoard.squareoccupied(GLOBALS.currentBoard.sqfro(sqinfro), null) && moves.size == 1){
            moves.add(new Move(this.sq, GLOBALS.currentBoard.sqfro(sqinfro)))
        }

        let cap1 = GLOBALS.currentBoard.sqleft(sqinfro), cap2 = GLOBALS.currentBoard.sqright(sqinfro)
        if (GLOBALS.currentBoard.squareoccupied(cap1, !this.isBlack)){
            moves.add(new Move(this.sq, cap1))
        }

        if (GLOBALS.currentBoard.squareoccupied(cap2, !this.isBlack)){
            moves.add(new Move(this.sq, cap2))
        }


        let x = this.enpassant()
        if (x != undefined){
            moves.add(new Move(this.sq, x.targetSq, true))
        }

        this.moves = new Set(moves)
        
    }
    enpassant() {
        let mv;
        if ((this.sq[1] == '4' && this.isBlack) || (this.sq[1] == '5' && !this.isBlack)){
            let p = GLOBALS.currentBoard.lastMove

            if (p.piece instanceof Pawn){
                if (Number(p.from[1]) - Number(p.to[1]) == 2 || Number(p.from[1]) - Number(p.to[1]) == -2){
                    if (GLOBALS.currentBoard.sqright(this.sq) == p.to){
                        mv =  (this.isBlack) ? GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqright(this.sq)):
                        GLOBALS.currentBoard.sqfro(GLOBALS.currentBoard.sqright(this.sq));
                    }else if (GLOBALS.currentBoard.sqleft(this.sq) == p.to){
                        mv =  (this.isBlack) ? GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqleft(this.sq)):
                        GLOBALS.currentBoard.sqfro(GLOBALS.currentBoard.sqleft(this.sq));
                    }
                }
            }
        }
        if (mv){
            return {targetSq: mv}
        }
    }

}class Bishop extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 3);
        this.img = GLOBALS.Images.get("Bishop")[Number(isBlack)];
    }

    getMoves() {
        this.moves = this.diag(null)
    }
}class Knight extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 3);
        this.img = GLOBALS.Images.get("Knight")[Number(isBlack)];
    }

    getMoves() {
        this.moves = new Set();   
        let possibleMoves = [
            GLOBALS.currentBoard.sqfro(GLOBALS.currentBoard.sqfro(GLOBALS.currentBoard.sqleft(this.sq))),
            GLOBALS.currentBoard.sqfro(GLOBALS.currentBoard.sqfro(GLOBALS.currentBoard.sqright(this.sq))),
            GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqleft(this.sq))),
            GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqback(GLOBALS.currentBoard.sqright(this.sq))),
            GLOBALS.currentBoard.sqright(GLOBALS.currentBoard.sqright(GLOBALS.currentBoard.sqfro(this.sq))),
            GLOBALS.currentBoard.sqright(GLOBALS.currentBoard.sqright(GLOBALS.currentBoard.sqback(this.sq))),
            GLOBALS.currentBoard.sqleft(GLOBALS.currentBoard.sqleft(GLOBALS.currentBoard.sqfro(this.sq))),
            GLOBALS.currentBoard.sqleft(GLOBALS.currentBoard.sqleft(GLOBALS.currentBoard.sqback(this.sq))),
        ]
        for (let mv of possibleMoves) {
            if (mv != null && !GLOBALS.currentBoard.squareoccupied(mv, this.isBlack)) {
                this.moves.add(new Move(this.sq, mv))
            }
        }

    }
}class Rook extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 5);
        this.img = GLOBALS.Images.get("Rook")[Number(isBlack)];
        this.moved = false;
    }
    getMoves() {
        this.moves = this.straight(null)
    }
}class Queen extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 9);
        this.img = GLOBALS.Images.get("Queen")[Number(isBlack)];
    }
    
    getMoves() {
        this.moves = new Set([...this.straight(null), ...this.diag(null)])
    }
}
class King extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, Infinity);
        this.img = GLOBALS.Images.get("King")[Number(isBlack)];
        this.moved = false;
        this.incheck = false;

    }

    getMoves() {
        this.moves = new Set([...this.straight(1), ...this.diag(1)])        
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

function getMousePosition(event) {
    let rect = gameCanvas.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y];
};
gameCanvas.canvas.addEventListener('mousedown', function (e) {
    if (GLOBALS.currentBoard != undefined){
        GLOBALS.currentBoard.checkClick(e)
    }
});
function loadPage() {
    gameCanvas.start()
    GLOBALS.currentBoard = new Board()
}
