const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Squirtle", "Charmander", "Pikachu"],
    ["https://i.ibb.co/3v7C83J/dcdd7ab57df30ecb.jpg",
    "https://i.ibb.co/RScD0yd/pokemon-charmander-change-1400x700.jpg", 
    "https://i.imgur.com/WMB6g9u.png"],
    [100, 200, 300],
    [100, 50, 25],
    "Mewtwo",
    "https://i.ibb.co/LvnZfDD/Mewtwo-Journeys.png",
    10000,
    50
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  const txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
