import React, { useState, CSSProperties } from 'react';
import './PlayerPawn.css';
import ImageScrollBox from '../ImageScrollBox/ImageScrollBox';
import { Piece } from "../../Units/UnitShared";

// Define the types for the props
interface PlayerPawnProps {
  level: number;
  reinforcements: number;
  onRestartGame: () => void;
  onLeaveBattle: () => void;
  onEndTurn: () => void;
  units: Piece[];
  attacksPerTurn: number;
  onUnitClickUI: (index: number) => void; 
}

// Define the PlayerPawn component with the defined props
const PlayerPawn: React.FC<PlayerPawnProps> = ({
  reinforcements,
  level,
  onRestartGame,
  onLeaveBattle,
  onEndTurn,
  units,
  attacksPerTurn,
  onUnitClickUI
}) => {
  const [unitName, setUnitName] = useState<string>('');
  const [unitHealth, setUnitHealth] = useState<number>(1);
  const [style, setStyle] = useState<CSSProperties>({});

  const handleAddUnit = () => {
    setUnitName('');
    setUnitHealth(1);
  };

  return (
    <div className="player-pawn" style={style}>
      <h2>Match Battle</h2>
      <div>Level: {level}</div>
      <div>Reinforcements: {reinforcements}</div>
      <div>Moves: {attacksPerTurn}</div>
      <div className="center-button">
        <button onClick={onRestartGame}>Restart Game</button>
      </div>
      {/* { <div className="center-button">
        <button onClick={onLeaveBattle} title="You may lose some of your units">Retreat</button>
      </div> } */}
      { <div className="center-button">
        <button onClick={onEndTurn} title="You may also press space">End Turn</button>
      </div> }
      { <ImageScrollBox units={units} bHumanInput={true} onUnitClickUI={onUnitClickUI}/> }
    </div>
  );
};

export default PlayerPawn;
