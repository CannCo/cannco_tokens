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

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

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

  function approve(address _spender, uint256 _value) public returns (bool success) {
    
    allowance[msg.sender][_spender] = _value; 
    
    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

    require(allowance[msg.sender][_from] > 0);

    // return true;
  }

}