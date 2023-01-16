// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.1/token/ERC20/ERC20.sol";

/** approve function : amount of money approved to be transferred
    * Requirements for transferFrom:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     increaseAllowance : alternative to approve that can be used to curb the amount that is transacting
     * Requirements for decreaseAllowance:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     * all inputs is in string form
     */
contract PANDA is ERC20 {
    constructor() ERC20("PANDA", "PAN") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}
