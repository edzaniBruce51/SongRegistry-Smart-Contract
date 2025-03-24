const SongRegistry = artifacts.require("SongRegistry");

contract("SongRegistry", (accounts) => {
    let songRegistry;
    const owner = accounts[0];
    const buyer = accounts[1];

    beforeEach(async () => {
        songRegistry = await SongRegistry.new();
    });

    // Test 1: Checking that a song can be registered
    it("should correctly add a song to the registry", async () => {
        // Register a new song
        await songRegistry.registerSong(    
            "Test Song",
            "http://test.com",
            web3.utils.toWei("1", "ether"),
            { from: owner }
        );

        // Get the registered song
        const song = await songRegistry.songs(0);

        // Verify all song properties
        assert.equal(song.title, "Test Song", "Title should match");
        assert.equal(song.owner, owner, "Owner should match");
        assert.equal(song.url, "http://test.com", "URL should match");
        assert.equal(song.price, web3.utils.toWei("1", "ether"), "Price should match");
    });

    // Test 2: Checking that a song can be bought
    it("should allow buying a song", async () => {
        // First register a song
        await songRegistry.registerSong(
            "Test Song",
            "http://test.com",
            web3.utils.toWei("1", "ether"),
            { from: owner }
        );

        // Buy the song 
        const isBuyer = await songRegistry.isBuyer(0, { from: owner });
        assert.equal(isBuyer, true, "Buyer should be registered after purchase");
    });

    // Test 3: Checking that the number of songs increases
    it("should increase number of songs after registration", async () => {
        // Get initial count 
        const initialCount = await songRegistry.getNumberOfSongs();
        
        // Register a song
        await songRegistry.registerSong(
            "Test Song",
            "http://test.com",
            web3.utils.toWei("1", "ether"),
            { from: owner }
        );

        // get new count
        const newCount = await songRegistry.getNumberOfSongs();
        assert.equal(
            newCount.toNumber(),
            initialCount.toNumber() + 1,
            "Song count should increase by 1"
        );
    });

    // Test 4: Making sure only true buyers are identified
    it("should correctly identify buyers and non-buyers", async () => {
        // Register a song
        await songRegistry.registerSong(
            "Test Song",
            "http://test.com",
            web3.utils.toWei("1", "ether"),
            { from: owner }
        );
        
        // Check that buyer is not registered yet
        let isBuyer = await songRegistry.isBuyer(0, { from: buyer });
        assert.equal(isBuyer, false, "Should not be identified as buyer before purchase");

        // Buy the song 
        await songRegistry.buySong(0, { from: buyer, value: web3.utils.toWei("1", "ether") });

        // verify buyer is now registered
        isBuyer = await songRegistry.isBuyer(0, { from: buyer });
        assert.equal(isBuyer, true, "Buyer should be registered after purchase");

        // verify non-buyer is not registered
        const nonBuyer = accounts[2];
        const isNonBuyer = await songRegistry.isBuyer(0, { from: nonBuyer });
        assert.equal(isNonBuyer, false, "Non-buyer should not be registered");

    });
});