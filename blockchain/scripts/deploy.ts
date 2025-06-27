import { ethers } from "hardhat";

async function main() {
    const joKenPoImplementationContact = await ethers.deployContract("JoKenPo");

    await joKenPoImplementationContact.waitForDeployment();
    const implementationAddress = await joKenPoImplementationContact.getAddress();
    console.log(`Implementation Contract deployed at ${implementationAddress}`);

    const joKenPoAdapterContact = await ethers.deployContract("JoKenPoAdapter");

    await joKenPoAdapterContact.waitForDeployment();
    const adapterAddress = await joKenPoAdapterContact.getAddress();
    console.log(`Adapter Contract deployed at ${adapterAddress}`);

    //-----------------------------------------------------------------------------------
    
    await joKenPoAdapterContact.init(implementationAddress);
    console.log('Adapter contract is initialized.')
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});