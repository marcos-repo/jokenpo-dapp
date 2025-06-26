// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

library JoKenPoLibrary {
    enum Options { 
        NONE,
        ROCK, 
        PAPER, 
        SCISSORS 
    }

    struct Player {
        address wallet;
        uint32 wins;
    }
}