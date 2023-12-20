// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public participants;

    event WinnerSelected(address indexed winner);

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "Minimum 0.01 ETH required to enter");

        participants.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp,
                        participants
                    )
                )
            );
    }

    function pickWinner() public restricted {
        require(msg.sender == manager, "Only the manager can pick a winner");
        require(participants.length > 3, "Not enough participants");

        uint index = random() % participants.length;
        address payable winner = participants[index];
        winner.transfer(address(this).balance);

        // Emit an event with the winner's address
        emit WinnerSelected(winner);

        // Reset the lottery for the next round
        participants = new address payable[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getParticipants() public view returns (address payable[] memory) {
        return participants;
    }
}
