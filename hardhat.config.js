require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: { 
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/qGrUFXZ0Tp2IVHIjTbxfwn8__RgYj3s4`,
      accounts: [`a0c6216f9f3fd7779b8fe61ab86435ac718c9060bf96dd1a055c2ac9ba86d4eb`],
  },
}
};
