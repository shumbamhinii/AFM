const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_+5CxxjNFKBMBu4XRyoHMPYdv4yI=", // Public API key from your ImageKit account
  privateKey: "private_yTYL6cjLbhHtvsbBjGdQuU9jc5M=", // Private API key from your ImageKit account
  urlEndpoint: "https://ik.imagekit.io/ivb3vvbsu/", // URL Endpoint, e.g., https://ik.imagekit.io/your_account_id
});

module.exports = imagekit;
