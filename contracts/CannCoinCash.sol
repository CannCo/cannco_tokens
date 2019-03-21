pragma solidity ^0.5.0;

contract CannCoinCash {
  
  uint256 public totalSupply;
  
  string public name;
  string public symbol;
  string public version;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;

  constructor (uint256 _initialSupply, string memory _name, string memory _symbol, string memory _version) public {
    name = _name;
    symbol = _symbol;
    version = _version;
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns(bool success) {
    require(balanceOf[msg.sender] >= _value);

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }

}