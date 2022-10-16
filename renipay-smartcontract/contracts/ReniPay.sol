// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IUniswapV2Router02.sol";
import "./IERC20.sol";
import "./TransferHelper.sol";

contract ReniPay is Ownable { 

    uint256 public slippage;
    address public swapRouter = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506;
    address public stableCoin = 0xA5E9Bad00A0b8291b02DEC6286f1db1C35a9903a;

    event paymentSuccessful(uint256 amount, address payer, string merchant, string transactionId);
    event routerUpdated(address proviousRouter, address newRouter);
    event stableCoinUpdated(address proviousStableCoin, address newStableCoin);
    event slippageUpdated(uint256 previousSlippage, uint256 newSlippage);

    function makePayment(address _token, uint256 _amountInUSD, string memory _transactionId, string memory _merchant) public payable {

        address[] memory _path;
        _path = new address[](2);
        _path[0] = _token;
        _path[1] = stableCoin;
        uint256 _tokenAmount;

        if (_token != stableCoin && _token != address(0)) {
            // Get the amount of token to swap
            _tokenAmount = requiredTokenAmount(_amountInUSD, _token);

            TransferHelper.safeTransferFrom(_token, msg.sender, address(this), _tokenAmount);

            // Swap to stableCoin
            _swap(_tokenAmount, _amountInUSD, _path);

        } else if (_token == stableCoin) {
            TransferHelper.safeTransferFrom(_token, msg.sender, address(this), _amountInUSD);
        } else {
            _tokenAmount = requiredTokenAmount(_amountInUSD, IUniswapV2Router02(swapRouter).WETH());
            require(msg.value >= _tokenAmount, 'Insufficient amount!');
            IUniswapV2Router02(swapRouter).swapETHForExactTokens{ value: _tokenAmount }(_amountInUSD, _path, address(this), block.timestamp);
        }
        emit paymentSuccessful(_amountInUSD, msg.sender, _merchant, _transactionId);
    }

    function updateRouter(address _router) external onlyOwner {
        address _previousRouter = swapRouter;
        swapRouter = _router;
        emit routerUpdated(_previousRouter, _router);
    }

    function updateStableCoin(address _stableCoin) external onlyOwner {
        address _previousStableCoin = stableCoin;
        stableCoin = _stableCoin;
        emit stableCoinUpdated(_previousStableCoin, _stableCoin);
    }

    function updateSlippage(uint256 _slippage) external onlyOwner {
        uint256 _previousSlippage = slippage;
        slippage = _slippage;
        emit slippageUpdated(_previousSlippage, _slippage);
    }

    // Get the require amount of token for a swap
    function requiredTokenAmount(uint256 _amountInUSD, address _token) public view returns (uint256 _tokenAmount) {
        address[] memory _path;
        _path = new address[](2);
        _path[0] = _token;
        _path[1] = stableCoin;
        uint256[] memory _tokenAmounts = IUniswapV2Router02(swapRouter).getAmountsIn(_amountInUSD, _path);
        _tokenAmount = _tokenAmounts[0] + (_tokenAmounts[0] * slippage / 100);
    }


    // Swap from tokens to a stablecoin
    function _swap(uint256 _tokenAmount, uint256 _amountInUSD, address[] memory _path) internal returns (uint256[] memory _amountOut) {
        // Approve the router to swap token.
        TransferHelper.safeApprove(_path[0], swapRouter, _tokenAmount);
        _amountOut = IUniswapV2Router02(swapRouter).swapTokensForExactTokens(_amountInUSD, _tokenAmount, _path, owner(), block.timestamp);
    }
}
