// src/components/CancerDialog.js
import React from 'react';
import './CancerDialog.css'; // Stylizacja przycisku
import bone from '../../assets/bone.png';
import blood_cells from '../../assets/blood-cells.png';
import human from '../../assets/human.png';
import liver from '../../assets/liver.png';
import lung from '../../assets/lungs.png';
import pancreas from '../../assets/pancreas.png';
import stomach from '../../assets/stomach.png';
import throat from '../../assets/throat.png';
import skin from '../../assets/skin.png';

const CancerDialog = ({ onClick }) => {
  return (
    <div className="cancer-dialog">
      <img src={human} alt="Human" className="background-image" />
      <button className="image-button bone" onClick={() => onClick('bone')}>
        <img src={bone} alt="Bone" />
      </button>
      <button className="image-button blood_cells" onClick={() => onClick('blood_cells')}>
        <img src={blood_cells} alt="Blood Cells" />
      </button>
      <button className="image-button liver" onClick={() => onClick('liver')}>
        <img src={liver} alt="Liver" />
      </button>
      <button className="image-button lung" onClick={() => onClick('lung')}>
        <img src={lung} alt="Lung" />
      </button>
      <button className="image-button pancreas" onClick={() => onClick('pancreas')}>
        <img src={pancreas} alt="Pancreas" />
      </button>
      <button className="image-button stomach" onClick={() => onClick('stomach')}>
        <img src={stomach} alt="Stomach" />
      </button>
      <button className="image-button throat" onClick={() => onClick('throat')}>
        <img src={throat} alt="Throat" />
      </button>
      <button className="image-button skin" onClick={() => onClick('skin')}>
        <img src={skin} alt="Skin" />
      </button>
    </div>
  );
};

export default CancerDialog;
