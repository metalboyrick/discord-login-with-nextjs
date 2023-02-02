import{createContext, PropsWithChildren, useContext, useState} from 'react';

import type { UserContextValue } from './types';

const UserContext = createContext<UserContextValue | undefined>(undefined);

const UserProvider = ({children} : PropsWithChildren<unknown>) => {

  const [ username, setUsername ] = useState('')
  const [ guilds, setGuilds] = useState<string[]>([])

	// do the fun stuff	
    return (
        <UserContext.Provider value={{username, guilds, setUsername, setGuilds}}>
            {children}
        </UserContext.Provider>
    );
}

const useUserContext = () => {
    const context = useContext(UserContext);
    if(!context) throw new Error(`"useUserContext" must be used with "UserProvider"`);

    return context;
};

export { UserProvider, useUserContext };