import { DISCORD_ENDPOINT } from "@/constants/discordAPI";
import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import  {useRouter}  from "next/router";
import { useEffect } from "react";

export default function AuthRedirect ({ username, guilds } : { username: string, guilds: string[] }) {

  const router = useRouter();
  const { setUsername, setGuilds } = useUserContext();

  useEffect(() => {
    setUsername(username)
    setGuilds(guilds)
    router.push("/")
  }, [username, guilds])

  return (<>Redirecting...</>)

}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const code = context.query?.code

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

    const guildRes = await axios.get(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    return { props: {
      username: userRes.data.user.username,
      guilds: guildRes.data.map((item: typeof guildRes.data[0]) => item.name)
    } }
  } catch (e) {
    console.error(e);
    return { props: {
      username: 'NOT FOUND!',
      guilds: []
    } }
  }


}