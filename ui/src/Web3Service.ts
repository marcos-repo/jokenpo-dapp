import Web3 from "web3";
import JoKenPoABI from '../src/contracts/abi/JoKenPo.abi.json'

export type LoginResult = {
    account: string;
    isAdmin: boolean;
};

const CONTRACT_ADDRESS =  import.meta.env.VITE_CONTRACT_ADDRESS;

function getWeb3() : Web3 {
    if(!window.ethereum) 
        throw new Error('Metamask não encontrada.');

    return new Web3(window.ethereum);
}

function getContract(web3? : Web3) {
    if(!web3)
        web3 = getWeb3();

    const loginData = getLoginData();

    return new web3.eth.Contract(
      JoKenPoABI,
      CONTRACT_ADDRESS, { 
        from: loginData?.account
      }  
    );
}

export async function doLogin() : Promise<LoginResult> {
    if(!window.ethereum) 
        throw new Error('Metamask não encontrada.');

    const web3 = getWeb3();
    const accounts = await web3.eth.requestAccounts();


    if(!accounts || !accounts.length)
        throw new Error('Metamask não encontrada ou não autorizada.');

    const contract = getContract(web3);
    
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

export function getLoginData() : LoginResult | undefined {
    const loginDataStorage = localStorage.getItem("loginData");
    return loginDataStorage ? 
                    JSON.parse(loginDataStorage) as LoginResult : 
                    undefined;
}

export function doLogout(){
    localStorage.removeItem("loginData");
}

export type Dashboard = {
    bid?: string;
    comission?: number;
    address?: string;
}