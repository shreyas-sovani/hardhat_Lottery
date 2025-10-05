const{buildModule} = require("@nomicfoundation/hardhat-ignition/modules");
const{network} = require("hardhat");

module.exports = buildModule("Lottery", (m)=>{
    let lottery;
    if(network.name === "hardhat" || network.name === "localhost"){
        lottery = m.contract("Lottery");
        return {lottery};
    }
})

 