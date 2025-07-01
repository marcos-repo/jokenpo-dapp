import Web3 from "web3";
import JoKenPoABI from '../src/contracts/abi/JoKenPo.abi.json'

type LoginResult = {
    account: string;
    isAdmin: boolean;
};

export async function doLogin() : Promise<LoginResult> {
    if(!window.ethereum) 
        throw new Error('Metamask não encontrada.');

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();


    if(!accounts || !accounts.length)
        throw new Error('Metamask não encontrada ou não autorizada.');

    const contract = new web3.eth.Contract(
      JoKenPoABI,
      import.meta.env.VITE_CONTRACT_ADDRESS, { 
        from: accounts[0] 
      }  
    );
    
    const ownerAddress : string  = 
                await contract.methods.owner().call();

    const localAccount : string = await web3.utils.toChecksumAddress(accounts[0]);
    
    const result =  {
        account: localAccount,
        isAdmin: localAccount === ownerAddress
    } as LoginResult;

    localStorage.setItem("loginData", JSON.stringify(result) );

    return result;
}