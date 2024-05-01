const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PostContract", function () {
  let PostContract;
  let postContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    PostContract = await ethers.getContractFactory("PostContract");
    [owner, user1, user2] = await ethers.getSigners();
    postContract = await PostContract.deploy();
  });

  it("Should allow a user to write a post", async function () {
    const title = "First Post";
    const content = "This is the content of the first post";
    
    await expect(postContract.connect(user1).writePost(title, content))
      .to.emit(postContract, "PostWritten")
      .withArgs(1, user1.address);
    
    const post = await postContract.posts(0);
    expect(post.id).to.equal(1);
    expect(post.author).to.equal(user1.address);
    expect(post.title).to.equal(title);
    expect(post.content).to.equal(content);
  });

  it("Should allow a user to like a post", async function () {
    const title = "Second Post";
    const content = "This is the content of the second post";
    await postContract.connect(user1).writePost(title, content);

    const postId = await postContract.getLastPostId();
    const like = true;
    const message = ethers.solidityPackedKeccak256(['uint256', 'address', 'bool'], [postId, user2.address, like]);
    const signature = await user2.signMessage(ethers.getBytes(message));

    await expect(postContract.connect(user2).likePost(postId, like, signature))
      .to.emit(postContract, "LikeAction")
      .withArgs(postId, user2.address, like);
    
    expect(await postContract.likes(postId, user2.address)).to.equal(like);
  });

  it("Should not allow a user to like a post with an invalid signature", async function () {
    const title = "Third Post";
    const content = "This is the content of the third post";
    await postContract.connect(user1).writePost(title, content);

    const postId = await postContract.getLastPostId();
    const like = true;
    const message = ethers.solidityPackedKeccak256(['uint256', 'address', 'bool'], [postId, user2.address, like]);
    const signature = await owner.signMessage(ethers.getBytes(message));

    await expect(postContract.connect(user2).likePost(postId, like, signature))
      .to.be.revertedWith("Invalid signature");
  });

  it("Should increment the lastPostId on post creation", async function () {
    const initialLastPostId = await postContract.getLastPostId();
    expect(initialLastPostId).to.equal(0);
    await postContract.connect(user1).writePost("New Post", "New Content");
    const updatedLastPostId = await postContract.getLastPostId();
    let one = 1n;
    expect(updatedLastPostId).to.equal(initialLastPostId + one);
  });
});
