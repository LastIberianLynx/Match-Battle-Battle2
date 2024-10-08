// Tile.tsx
import React from 'react';
import './Tile.css';

interface Props {
    image?: string;
    number: number;
    onClick: () => void; // Left click to select
    onContextMenu: (e: React.MouseEvent) => void; // Right click to move
    onKeyDown?: (e: React.KeyboardEvent) => void; 
    pieceHighlight?: boolean;
    health?: number; // Add health prop
    flip?: boolean; // Prop to conditionally apply the flip class
    isOpponent?: boolean; // Prop to apply reddish hue
    experience?: number;
}


interface Pos {
    x: number;
    y: number;
}

const Tile: React.FC<Props> = ({ image, number, onClick, onContextMenu,onKeyDown, pieceHighlight, health, flip, isOpponent, experience }) => {
    const tileClass = (number % 2 === 0) ? "tile black-tile" : "tile white-tile";
    const highlightClass = pieceHighlight ? "highlight" : "";
    const pieceClass = `chess-piece ${pieceHighlight ? 'selected' : ''} ${flip ? 'flip' : ''} ${isOpponent ? 'opponent' : ''}`;
    const experienceClass = experience ? "experience" : "";
    
    const generateStars = (count: number) => {
        const starsArray: string[] = [];
        for (let i = 0; i < count; i++) {
            starsArray.push('★');
        }
        return starsArray.join('');
    };

    const stars = experience ? generateStars(experience) : '';

    return (
        <div
            className={`${tileClass} ${highlightClass}`}
            onClick={onClick}
            onContextMenu={onContextMenu}
            tabIndex={0} // Make the div focusable
            onKeyDown={onKeyDown} // Key down event
        >
            {image && (
                <div className={pieceClass} style={{ backgroundImage: `url("${image}")` }}>
                    {health !== undefined && (
                        <div className="health-bar">
                            <div className="health-bar-fill" style={{ width: `${health}%` }}></div>

                        </div>
                    )}
                    <div className="experience">
                        {stars}
                    </div>
                </div>
            )}
        </div>
    );
};



export default Tile;
