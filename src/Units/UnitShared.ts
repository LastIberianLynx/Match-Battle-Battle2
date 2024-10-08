export interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
    health: number;
    unitConfigIndex: number;
    curMoves: number;
    experience: number;
}

export enum PieceType {
        PAWN,
        BISHOP,
        KNIGHT,
        ROOK,
        QUEEN,
        KING
    }
    
    export enum TeamType {
        OPPONENT,
        OUR
    }