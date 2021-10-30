const transformCharacterData = (characterData: {
  name: string;
  imageURI: string;
  hp: any;
  maxHp: any;
  attackDamage: any;
}) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber()
  };
};

export default transformCharacterData;
