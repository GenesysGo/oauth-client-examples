require("dotenv").config();
const web3 = require("@solana/web3.js");
const web3TokenAuth = require("@strata-foundation/web3-token-auth");
const request = require("request-promise");
const b64 = require("js-base64");

const Connection = web3.Connection;
const tokenAuthFetchMiddleware = web3TokenAuth.tokenAuthFetchMiddleware;

const Base64 = b64.Base64;

async function getToken() {
  const token = Base64.encode(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  );
  const { access_token } = await request({
    uri: `${process.env.ISSUER}/token`,
    json: true,
    method: "POST",
    headers: {
      authorization: `Basic ${token}`,
    },
    form: {
      grant_type: "client_credentials",
    },
  });

  return access_token;
}

(async () => {
  // Create ConnectionConfig Object to be passed into Solana Web3.js Connection constructor
  const connectionConfig = {
    commitment: "confirmed",
    fetchMiddleware: tokenAuthFetchMiddleware({
      tokenExpiry: 180000,
      getToken,
    }),
  };
  // Connect to cluster
  const connection = new Connection(process.env.RPC_URL, connectionConfig);
  let latestHash;
  try {
    latestHash = await connection.getLatestBlockhash("confirmed");
    console.log(
      `Lastest hash retrieved using GenesysGo authentication ${latestHash.blockhash}`
    );
  } catch (e) {
    console.log(e);
  }
})();
