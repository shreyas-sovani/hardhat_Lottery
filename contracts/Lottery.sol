//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract Lottery {

    bool public isOpen;
    address public manager;
    address[] public players;
    uint public entryAmount;
    uint public roundId = 1;
    address public lastWinner;
    uint public randomIndex;


   
    constructor() {
        manager = msg.sender;
        isOpen = true;
        entryAmount = 0.01 ether;
    }

    function openLottery() public onlyManager{ 
        require(!isOpen, "Lottery is already open");
        isOpen = true;
    }

    function enterLottery() public payable{
        require(isOpen, "Lottery is not open");
        require(msg.value == entryAmount,"Incorrect entry amount");
        players.push(msg.sender);
    }

    function closeLottery() public onlyManager{
        require(isOpen, "Lottery is already closed");
        isOpen = false;
    }



    function transferPot() public onlyManager{
        //Pick a random winner 
        //randomness is not secure and must be replaced by VRF for any non-local usage
        require(!isOpen, "Lottery is still open");
        require(players.length > 0, "No players in the lottery");
        randomIndex  =  uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players))) % players.length;

        address winner = players[randomIndex];

        //Transfer the pot to the winner
        (bool success, ) = payable(winner).call{value: address(this).balance}("");
        require(success, "Transfer failed");

        //Reset the lottery for the next round
        lastWinner = winner;
        delete players;
        isOpen = true;
        roundId++;
    }

    function getTotalPlayers() public view returns(uint){
        return players.length;
    }

    function getCurrentRound() public view returns(uint){
        return roundId;
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function getEntryAmount() public view returns(uint){
        return entryAmount;
    }

    function getLotteryStatus() public view returns(bool){
        return isOpen;
    }

    function getManager() public view returns(address){
        return manager;
    }

    function getLastWinner() public view returns(address){
        return lastWinner;
    }

    function getWinnerIndex() public view returns(uint){
        return randomIndex;
    }


    modifier onlyManager(){
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }


}