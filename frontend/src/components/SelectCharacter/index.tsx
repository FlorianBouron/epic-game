import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './SelectCharacter.css';

const SelectCharacter = ({ setCharacterNFT }: {setCharacterNFT: Dispatch<SetStateAction<null>>}) => {
    return (
        <div className="select-character-container">
        <h2>Mint Your Hero. Choose wisely.</h2>
      </div>
    )
}

export default SelectCharacter;