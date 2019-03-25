var CanncoinCash = artifacts.require("CanncoinCash");

const initialSupply = 1000000;

contract('CannCoin Cash', function (accounts) {

  it('set the token metadata', function () {
    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function (tokenName) {
      assert.equal(tokenName, 'Canncoin Cash', 'has the correct name');
      return tokenInstance.symbol();
    }).then(function (tokenSymbol) {
      assert.equal(tokenSymbol, 'CASH', 'has the correct symbol')
      return tokenInstance.version();
    }).then(function (version) {
      assert.equal(version, 'Canncoin Cash 1.0', 'has the correct version')
    });
  });

  it('sets the total supply upon deployment', function () {
    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function (totalSupply) {
      assert.equal(totalSupply.toNumber(), initialSupply, 'sets the total supply to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function (adminBalance) {
      assert.equal(adminBalance.toNumber(), initialSupply, 'it allocations the initial supply to the admin acccount');
    });
  });

  it('allocates initial supply to the admin acccount', function () {
    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function (adminBalance) {
      assert.equal(adminBalance.toNumber(), initialSupply, 'it allocations the initial supply to the admin acccount');
    });
  });

  it('renames the token', function () {
    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.changeName("New Name");
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'emits one event');
      assert.equal(receipt.logs[0].event, 'NameChange', 'is the NameCHange event');
      assert.equal(receipt.logs[0].args._oldName, "Canncoin Cash", 'logs the original name of the token');
      assert.equal(receipt.logs[0].args._newName, "New Name", 'logs the new name of the token');
      return tokenInstance.name();
    }).then(function (name) {
      assert.equal(name, "New Name", 'it renames the token')
    });
  });

  it('transfers token ownership', function () {
    const transferAmount = 1000;

    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;
      // stops transfer if sender does not have enough tokens
      return tokenInstance.transfer.call(accounts[1], initialSupply + 1);
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
      return tokenInstance.transfer.call(accounts[1], transferAmount, { from: accounts[0] });
    }).then(function (success) {
      assert.equal(success, true, 'it returns true upon successful transfer')
      return tokenInstance.transfer(accounts[1], transferAmount, { from: accounts[0] });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'emits one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'is the Transfer event');
      assert.equal(receipt.logs[0].args.from, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args.to, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args.value, transferAmount, 'logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1])
    }).then(function (balance) {
      assert.equal(balance.toNumber(), transferAmount, 'adds amount to receiving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), (initialSupply - transferAmount), 'subtracts amount from sending account');
    });
  });

  it('approves tokens for delegated transfer', function () {
    const allowanceAmount = 500;

    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.approve.call(accounts[1], allowanceAmount);
    }).then(function (success) {
      assert.equal(success, true, 'it returns true upon successful transfer');
      return tokenInstance.approve(accounts[1], allowanceAmount, { from: accounts[0] });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'emits one event');
      assert.equal(receipt.logs[0].event, 'Approval', 'is the Transfer event');
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account owner delegating approval');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account that has delegated approval');
      assert.equal(receipt.logs[0].args._value, allowanceAmount, 'logs the approval transfer amount');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function (allowance) {
      assert.equal(allowance, allowanceAmount, 'stores the allowance for a delegated transfer');
    });
  });

  it('transfers from a delegated account', function () {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];
    const initialBalance = 1000;
    const allowanceAmount = 800;
    const transferAmount = 500;

    return CanncoinCash.deployed().then(function (instance) {
      tokenInstance = instance;

      // Transfer some tokens to fromAccount
      return tokenInstance.transfer(fromAccount, initialBalance, { from: accounts[0] });
    }).then(function (receipt) {
      // Approve spendingAccount to spend transferAmount tokens
      return tokenInstance.approve(spendingAccount, allowanceAmount, { from: fromAccount });
    }).then(function (receipt) {
      // Test that it rejects transfers larger than fromAccount's balance
      return tokenInstance.transferFrom(fromAccount, toAccount, initialBalance + 1, { from: spendingAccount });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'halts transfers larger than available balance');
      // Test that it rejects transfers larger than approved allowance
      return tokenInstance.transferFrom(fromAccount, toAccount, allowanceAmount + 1, { from: spendingAccount });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'halts transfers larger than approved allowance');
      // Test that it returns success on a valid transfer request
      return tokenInstance.transferFrom.call(fromAccount, toAccount, transferAmount, { from: spendingAccount });
    }).then(function (success) {
      assert.equal(success, true, 'returns success on a valid transfer request');
      return tokenInstance.transferFrom(fromAccount, toAccount, transferAmount, { from: spendingAccount });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'emits one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'is the Transfer event');
      assert.equal(receipt.logs[0].args.from, fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args.to, toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args.value, transferAmount, 'logs the transfer amount');
      return tokenInstance.balanceOf(fromAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), initialBalance - transferAmount, 'decrements the balance of the FROM account');
      return tokenInstance.balanceOf(toAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), transferAmount, 'increments the balance of the TO account');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), allowanceAmount - transferAmount, 'adjusts the allowance');
    });
  });
})