// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Base64 } from "js-base64";
import request from "request-promise";
import * as web3 from "@solana/web3.js";
import { connect } from "http2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const tokenResponse = await request({
      uri: `${process.env.ISSUER}/userinfo`,
      json: true,
      method: "POST",
      headers: {
        authorization: `Bearer ${req.cookies.gengo_auth}`,
      },
    });
    res.status(200).json({ tokenResponse });
  } catch (e) {
    res.status(401).json(e);
  }
}
