
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

function loadPage(){
    gameCanvas.start()
}