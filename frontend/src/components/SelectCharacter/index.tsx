import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../../constants';
import transformCharacterData from  '../../utils/transformCharacterData';
import myEpicGame from '../../utils/MyEpicGame.json';
import './SelectCharacter.css';

const SelectCharacter = ({ setCharacterNFT }: {setCharacterNFT: any}) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState<any>(null);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        const characters = charactersTxn.map((characterData: any) =>
          transformCharacterData(characterData)
        );
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    const onCharacterMint = async (sender: string, tokenId: any, characterIndex: any) => {
      if (gameContract) {
        console.log(
          `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameContract]);

  const mintCharacterNFTAction = (characterId: number) => async () => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };

  const renderCharacters = () =>
    characters.map((character: any, index) => (
        <div className="character-item" key={character.name}>
        <div className="name-container">
            <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
            type="button"
            className="character-mint-button"
            onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
        </div>
    ));

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  )
}

export default SelectCharacter;