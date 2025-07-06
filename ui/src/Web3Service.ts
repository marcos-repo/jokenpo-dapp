import Web3, { Contract } from "web3";
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

export async function getDashboard() : Promise<Dashboard> {
    
    const contract = getContract();
    const address : string = await contract.methods.getImplementationAddress().call();

    if(/^(0x0+)$/.test(address))
        return { 
            bid: Web3.utils.toWei('0.01', 'wei'),
            comission: 10,
            address: address 
        } as Dashboard;

    
    return { 
        bid: await contract.methods.getBid().call(),
        comission: await contract.methods.getComission().call(),
        address: address 
    } as Dashboard;
}

export async function upgradeContract(newContract: string) : Promise<string> {
    const contract = getContract();
    const tx = await contract.methods.init(newContract).send();

    return tx.transactionHash;
}

export async function setBid(newBid: string) : Promise<string> {
    const contract = getContract();
    
    
    
    const tx = await contract.methods.setBid(newBid).send();

    console.log('chegou #2');

    return tx.transactionHash;
}

export async function setComission(newComission: number) : Promise<string> {
    const contract = getContract();
    const tx = await contract.methods.setComission(newComission).send();

    return tx.transactionHash;
}

export type Players = {
    wallet: string;
    wins: number;
}

export type Leaderboard = {
    players?: Players[];
    status?: string;
}

export enum Options { 
    NONE = 0,
    ROCK = 1, 
    PAPER = 2, 
    SCISSORS = 3
}

export async function play(option: Options): Promise<string> {
    console.log('chegou na play');

    const contract = getContract();
    const bid : string = await contract.methods.getBid().call();
    const tx = await contract.methods.play(option).send({value: bid});

    return tx.transactionHash;
}

export async function getStatus(): Promise<string> {
    console.log('chegou na getStaus');

    const contract = getContract();

    return await contract.methods.getResult().call();
}

export async function getLeaderboard(): Promise<Leaderboard> {
    const contract = getContract();

    const players = await contract.methods.getLeaderboard().call();
    const status = await contract.methods.getResult().call();

    return {
        players,
        status
    } as Leaderboard;
}

export async function getBestPlayers(): Promise<Players[]> {
    const contract = getContract();

    return await contract.methods.getLeaderboard().call();
}

export function listenEvent(callback: Function) {
    
    const web3 = new Web3(`${import.meta.env.VITE_WEBSOCKET_SERVER}`);
    const contract = getContract(web3);
    contract.events.Played({
        fromBlock: "latest"
    })
    .on(
        "data", 
        (event: any) => {
            console.log(event);
            callback(event.returnValues.result);
        }
    )
}