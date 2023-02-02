// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = {
  auth_link?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // inject authorization

  res.status(200).json({auth_link: process.env.DISCORD_CLIENT_URL_DEV || ''})
}
