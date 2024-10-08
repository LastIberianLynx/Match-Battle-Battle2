import React, { useState, useEffect, CSSProperties } from 'react';
import './EnemyPawn.css';
import ImageScrollBox from '../ImageScrollBox/ImageScrollBox';
import { PieceType, TeamType, Piece } from "../../Units/UnitShared";


// Define the types for the props
interface PlayerPawnProps {
//   position: 'left' | 'right';
  // swipes: number;
  // reinforcements: number;
//   addSwipe: () => void;
//   addUnit: (unit: { name: string; health: number }) => void;
//   attack: () => void;
//   images: string[];
//   timer: number;
  units: Piece[];
  attacksPerTurn: number;
  onUnitClickUI: (index: number) => void;
//   changeFirstImage: () => void;
}

// Define the PlayerPawn component with the defined props
const PlayerPawn: React.FC<PlayerPawnProps> = ({
//   position,
  // swipes,
  // reinforcements,
//   addSwipe,
//   addUnit,
//   attack,
//   images,
//   timer,
  units,
  attacksPerTurn,
  onUnitClickUI
//   changeFirstImage,
}) => {
  const [unitName, setUnitName] = useState<string>('');
  const [unitHealth, setUnitHealth] = useState<number>(1);
  const [style, setStyle] = useState<CSSProperties>({});

//   useEffect(() => {
//     if (position === 'right') {
//       setStyle({ right: '10%' });
//     } else {
//       setStyle({ left: '10%' });
//     }
//   }, [position]);

  const handleAddUnit = () => {
    // addUnit({ name: unitName, health: unitHealth });
    setUnitName('');
    setUnitHealth(1);
  };

  return (
    <div className="enemy-pawn" style={style}>
      <h2>Enemy Army</h2>
{/*       
      <div>Timer: 3</div>
      <div>Swipes: {swipes}</div>
      <div>Reinforcements: {reinforcements}</div> */}
      <div>Moves: {attacksPerTurn}</div>
{/* 
      <div className="center-button">
        <button onClick={attack}>Start Battle</button>
      </div> */}
      { <ImageScrollBox units={units} bHumanInput={false} onUnitClickUI={onUnitClickUI} /> }
    </div>
  );
};

export default PlayerPawn;
