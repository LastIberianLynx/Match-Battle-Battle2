import React, { useRef, useState, useEffect } from 'react';
import Tile from '../Tile/Tile';
import BlackSquareComponent from '../BlackSquare/BlackSquare';
import TerrainFeatureComponent, { terrainConfigs } from '../TerrainFeature/TerrainFeature';
import ProjectileComponent, { projectileConfigs } from '../Projectile/Projectile';
import './Chessboard.css';
import TextMessage from '../TextMessage/TextMessage'; // Import the TextMessage component
import Referee from '../../referee/Referee';
import { enemyConfigs } from '../../Units/Units';
import { PieceType, TeamType, Piece } from "../../Units/UnitShared";
import Projectile from '../Projectile/Projectile';
import PlayerPawn from '../PlayerPawn/PlayerPawn'
import EnemyPawn from '../EnemyPawn/EnemyPawn'
import MessageComponent from '../Message/Message';



const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

class Unit {
    constructor(public name: string, public health: number) { }

    displayInfo(): void {
        console.log(`${this.name} has ${this.health} health.`);
    }
}

const units: Unit[] = [
    new Unit("Archer", 100),
    new Unit("Knight", 150)
];

export interface BlackSquare {
    x: number;
    y: number;
}

export interface TerrainFeature {
    x: number;
    y: number;
    backgroundImage: string;
}

export interface Projectile {
    x: number;
    y: number;
    xdest: number;
    ydest: number;
    backgroundImage: string;

}

const playerUnitsDeck: Piece[] = [];

//loading of game stats from the Match app
let reinforcements: number = 4;
const reinforcementsStored = localStorage.getItem('reinforcements');
reinforcements = reinforcementsStored ? parseInt(reinforcementsStored, 10) : 0;

let level: number = 0;
const storedLevel = localStorage.getItem('level');
// Convert the stored value to a number, or fall back to 0 if it's null
level = storedLevel ? parseInt(storedLevel, 10) : 0;

let maximumMovesPlayer: number = 3;
const maximumMovesPlayerStored = localStorage.getItem('moves');
maximumMovesPlayer = maximumMovesPlayerStored ? parseInt(maximumMovesPlayerStored, 10) : 0;

const unitConfigsObjs = Object.values(enemyConfigs);

function getUnitConfigByName(unitName: string): any | undefined {
    return (enemyConfigs as Record<string, any>)[unitName];
}

// for (let i = 0; i < 8; i++) {
//     const randomIndex = Math.floor(Math.random() * unitConfigsObjs.length);
//     const EnemyObj = unitConfigsObjs[randomIndex];
//     playerUnitsDeck.push({ image: "assets/images/" + EnemyObj.spriteSheet + ".png", x: 0, y: 3, type: PieceType.PAWN, team: TeamType.OUR, health: 80, unitConfigIndex: randomIndex, curMoves: EnemyObj.moves, experience: 0 });
// }
const enemyUnitsDeck: Piece[] = [];


function loadUnits(): Unit[] {
    const unitsData = localStorage.getItem('enemyUnits');
    if (unitsData) {
        const parsedUnits = JSON.parse(unitsData);
        return parsedUnits.map((data: { name: string; health: number }) => new Unit(data.name, data.health));
    }
    return [];
}

const UnitsStorage: Unit[] = loadUnits();

const unitsArray = Object.values(enemyConfigs);
const initialBoardState: Piece[] = [];

for (let i = 0; i < UnitsStorage.length; i++) {
    // const randomIndex = Math.floor(Math.random() * unitConfigsObjs.length);
    // const EnemyObj = unitConfigsObjs[randomIndex];

    const EnemyObj = getUnitConfigByName(UnitsStorage[i].name);
    const EnemyObjIndex = EnemyObj.index;
    // enemyUnitsDeck.push({ image: "assets/images/" + EnemyObj.spriteSheet + ".png", x: 7, y: 3, type: PieceType.PAWN, team: TeamType.OPPONENT, health: 80, unitConfigIndex: randomIndex, curMoves: EnemyObj.moves, experience: 0 });
    if (initialBoardState.length > 8) {
        enemyUnitsDeck.push({ image: "assets/images/" + EnemyObj.spriteSheet + ".png", x: 7, y: 3, type: PieceType.PAWN, team: TeamType.OPPONENT, health: 80, unitConfigIndex: EnemyObjIndex, curMoves: EnemyObj.moves, experience: 0 });
    } else {
        initialBoardState.push({ image: "assets/images/" + EnemyObj.spriteSheet + ".png", x: 7, y: i, type: PieceType.PAWN, team: TeamType.OPPONENT, health: 80, unitConfigIndex: EnemyObjIndex, curMoves: EnemyObj.moves, experience: 0 });

    }
}

// for (let i = 0; i < 8; i++) {
//     const randomIndex = Math.floor(Math.random() * unitsArray.length);
//     const EnemyObj = unitsArray[randomIndex];
//     initialBoardState.push({ image: "assets/images/" + EnemyObj.spriteSheet + ".png", x: 7, y: i, type: PieceType.PAWN, team: TeamType.OPPONENT, health: 80, unitConfigIndex: randomIndex, curMoves: EnemyObj.moves, experience: 0 });
// }

// {
// const randomIndex = Math.floor(Math.random() * enemyArray.length);
// const EnemyObj = enemyArray[randomIndex];
// initialBoardState.push({ image: "assets/images/" + EnemyObj.spriteSheet + ".png", x: 6, y: 0, type: PieceType.PAWN, team: TeamType.OPPONENT, health: 80, unitConfigIndex: randomIndex });
// }
const unitsDataOur = localStorage.getItem('ourUnits');
let UnitsStorageOur: Unit[] = [];

if (unitsDataOur) {
    const parsedUnits = JSON.parse(unitsDataOur);
    UnitsStorageOur = parsedUnits.map((data: { name: string; health: number }) => new Unit(data.name, data.health));
};

let counterUnits = 0;
for (let i = 0; i < UnitsStorageOur.length; i++) {
    // const randomIndex = Math.floor(Math.random() * unitsArray.length);
    // const EnemyObj = unitsArray[randomIndex];
    counterUnits++;
    const OurUnitObj = getUnitConfigByName(UnitsStorageOur[i].name);
    const OurUnitObjIndex = OurUnitObj.index;
    if (counterUnits < 8)
        initialBoardState.push({ image: "assets/images/" + OurUnitObj.spriteSheet + ".png", x: 0, y: i, type: PieceType.KNIGHT, team: TeamType.OUR, health: 50, unitConfigIndex: OurUnitObj.index, curMoves: OurUnitObj.moves, experience: 0 });
    else
        playerUnitsDeck.push({ image: "assets/images/" + OurUnitObj.spriteSheet + ".png", x: 0, y: i, type: PieceType.KNIGHT, team: TeamType.OUR, health: 50, unitConfigIndex: OurUnitObj.index, curMoves: OurUnitObj.moves, experience: 0 });

}

const terrainArray = Object.values(terrainConfigs);
const initialTerrainFeatures: TerrainFeature[] = [];

for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * terrainArray.length);
    const terrainObj = terrainArray[randomIndex];
    initialTerrainFeatures.push({ x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8), backgroundImage: terrainObj.spriteSheet });
}

const initialBlackSquares: BlackSquare[] = [];

for (let i = 0; i < 8; i++) {
    initialBlackSquares.push({ x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8) });
}


const initialProjectiles: Projectile[] = []; //for testing
const projectileArray = Object.values(projectileConfigs);


for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * terrainArray.length);
    const projectileObj = projectileArray[randomIndex];
    const x1 = Math.floor(Math.random() * 8);
    const y1 = Math.floor(Math.random() * 8);
    initialProjectiles.push({ x: x1, y: y1, xdest: x1 + 3, ydest: y1, backgroundImage: projectileObj.spriteSheet });
}


export default function Chessboard() {
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [blackSquares, setBlackSquares] = useState<BlackSquare[]>(initialBlackSquares);
    const [terrainFeatures, setTerrainFeatures] = useState<TerrainFeature[]>(initialTerrainFeatures);
    const [projectiles, setProjectiles] = useState<Projectile[]>(initialProjectiles);
    const [textMessages, setTextMessages] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);
    const [currentTurn, setCurrentTurn] = useState<TeamType>(TeamType.OUR);
    const [movesLeft, setMovesLeft] = useState<number>(maximumMovesPlayer);

    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    let nextMessageId = useRef(0);

    const currentTurnRef = useRef(currentTurn);
    const selectedPieceRef = useRef(selectedPiece);
    useEffect(() => {
        currentTurnRef.current = currentTurn;
    }, [currentTurn]); //this checks the actual state. whereas the other way isnt working.

    useEffect(() => {
        selectedPieceRef.current = selectedPiece;
    }, [selectedPiece]); //this checks the actual state. whereas the other way isnt working.


    useEffect(() => {
        handleProjectiles(); // Start handling projectiles once on mount
    }, []); // Empty dependency array ensures it runs only once

    useEffect(() => {
        if (currentTurn === TeamType.OPPONENT) {
            makeAIMoves();
        }
    }, [currentTurn]);

    useEffect(() => {
        if (movesLeft === 0) {
            restoreUnitMoves();
            setCurrentTurn(prevTurn => prevTurn === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR);
            setMovesLeft(maximumMovesPlayer);
        }
    }, [movesLeft]);


    function moveSpecific(addX: number, addY: number) {
        if (!selectedPiece) return;
        movePieceTo(selectedPiece.x + addX, selectedPiece.y + addY);
    }

    function moveRight() {
        if (!selectedPiece) return;
        movePieceTo(selectedPiece.x + 1, selectedPiece.y);
    }

    function moveLeft() {
        if (!selectedPiece) return;
        movePieceTo(selectedPiece.x - 1, selectedPiece.y);
    }

    function moveUp() {
        if (!selectedPiece) return;
        movePieceTo(selectedPiece.x, selectedPiece.y + 1);
    }

    function moveDown() {
        if (!selectedPiece) return;
        movePieceTo(selectedPiece.x, selectedPiece.y - 1);
    }

    function selectPiece(x: number, y: number) {

        if (currentTurn !== TeamType.OUR) return; // Prevent selection during opponent's turn
        const piece = pieces.find(p => p.x === x && p.y === y);

        if (piece) {
            if (selectedPiece && (selectedPiece.x !== x || selectedPiece.y !== y)) {
                setSelectedPiece(piece);
            } else if (selectedPiece && selectedPiece.x === x && selectedPiece.y === y) {
                setSelectedPiece(null);
            } else {
                setSelectedPiece(piece);
            }
        } else {
            if (selectedPiece) {
                setSelectedPiece(null);
            }
        }
    }

    function movePieceTo(x: number, y: number) {

        if (selectedPiece && selectedPiece.team === TeamType.OUR && currentTurn === TeamType.OUR) { // Check if it's player's turn and if the selected piece belongs to the player


            // const closestPiece = referee.getClosestEnemy(selectedPiece, pieces);
            // if(closestPiece)
            // addTextMessage("Closest Piece", closestPiece.x, closestPiece.y);
            if (selectedPiece.curMoves < 1) {
                addTextMessage("Out of moves!", x, 7 - y, "red");
                return;
            }

            const validMove = referee.isValidMove(selectedPiece.x, selectedPiece.y, x, y, selectedPiece.type, selectedPiece.team, pieces, selectedPiece.unitConfigIndex);
            if (validMove) {

                selectedPiece.x = x;
                selectedPiece.y = y;
                selectedPiece.curMoves -= 1;

                // setPieces(pieces.map(p =>
                //     p.x === selectedPiece.x && p.y === selectedPiece.y
                //         ? { ...p, x, y, curMoves: selectedPiece.curMoves - 1 }
                //         : p
                // ));
                addTextMessage("Moving!", x, 7 - y, "blue");
                // setSelectedPiece(null);
                handleEndOfMove();
            } else {
                const bEnemyOccupied = referee.getPieceInTile(x, y, pieces);
                if (bEnemyOccupied && bEnemyOccupied.team !== TeamType.OUR) {

                    // const attackDamage = referee.getAttackResultCombat(selectedPiece.unitConfigIndex, bEnemyOccupied.unitConfigIndex);
                    // addTextMessage("Pow ! " + attackDamage, x, 7.20 - y);
                    // bEnemyOccupied.health -= attackDamage;

                    // if (bEnemyOccupied.health <= 0) {
                    //     const newPieces = referee.removePiece(x, y, pieces);

                    //     setPieces(newPieces.map(p =>
                    //         p.x === selectedPiece.x && p.y === selectedPiece.y
                    //             ? { ...p, health: p.health }
                    //             : p
                    //     ));
                    // }
                    if (referee.isUnitInRange(selectedPiece, bEnemyOccupied)) {
                        attack(selectedPiece, bEnemyOccupied);
                        selectedPiece.curMoves = -1;
                        handleEndOfMove();
                    }
                }
                // setSelectedPiece(null);

            }
        }
        //check if free x
        if (!playerUnitsDeck.length)
            return;
        const bOccupiedHumanReiforcementTile = referee.getPieceInTile(0, 3, pieces)
        const bOccupiedEnemyReiforcementTile = referee.getPieceInTile(7, 3, pieces)
        if (!bOccupiedHumanReiforcementTile) {
            // playerUnitsDeck[0].x = 0;
            // playerUnitsDeck[0].y = 3;
            // initialBoardState.push(playerUnitsDeck[0]);
            // setPieces(prevPieces => [...prevPieces, initialBoardState[initialBoardState.length - 1]]);
            // playerUnitsDeck.splice(0, 1);
        }
        if (!bOccupiedEnemyReiforcementTile) {
            // enemyUnitsDeck[0].x = 7;
            // enemyUnitsDeck[0].y = 3;
            // initialBoardState.push(enemyUnitsDeck[0]);
            // // setPieces(initialBoardState);
            // setPieces(prevPieces => [...prevPieces, initialBoardState[initialBoardState.length - 1]]);
            // enemyUnitsDeck.splice(0, 1);

        }


    }

    function attack(AttackPiece: Piece, DefendPiece: Piece) {
        const projectileAttack = referee.getProjectileConfig(AttackPiece);
        if (projectileAttack && projectileAttack?.name != "None") {
            // Create a new projectile object
            const newProjectile = {
                x: AttackPiece.x,
                y: 7 - AttackPiece.y,
                xdest: DefendPiece.x, // Adjust destination as needed
                ydest: 7 - DefendPiece.y,
                backgroundImage: projectileAttack.spriteSheet
            };

            // Add the new projectile to the initialProjectiles array
            // initialProjectiles.push(newProjectile);

            // Update the state with new projectiles
            setProjectiles(prevProjectiles => [...prevProjectiles, newProjectile]);
            addTextMessage("Skrrrt", DefendPiece.x, 7.20 - DefendPiece.y);

        }

        const attackDamage = referee.getAttackResultCombat(AttackPiece, DefendPiece, AttackPiece.unitConfigIndex, DefendPiece.unitConfigIndex);

        const attackMessages = [
            `POWwW !  ${attackDamage}`,
            `KaBonG !  ${attackDamage}`,
            `BaM pOW !  ${attackDamage}`
        ];

        // Select a random message from the array
        const randomMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)];
        addTextMessage(randomMessage, DefendPiece.x, 7.20 - DefendPiece.y, 'red');

        DefendPiece.health -= attackDamage;
        // if (DefendPiece.health <= 0) {
        //     const newPieces = referee.removePiece(DefendPiece.x, DefendPiece.y, pieces);
        //     setPieces(newPieces);
        // }
        if (DefendPiece.health <= 0) {
            //if enemy unit dies from my attack, my attacking unit gains 1 star experience
            AttackPiece.experience++;
            const newPieces = referee.removePiece(DefendPiece.x, DefendPiece.y, pieces);

            setPieces(newPieces.map(p =>
                p.x === AttackPiece.x && p.y === AttackPiece.y
                    ? { ...p, health: p.health }
                    : p
            ));
        }
        let opponentPieces = pieces.filter(p => p.team === TeamType.OPPONENT);
        if (!opponentPieces.length) {
            addTextMessage("You WON the battle.", 3, 3, 'red');
            setTimeout(() => {
                wonBattle();
            }, 2000); // 2000 milliseconds = 2 seconds
            return;
        }

    }

    function handleProjectiles() {
        const intervalId = setInterval(() => {
            if (initialProjectiles.length < 1)
                return;
            setProjectiles(prevProjectiles => {
                let updatedProjectiles = prevProjectiles.map(proj => {
                    const dx = proj.xdest - proj.x;
                    const dy = proj.ydest - proj.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Determine the speed of the projectile
                    const speed = 0.25; // Adjust the speed as needed
                    if (distance < speed) {
                        // Projectile has reached the destination
                        //here we deliver damage to enemy unit.
                        return null;
                    }

                    // Calculate the unit vector towards the destination
                    const unitX = dx / distance;
                    const unitY = dy / distance;

                    // Move the projectile
                    return {
                        ...proj,
                        x: proj.x + unitX * speed,
                        y: proj.y + unitY * speed
                    };
                }).filter((proj): proj is Projectile => proj !== null); // Type assertion to filter out nulls

                // Clear the interval if no projectiles are left
                // if (updatedProjectiles.length === 0) {
                //     clearInterval(intervalId);
                // }

                return updatedProjectiles;
            });
        }, 100); // Adjust the interval time as needed
    }

    function handleEndOfMove() {
        setMovesLeft(prevMoves => prevMoves - 1);
    }

    function handleTileClick(x: number, y: number) {
        selectPiece(x, y);
    }

    function handleTileContextMenu(e: React.MouseEvent, x: number, y: number) {
        e.preventDefault();
        movePieceTo(x, y);

    }


    function addTextMessage(text: string, x: number, y: number, color: string = 'white') {
        const id = nextMessageId.current++;
        setTextMessages((prevMessages) => [
            ...prevMessages,
            { id, text, x, y, color },
        ]);
    }

    function handleTextMessageEnd(id: number) {
        setTextMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== id)
        );
    }

    function restoreUnitMoves() {
        for (let i = 0; i < pieces.length; ++i) {
            const unitConfig = referee.getUnitConfig(pieces[i].unitConfigIndex);
            pieces[i].curMoves = unitConfig.moves;
        }

        // setPieces(pieces => {
        //     return pieces.map(...)
        // });

        // setPieces(pieces.map(piece => {
        //     // Fetch the unit configuration for the current piece
        //     const unitConfig = referee.getUnitConfig(piece.unitConfigIndex);

        //     // Return the updated piece with the moves restored from unitConfig
        //     return {
        //         ...piece,
        //         curMoves: unitConfig.moves
        //     };
        // }));

    }
    function handleEndTurn() {
        if (currentTurn === TeamType.OUR)
            setMovesLeft(0);

    }

    function makeAIMoves() {
        //should do an utility AI to analyze attack and defense of human units. 
        //And move each unit according to strenght and weakness, and by best utility priority.
        // as is i leave it as a random move.
        //but it should be at least, an forward general advance like Total War.
        let aiMoves = Math.min(3 + level, 8);
        let attemptsToMove = 0; //this is to prevent AI from getting stuck.


        const interval = setInterval(() => {

            attemptsToMove++;
            if (attemptsToMove > 10)
                aiMoves = 0;
            if (aiMoves > 0) {
                let opponentPieces = pieces.filter(p => p.team === TeamType.OPPONENT);
                if (!opponentPieces.length) {
                    addTextMessage("You WON the battle.", 3, 3, 'red');
                    setTimeout(() => {
                        wonBattle();
                    }, 3000); // 2000 milliseconds = 2 seconds
                    return;
                }
                let ourPieces = pieces.filter(p => p.team === TeamType.OUR);
                if (!ourPieces.length) {
                    addTextMessage("You lost the game. Restarting...", 3, 3, 'red');
                    setTimeout(() => {
                        restartGame();
                    }, 3000); // 2000 milliseconds = 2 seconds
                    return;
                }

                opponentPieces = opponentPieces.filter(p => p.curMoves > 0);
                if (opponentPieces.length > 0) {
                    let piecesCanAttack = referee.getAIUnitsThatCanAttack(opponentPieces);

                    if (piecesCanAttack.length > 0) {
                        opponentPieces = piecesCanAttack;
                    }
                    const randomPieceIndex = Math.floor(Math.random() * opponentPieces.length);
                    const piece = opponentPieces[randomPieceIndex];
                    //instead of getting a random piece, i need to prioritize units that are close to enemies for combat moves.

                    const closestEnemyPiece = referee.getClosestEnemy(piece, pieces);
                    if (closestEnemyPiece) {
                        // addTextMessage("Closest Piece", closestEnemyPiece.x, 7-closestEnemyPiece.y); //debug only
                        const unitConfig = referee.getUnitConfig(piece.unitConfigIndex);


                        // const validMoves: { x: number, y: number }[] = getValidMoves(piece); // Define the type of validMoves
                        // if (validMoves.length > 0) {
                        // const randomMoveIndex = Math.floor(Math.random() * validMoves.length);
                        // const move = validMoves[randomMoveIndex];
                        // setPieces(prevPieces => prevPieces.map(p =>
                        //     p === piece ? { ...p, x: move.x, y: move.y } : p
                        // ));
                        // }
                        const nextTile = referee.getNextTilesTowardsTarget(piece.x, piece.y, closestEnemyPiece.x, closestEnemyPiece.y, 1, piece, pieces);

                        //there's an issue with this ^. 
                        //its not getting the tiles right.
                        //we need to make this one work properly ^

                        const enemyFound = referee.isTileOccupiedByEnemy(nextTile.x, nextTile.y, piece.team, pieces);
                        //should also prevent move if it is occupied by a friendly.

                        if (enemyFound) {

                            attack(piece, enemyFound);
                            aiMoves--;
                            piece.curMoves--;

                        } else {

                            if (!referee.tileIsOccupied(nextTile.x, nextTile.y, pieces)) {
                                //this will prevent piece overlapping.
                                // piece.x = nextTile.x;
                                // piece.y = nextTile.y;
                                setPieces(prevPieces => prevPieces.map(p =>
                                    p === piece ? { ...p, x: nextTile.x, y: nextTile.y } : p
                                ));
                                // setPieces(pieces);
                            }
                            piece.curMoves--;
                            aiMoves--;
                        }

                        // const validMoves: { x: number, y: number }[] = getValidMoves(piece); // Define the type of validMoves
                        // if (validMoves.length > 0) {
                        //     const randomMoveIndex = Math.floor(Math.random() * validMoves.length);
                        //     const move = validMoves[randomMoveIndex];
                        //     setPieces(prevPieces => prevPieces.map(p =>
                        //         p === piece ? { ...p, x: move.x, y: move.y } : p
                        //     ));
                        // }
                    }

                } else {
                    addTextMessage("No more moves.", 4, 4, 'red');
                    aiMoves = 0;
                    //skip turn.
                }

            } else {
                clearInterval(interval);
                setCurrentTurn(TeamType.OUR);
            }
        }, 500); // Adjust the interval time as needed
        UnitClickUI(0, TeamType.OPPONENT);
    }

    function UnitClickUI(index: number = 0, Team: TeamType = TeamType.OUR) {

        // setPieces(initialBoardState);
        // setPieces(prevPieces => {
        //     const newArr = [...prevPieces];
        //     [newArr[0], newArr[index]] = [newArr[index], newArr[0]];
        //     return newArr;
        //   });

        // let temp = playerUnitsDeck[0];
        // playerUnitsDeck[0] = playerUnitsDeck[index];
        // playerUnitsDeck[index] = temp;
        let TileX;
        let TileY = -1;
        let bOccupiedHumanReiforcementTile;

        if (Team == TeamType.OUR)
            TileX = 0;
        else
            TileX = 7;

        for (let i = 0; i < 7; ++i) {
            bOccupiedHumanReiforcementTile = referee.getPieceInTile(TileX, i, pieces)
            if (!bOccupiedHumanReiforcementTile) {
                TileY = i;
                break;
            }
        }
        if (Team == TeamType.OUR) {

            if (!bOccupiedHumanReiforcementTile && reinforcements > 0) {
                playerUnitsDeck[index].x = TileX;
                playerUnitsDeck[index].y = TileY;
                initialBoardState.push(playerUnitsDeck[index]);
                setPieces(prevPieces => [...prevPieces, initialBoardState[initialBoardState.length - 1]]);
                playerUnitsDeck.splice(index, 1);
                reinforcements--;
            }
        } else if (!bOccupiedHumanReiforcementTile && enemyUnitsDeck.length) {
            enemyUnitsDeck[0].x = TileX;
            enemyUnitsDeck[0].y = TileY;
            initialBoardState.push(enemyUnitsDeck[0]);
            // setPieces(initialBoardState);
            setPieces(prevPieces => [...prevPieces, initialBoardState[initialBoardState.length - 1]]);
            enemyUnitsDeck.splice(0, 1);
        }
    }

    function getValidMoves(piece: Piece): { x: number, y: number }[] {
        //replaced by getting closest unit.
        //AI
        //this is just a randomizing movement function
        //we need the other function to work, so we move consistently towards my units.

        const validMoves: { x: number, y: number }[] = [];
        // Logic to calculate valid moves for the piece
        // For simplicity, here we assume the piece can move to any empty adjacent square

        //should take into account Piece Move so i need configs here.
        // get the move of the piece and multiply it with the values below v

        const directions = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];

        directions.forEach(direction => {
            const newX = piece.x + direction.x;
            const newY = piece.y + direction.y;
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                const occupied = pieces.some(p => p.x === newX && p.y === newY);

                if (!occupied) {
                    validMoves.push({ x: newX, y: newY });

                } else {
                    const enemyPiece = referee.isTileOccupiedByEnemy(newX, newY, piece.team, pieces);
                    if (enemyPiece)
                        validMoves.push({ x: newX, y: newY });
                }
            }
        });

        return validMoves;
    }


    const restartGame = () => {
        // alert("yoyo");
        const resetLevel = 0;
        localStorage.setItem('level', resetLevel.toString()); //reset
        localStorage.setItem('ourUnits', JSON.stringify([])); //reset
        // window.location.reload();
        window.location.href = '../build/index.html';
    };

    const leaveBattle = () => {

        wonBattle();
        return;
        // alert("yoyo");
        level++;
        localStorage.setItem('level', level.toString());

        const reset = 0;
        localStorage.setItem('reinforcements', reset.toString()); //reset
        localStorage.setItem('moves', reset.toString());
        // window.location.href = '../test/index2.html';

        const ourPieces = referee.getAllPiecesOfTeam(TeamType.OUR, pieces);
        const unitsData2 = ourPieces
            .map(unit => {
                // 50% chance to include each unit
                if (Math.random() > 0.5) {
                    return {
                        name: referee.getUnitConfig(unit.unitConfigIndex).name, // Convert image path to its name
                        xp: unit.experience
                    };
                }
                return null; // Exclude unit from being saved
            })
            .filter(unit => unit !== null); // Filter out units that weren't saved

        localStorage.setItem('ourUnits', JSON.stringify(unitsData2));
        window.location.href = '../test/index.html';
    };

    function wonBattle() {
        saveUnits(units);
        level++;
        localStorage.setItem('level', level.toString());
        // const reset = 0;

        // let reinforcementsStored = localStorage.getItem('reinforcements');
        // let reinforcementsNum = reinforcementsStored ? parseInt(reinforcementsStored, 10) : 0;
        // reinforcementsNum = Math.max(reinforcementsNum - 1, 0);

        // let movesStored = localStorage.getItem('moves');
        // let movesNum = movesStored ? parseInt(movesStored, 10) : 3;
        // movesNum = Math.max(reinforcements - 1, 2);

        // let timeStored = localStorage.getItem('maximumTime');
        // let timeNum = timeStored ? parseInt(timeStored, 10) : 120;
        // timeNum = Math.max(timeNum - (10 + level), 20);


        // localStorage.setItem('reinforcements', reinforcementsNum.toString()); //reset
        // localStorage.setItem('moves', movesNum.toString());
        // localStorage.setItem('maximumTime', timeNum.toString());
        window.location.href = '../build/index.html';

    }

    function saveUnits(units: Unit[]): void {
        // const unitsData = units.map(unit => ({ name: unit.name, health: unit.health }));
        // localStorage.setItem('units', JSON.stringify(unitsData));
        let ourPieces = referee.getAllPiecesOfTeam(TeamType.OUR, pieces);
        ourPieces.push(...playerUnitsDeck);
        const unitsData2 = ourPieces.map(unit => ({
            name: referee.getUnitConfig(unit.unitConfigIndex).name, // Convert image path to its name
            xp: unit.experience
        }));
        localStorage.setItem('ourUnits', JSON.stringify(unitsData2));

    }

    function loadUnits(): Unit[] {
        const unitsData = localStorage.getItem('units');
        if (unitsData) {
            const parsedUnits = JSON.parse(unitsData);
            return parsedUnits.map((data: { name: string; xp: number }) => new Unit(data.name, data.xp));
        }
        return [];
    }
    function handleTileKeyDown(e: React.KeyboardEvent, x: number, y: number) {
        e.preventDefault();
        // movePieceTo(1,0);
        if (e.code === "Space" && currentTurn === TeamType.OUR) {
            handleEndTurn();
            // const collectedGold = 115; // Example gold value
            // localStorage.setItem('gold', collectedGold.toString());

        } else if ((e.code === "KeyW" || e.code === "Numpad8") && currentTurn === TeamType.OUR) {
            moveUp();
        } else if ((e.code === "KeyA" || e.code === "Numpad4") && currentTurn === TeamType.OUR) {
            moveLeft();
        } else if ((e.code === "KeyS" || e.code === "Numpad2") && currentTurn === TeamType.OUR) {
            moveDown();
        } else if ((e.code === "KeyD" || e.code === "Numpad6") && currentTurn === TeamType.OUR) {
            moveRight();
        } else if ((e.code === "Numpad9") && currentTurn === TeamType.OUR) {
            moveSpecific(1, 1);
        } else if ((e.code === "Numpad3") && currentTurn === TeamType.OUR) {
            moveSpecific(1, -1);
        } else if ((e.code === "Numpad7") && currentTurn === TeamType.OUR) {
            moveSpecific(-1, 1);
        } else if ((e.code === "Numpad1") && currentTurn === TeamType.OUR) {
            moveSpecific(-1, -1);
        }



    }

    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = "";
            let health: number | undefined;
            let flip = true;
            let isOpponent = false;
            let experience = 0;

            pieces.forEach(p => {
                if (p.x === i && p.y === j) {
                    image = p.image;
                    health = p.health;
                    if (p.team === TeamType.OUR) {
                        flip = false;
                    }
                    if (p.team === TeamType.OPPONENT) {
                        isOpponent = true;
                    }
                    experience = p.experience;

                }
            });

            board.push(
                <Tile
                    key={`${j},${i}`}
                    image={image}
                    number={number}
                    onClick={() => handleTileClick(i, j)}
                    onContextMenu={(e) => handleTileContextMenu(e, i, j)}
                    onKeyDown={(e) => handleTileKeyDown(e, i, j)} // Pass the key down handler
                    pieceHighlight={selectedPiece ? selectedPiece.x === i && selectedPiece.y === j : false}
                    health={health}
                    flip={flip}
                    isOpponent={isOpponent}
                    experience={experience}

                />
            );
        }
    }

    return (
        <div id="chessboard" ref={chessboardRef}>
            <PlayerPawn
                // position="left"
                // swipes={3}
                reinforcements={reinforcements}
                level={level}
                // addSwipe={addSwipe}
                // addUnit={addUnit}
                // attack={attack}
                // images={images}
                onRestartGame={restartGame}
                onLeaveBattle={leaveBattle}
                onEndTurn={handleEndTurn}
                units={playerUnitsDeck}
                attacksPerTurn={movesLeft}
                onUnitClickUI={UnitClickUI}
            />
            <EnemyPawn
                // position="left"
                // swipes={3}
                // reinforcements={4}
                // addSwipe={addSwipe}
                // addUnit={addUnit}
                // attack={attack}
                // images={images}
                units={enemyUnitsDeck}
                attacksPerTurn={Math.min(3 + level, 8)}
                onUnitClickUI={UnitClickUI}

            />
            {board}
            {blackSquares.map((feature, index) => (
                <BlackSquareComponent key={index} x={feature.x} y={feature.y} onContextMenu={(e) => handleTileContextMenu(e, feature.x, 7 - feature.y)} />
            ))}
            {terrainFeatures.map((feature, index) => (
                <TerrainFeatureComponent key={index} x={feature.x} y={feature.y} backgroundImage={feature.backgroundImage} onContextMenu={(e) => handleTileContextMenu(e, feature.x, 7 - feature.y)} />
            ))}
            {projectiles.map((feature, index) => (
                <ProjectileComponent key={index} x={feature.x} y={feature.y} backgroundImage={feature.backgroundImage} />
            ))}
            {textMessages.map((message) => (
                <TextMessage
                    key={message.id}
                    text={message.text}
                    x={message.x}
                    y={message.y}
                    color={message.color} // Pass color here
                    onAnimationEnd={() => handleTextMessageEnd(message.id)}

                />
            ))}

        </div>
    );
}
