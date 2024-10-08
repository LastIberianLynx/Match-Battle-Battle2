import React, { useEffect, useState } from 'react';
import './ImageScrollBox.css';
import { PieceType, TeamType, Piece } from "../../Units/UnitShared";
import { enemyConfigs } from '../../Units/Units';

// Define the types for the props
interface ImageScrollBoxProps {
  units: Piece[];
  bHumanInput: boolean;
  onUnitClickUI: (index: number) => void; // Callback to handle clicks
}

const ImageScrollBox: React.FC<ImageScrollBoxProps> = ({ units, bHumanInput, onUnitClickUI }) => {
  const [unitImages, setUnitImages] = useState(units);

  const handleImageClick = (index: number) => {
    if(!bHumanInput)
      return;
    onUnitClickUI(index);
  };

  const getStars = (experience: number) => {
    const stars = experience;
    return '★'.repeat(stars);
  };

  return (
    <div>
      <div className="scroll-box">
        {unitImages.map((unit, index) => (
          <div key={index}>
            <img
              src={unit.image}
              alt={`game cover ${index}`}
              className="scroll-image"
              onClick={() => handleImageClick(index)}
            />
            <div>
              {getStars(unit.experience)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageScrollBox;
