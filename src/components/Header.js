import React from 'react';
import styled from 'styled-components';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Avatar } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider, signInWithPopup } from "../firebase";
import { updateUserMongo } from "../features/appSlice";
import { useDispatch } from "react-redux";

export default function Header() {
    console.log("Header comp")

    const dispatch = useDispatch();
    const [user] = useAuthState(auth);
    const signInHandler = (e) => {
        e.preventDefault(); // prevent Refresh
        signInWithPopup(auth, provider).catch((error)=>alert(error.message));
    };

    const signOutHandler = (e) => {
        auth.signOut();
        console.log("signOut: onClick event");
        dispatch(updateUserMongo({
            userMongo: {},
          }))
    };
    return (
        <HeaderContainer>
            {/* Header Left */}
            <HeaderLeft>
                {user?<>
                    <HeaderAvatar 
                    onClick={signOutHandler} 
                    alt={user?.displayName} 
                    src={user?.photoURL} 
                    />                
                </>
                :
                <>
                    <HeaderAvatar 
                    onClick={signInHandler} 
                    alt={user?.displayName} 
                    src={user?.photoURL} 
                    />                
                </>}
                <AccessTimeIcon />
            </HeaderLeft>
            {/* Header Search */}
            <HeaderSearch>
                <SearchIcon />
                <input placeholder="Search.."/>
            </HeaderSearch>
            {/* Header Right */}
            <HeaderRight>
                <HelpOutlineIcon />
            </HeaderRight>
            {/* <h1>Test</h1> */}
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
    display: flex;
    position: fixed;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    background-color: var(--slack-color);
    color: white;
`;

const HeaderLeft = styled.div`
    flex: 0.3;
    display: flex;
    align-items: center;
    margin-left: 20px;

    > .MuiSvgIcon-root {
        margin-left : auto;
        margin-right: 30px;
    }
`;

const HeaderAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const HeaderSearch = styled.div`
    flex: 0.4;
    opacity: 1;
    border-radius: 6px;
    background-color: #421f44;
    text-align: center;
    display: flex;
    padding: 0 50px;
    color: gray;
    border: 1px gray solid;
    > input {
        background-color: transparent;
        border: none;
        text-align: center;
        min-width: 30vw;
        outline: 0;
        color: white;
    }
`;

const HeaderRight = styled.div`
    flex: 0.3;
    display: flex;
    align-items: flex-end;

    > .MuiSvgIcon-root {
        margin-left : auto;
        margin-right: 20px;
    }
`