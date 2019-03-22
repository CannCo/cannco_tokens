var CannCoinCash = artifacts.require("CannCoinCash");
const initialSupply = 1000000;
const transferAmount = 10;

contract('CannCoinCash', function (accounts) {

      it('set the token metadata', function () {
        return CannCoinCash.deployed().then(function (instance) {
          tokenInstance = instance;
          return tokenInstance.name();
        }).then(function (tokenName) {
          assert.equal(tokenName, 'CannCoinCash', 'has the correct name');
          return tokenInstance.symbol();
        }).then(function (tokenSymbol) {
          assert.equal(tokenSymbol, 'CCC', 'has the correct symbol')
          return tokenInstance.version();
        }).then(function (version) {
          assert.equal(version, 'CannCoinCash 0.1', 'has the correct version')
        });
      });

      it('sets the total supply upon deployment', function () {
        return CannCoinCash.deployed().then(function (instance) {
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
        return CannCoinCash.deployed().then(function (instance) {
          tokenInstance = instance;
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function (adminBalance) {
          assert.equal(adminBalance.toNumber(), initialSupply, 'it allocations the initial supply to the admin acccount');
        });
      });

      it('transfers token ownership', function () {
        return CannCoinCash.deployed().then(function (instance) {
          tokenInstance = instance;
          // stops transfer if sender does not have enough tokens
          return tokenInstance.transfer.call(accounts[1], 999999999999);
        }).then(assert.fail).catch(function (error) {
          assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
          return tokenInstance.transfer.call(accounts[1], transferAmount, {
            from: accounts[0]
          });
        }).then(function (success) {
          assert.equal(success, true, 'it returns true upon successful transfer')
          return tokenInstance.transfer(accounts[1], transferAmount, {
            from: accounts[0]
          });
        }).then(function (receipt) {
          assert.equal(receipt.logs.length, 1, 'emits one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'is the Transfer event');
          assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
          return tokenInstance.balanceOf(accounts[1])
        }).then(function (balance) {
          assert.equal(balance.toNumber(), transferAmount, 'adds amount to receiving account');
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function (balance) {
          assert.equal(balance.toNumber(), (initialSupply - transferAmount), 'subtracts amount from sending account');
        });
      });

      it('approves tokens for delegated transfer', function () {
        return CannCoinCash.deployed().then(function (instance) {
          tokenInstance = instance;
          return tokenInstance.approve.call(accounts[1], transferAmount);
        }).then(function (success) {
          assert.equal(success, true, 'it returns true upon successful transfer');
          return tokenInstance.approve(accounts[1], transferAmount, {
            from: accounts[0]
          });
        }).then(function (receipt) {
          assert.equal(receipt.logs.length, 1, 'emits one event');
          assert.equal(receipt.logs[0].event, 'Approval', 'is the Transfer event');
          assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account owner delegating approval');
          assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account that has delegated approval');
          assert.equal(receipt.logs[0].args._value, 10, 'logs the approval transfer amount');
          return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function (allowance) {
          assert.equal(allowance, transferAmount, 'stores the allowance for a delegated transfer');
        });
      });

      it('transfers from a delegated account', function () {
        return CannCoinCash.deployed().then(function (instance) {
          tokenInstance = instance;
          fromAccount = accounts[2];
          toAccount = accounts[3];
          spendingAccount = accounts[4];
          tokenInstance.transfer(fromAccount, toAccount, );

        });


        // stops transfer if sender has not been given delegated authority
        // return tokenInstance.transferFrom.call(accounts[1], accounts[2], transferAmount, { from: accounts[0] });
        //}).then(assert.fail).catch(function(error) {
        // assert(error.message.indexOf('revert') >= 0, 'it throws and error if delagated authority has not been granted');

      })