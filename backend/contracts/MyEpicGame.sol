// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';
import './libraries/Base64.sol';

contract MyEpicGame is ERC721 {
  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultCharacters;

  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  mapping(address => uint256) public nftHolders;

  struct BigBoss {
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}

BigBoss public bigBoss;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDmg,
    string memory bossName,
    string memory bossImageURI,
    uint bossHp,
    uint bossAttackDamage
  )
    ERC721('Pokemons', 'PKM')
  {
    bigBoss = BigBoss({
      name: bossName,
      imageURI: bossImageURI,
      hp: bossHp,
      maxHp: bossHp,
      attackDamage: bossAttackDamage
    });

    console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

    for (uint256 i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(
        CharacterAttributes({
          characterIndex: i,
          name: characterNames[i],
          imageURI: characterImageURIs[i],
          hp: characterHp[i],
          maxHp: characterHp[i],
          attackDamage: characterAttackDmg[i]
        })
      );

      CharacterAttributes memory c = defaultCharacters[i];
      console.log('Done initializing %s w/ HP %s, img %s', c.name, c.hp, c.imageURI);
    }

    // Increment tokenIds so that the first NFT has an ID of 1.
    _tokenIds.increment();
  }

  function mintCharacterNFT(uint256 _characterIndex) external {
    uint256 newItemId = _tokenIds.current();

    _safeMint(msg.sender, newItemId);

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].hp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log('Minted NFT w/ tokenId %s and characterIndex %s', newItemId, _characterIndex);

    nftHolders[msg.sender] = newItemId;

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "This is an NFT that lets people play in the game Metaverse Pokemon!", "image": "',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',
            strHp,
            ', "max_value":',
            strMaxHp,
            '}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,
            '} ]}'
          )
        )
      )
    );
    string memory output = string(abi.encodePacked('data:application/json;base64,', json));
    return output;
  }
}
