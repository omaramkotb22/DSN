const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Friendship", function () {
  let Friendship;
  let friendship;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    Friendship = await ethers.getContractFactory("FriendRequestContract");
    [owner, user1, user2] = await ethers.getSigners();
    friendship = await Friendship.deploy();
  });


  describe("sendFriendRequest", function () {
    it("Should send a friend request and emit an event including proof", async function () {
        const tx = await friendship.connect(user1).sendFriendRequest(user2.address);
        const receipt = await tx.wait(); // Wait for the transaction receipt
      
        // Check if the events array is defined and has at least one event
        expect(receipt.events).to.exist;
        expect(receipt.events.length).to.be.greaterThan(0);
      
        const event = receipt.events.find(e => e.event === "FriendRequestSent");
        expect(event).to.exist;
      
        // Validate event arguments
        expect(event.args.requestId).to.equal(1);
        expect(event.args.requester).to.equal(user1.address);
        expect(event.args.requestee).to.equal(user2.address);
        expect(event.args.proof).to.be.a('string'); // Just check if it's a string (simple validation)
      });
      it("Should increment requestIdCounter after a friend request is sent", async function () {
        await friendship.connect(user1).sendFriendRequest(user2.address);
        expect(await friendship.requestIdCounter()).to.equal(1);
      });
  
      it("Should fail to send a friend request to an invalid address", async function () {
        await expect(friendship.connect(user1).sendFriendRequest(ethers.ZeroAddress))
          .to.be.revertedWith("Invalid address");
      });
  });

  describe("getFriendRequests", function () {
    it("Should return the list of friend requests for a user", async function () {
      await friendship.connect(user1).sendFriendRequest(user2.address);
      const requests = await friendship.getFriendRequests(user2.address);
      expect(requests).to.include(user1.address);
    });

    it("Should return an empty list if no friend requests are present", async function () {
      const requests = await friendship.getFriendRequests(user1.address);
      expect(requests).to.deep.equal([]);
    });
  });

    describe("State changes and mappings", function () {
        it("Should correctly map requests to the requestee", async function () {
        await friendship.connect(user1).sendFriendRequest(user2.address);
        const requests = await friendship.getFriendRequests(user2.address);
        expect(requests).to.include(user1.address);
        });

    
        it("Should correctly store proofs of friend requests", async function () {
            await friendship.connect(user1).sendFriendRequest(user2.address);
            const requestIdCounter = await friendship.requestIdCounter();
            const proof = await friendship.proofs(requestIdCounter);
            expect(proof).to.not.be.undefined;
    });
  });
});
