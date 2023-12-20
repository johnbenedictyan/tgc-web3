const lotteryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "winner",
            "type": "address"
        }],
        "name": "WinnerSelected",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "enter",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getParticipants",
        "outputs": [{
            "internalType": "address payable[]",
            "name": "",
            "type": "address[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manager",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "participants",
        "outputs": [{
            "internalType": "address payable",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pickWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const provider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545'
);

const signer = provider.getSigner();
const lotteryContract = new ethers.Contract(lotteryAddress, abi, signer);


async function refreshParticipants() {
    const participantsElement = document.getElementById('participants');
    const participants = await lotteryContract.getParticipants();
    participantsElement.innerHTML = participants.map(p => `<li>${p}</li>`).join('');
}

async function refreshAccounts() {
    const accountsElement = document.getElementById('accounts');
    let accounts = await provider.listAccounts();
    accounts = accounts.slice(0,8);
    accounts = accounts.map(x => [x, 0]);
    for (let idx = 0; idx < accounts.length; idx++) {
        const element = accounts[idx];
        accounts[idx][1] = ethers.utils.formatEther(
            await provider.getBalance(element[0])
        )
    }
    accountsElement.innerHTML = accounts.map((obj,idx) => `<tr><td>Number ${idx+1}</td><td>${obj[0]}</td><td>${obj[1]} ETH</td></tr>`).join('');
}

async function enterLottery() {
    const addressInput = document.getElementById('address');
    const userAddress = addressInput.value;

    try {
        const userSigner = provider.getSigner(userAddress);
        const userLotteryContract = new ethers.Contract(lotteryAddress, abi, userSigner);

        const tx = await userLotteryContract.enter({
            value: ethers.utils.parseEther('1')
        });
        await tx.wait();

        alert(`Entered the lottery from address ${userAddress}`);
        addressInput.value = '';
        refreshParticipants();
    } catch (error) {
        alert('Error entering lottery:', error.message);
    }
}

async function pickWinner() {
    try {
        const tx = await lotteryContract.pickWinner();
        const receipt = await tx.wait();

        const winnerEvent = lotteryContract.interface.parseLog(receipt.logs[0]);
        const winnerAddress = winnerEvent.args[0];

        alert(`Picked the winner: ${winnerAddress}`);
        refreshParticipants();
        refreshAccounts();
    } catch (error) {
        console.log(error)
        alert('Error picking winner:', error);
    }
}

refreshParticipants();
refreshAccounts();