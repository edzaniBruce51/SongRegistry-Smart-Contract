// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SongRegistry {
    struct Song {
        string title;
        address owner;
        string url;
        uint256 price;
    }

    Song[] public songs;
    mapping(uint256 => address[]) public songBuyers;
 
    function registerSong(string memory _title, string memory _url, uint256 _price) public {
        songs.push(Song(_title, msg.sender, _url, _price));
        uint256 songId = songs.length - 1;
        songBuyers[songId].push(msg.sender);
    }

    function getNumberOfSongs() public view returns (uint256) {
        return songs.length;
    }

    function isBuyer(uint256 _songId) public view returns (bool) {
        address[] memory buyers = songBuyers[_songId];
        for (uint i = 0; i < buyers.length;i++)
        {
            if (buyers[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function buySong(uint256 _songId) public payable {       // marked as payable to allow receiving Ether with the transaction
        require(_songId < songs.length, "Song does not exist");
        Song memory song = songs[_songId];
        require(msg.value == song.price, "Incorrect payment amount");
        require(msg.sender != song.owner, "Owner cannot buy their own song");
        
        songBuyers[_songId].push(msg.sender);

        payable(song.owner).transfer(msg.value);    // where msg.value equals song price
    }
}