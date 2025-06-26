import { ethers } from "hardhat";

async function main() {
    const joKenPoContact = await ethers.deployContract("JoKenPo");

    await joKenPoContact.waitForDeployment();
    const address = await joKenPoContact.getAddress();

    console.log(`Contract deployed at ${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});