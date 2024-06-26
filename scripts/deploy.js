// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );

  const postContract = await hre.ethers.getContractFactory("PostContract");
  const post = await postContract.deploy();
  await post.waitForDeployment();
  console.log("PostContract deployed to:", post.target);
  const friendshipContract = await hre.ethers.getContractFactory("FriendRequestContract");
  const friendShip = await friendshipContract.deploy();
  const friendshipDeployment = await friendShip.waitForDeployment();
  console.log("Friendship deployed to:", friendshipDeployment.target);
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
