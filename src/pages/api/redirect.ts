// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { DISCORD_ENDPOINT } from "@/constants/discordAPI";

type Data = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // get the code from the querystring
  const { code } = req.query;

  try {
    // exchange with the tokens
    const getTokenBody = {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URL,
    };

    const tokenRes = await axios.post(
      `${DISCORD_ENDPOINT}/oauth2/token`,
      getTokenBody,
      { headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      } }
    );

    const { access_token, token_type, expires_in, refresh_token, scope } =
      tokenRes.data;

    // use tokens to get user data
    const userRes = await axios.get(`${DISCORD_ENDPOINT}/oauth2/@me`, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // post out the data
    res.status(200).json({msg: "success"});
  } catch (e) {
    console.error(e);
    res.status(500);
  }
}
