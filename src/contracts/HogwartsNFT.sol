// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.8.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC721/ERC721.sol";

contract HogwartsNFT is ERC721URIStorage, Ownable 
{
    mapping(uint256 => address) public s_requestIdToSender;
    mapping(address => uint256) public s_addressToHouse;
    mapping(address => bool) public hasMinted;
    mapping(address => string) public s_addressToName;

    uint256 private s_tokenCounter;

    string[] internal houseTokenURIs = 
    [
        "https://bronze-implicit-jellyfish-397.mypinata.cloud/ipfs/bafkreigsgls4v63azaqnc6u5bdbu6nmkgdd6mulhhslip2gzjebcor3ecm",    // Gryffindor.json
        "https://bronze-implicit-jellyfish-397.mypinata.cloud/ipfs/bafkreidxd3hry27eab2ye2viyufd5pdndxs436kv34wgw7wzf7yl2efjja",   //  Hufflepuff.json
        "https://bronze-implicit-jellyfish-397.mypinata.cloud/ipfs/bafkreicforscvnzvi5ptisvtjkkttf63svwultolhgea6h6evvk2end4jq",  //   Ravenclaw.json
        "https://bronze-implicit-jellyfish-397.mypinata.cloud/ipfs/bafkreiejzzco7wzehtkc6c5gvg3qxyfjhxwpbqwuon6hwfyaiaygbz3psq"  //    Slytherin.json
    ];

    event NftMinted(uint256 house, address minter, string name);

    constructor() ERC721("Hogwarts NFT", "HP") {
        s_tokenCounter = 0;
    }

    // Read-only function to check whether a user has minted an NFT
    function hasMintedNFT(address _user) public view returns (bool) {
        return hasMinted[_user];
    }

    // Read-only function to get the house index mapped to the user
    function getHouseIndex(address _user) public view returns (uint256) {
        return s_addressToHouse[_user];
    }

    //Function to mint NFT according to the house index
    function mintNFT(address recipient, uint256 house, string memory name) external onlyOwner {
        require(!hasMinted[recipient], "You have already minted your house NFT");

        uint256 tokenId = s_tokenCounter;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, houseTokenURIs[house]);

        s_addressToHouse[recipient] = house;
        s_addressToName[recipient] = name;

        s_tokenCounter += 1;
        hasMinted[recipient] = true;

        emit NftMinted(house, recipient, name);
    }


    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        require(from == address(0) || to == address(0), "Err! This is not allowed in Hogwarts");
    }

}
