//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract Lottery {

    address public manager;
    address[] public players;
    uint public lotteryId;
    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    uint public entryFee;
    LOTTERY_STATE public lotteryState;

    event WinnerPicked(address indexed winner, uint indexed lotteryId);
    event PlayerEntered(address indexed player);


    constructor() {
        manager = msg.sender;
        entryFee = 0.01 ether;
    }

    function enterLottery() public payable {

        require(lotteryState == LOTTERY_STATE.OPEN, "Lottery is not open");
        require(msg.value >= entryFee, "Not enough ETH to enter lottery");  
        players.push(msg.sender);
        emit PlayerEntered(msg.sender);
        
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function pickWinner() public onlyManager{
        uint random = uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
        uint index = random % players.length;
        address winner = players[index];
        //transfer the balance to the winner
        payable(winner).transfer(address(this).balance);
        emit WinnerPicked(winner,lotteryId);
        //reset player array
        players = new address[](0);
        lotteryId++;
        lotteryState = LOTTERY_STATE.CLOSED;
    }

    function resetLottery() public onlyManager {
        require(lotteryState == LOTTERY_STATE.CLOSED, "Can't reset lottery yet");
        lotteryState = LOTTERY_STATE.OPEN;
    }

    modifier onlyManager {
        require(msg.sender == manager, "Not authorized");
        _;
    }


}