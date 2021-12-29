import React, { useState } from 'react'
import SidebarOption from './SidebarOption.js';
import styled from 'styled-components';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CreateIcon from '@mui/icons-material/Create';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AppsIcon from '@mui/icons-material/Apps';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useCollection } from 'react-firebase-hooks/firestore'
// import { firebaseConfig } from '../firebase';
// import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

export default function Sidebar({websocket, userMongo}) {
    // Initialize Firebase
    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);
    console.log("Sidebar comp")
    // const [channels, loading, error] = useCollection(
    //     collection(db, 'rooms'),
    //     {
    //       snapshotListenOptions: { includeMetadataChanges: true },
    //     }
    //   );
    const [channels, updateChannels] = React.useState([]);
 
    React.useEffect(function effectFunction() {
        async function fetchChannels(){
            const response = await fetch(`${process.env.REACT_APP_EXTERNAL_HOST}/rooms`);
           const json = await response.json();
           updateChannels(json["data"]);
            console.log("response: ", json["data"])
        }
        fetchChannels();
    }, []); // This empty array represents an empty list of dependencies
 

    //   const response = fetch(`${process.env.REACT_APP_EXTERNAL_HOST}/rooms`)
    //   .then(res=>res.json())
    //   .then((responseJson)=>{
    //     updateChannels(responseJson["data"])
    //     // channels = responseJson["data"]
    //     // console.log("response: ", responseJson)
    //     // console.log("response: ", channels)
    //   })
    //   .catch((error)=>{
    //     console.log(error)
    //   })

    const [user] = useAuthState(auth);
 
    //   channels.docs.map((doc) => {
    //     console.log(doc.data().name)
    // })
    

    return (
        <SidebarContainer>
            <SidebarHeader>
                <SidebarInfo>
                    <h2>My Slack</h2>
                    <h3>
                        <FiberManualRecordIcon />
                        {/* Pranoto Budi */}
                        {user.displayName}
                    </h3>
                </SidebarInfo>
                <CreateIcon />
            </SidebarHeader>

            <SidebarOption Icon={InsertCommentIcon} title="Threads" />
            <SidebarOption Icon={InboxIcon} title="Mentions & Reactions" />
            <SidebarOption Icon={DraftsIcon} title="Saved Items" />
            <SidebarOption Icon={BookmarkBorderIcon} title="Channel Browser" />
            <SidebarOption Icon={PeopleAltIcon} title="People & User groups" />
            <SidebarOption Icon={AppsIcon} title="Apps" />
            <SidebarOption Icon={FileCopyIcon} title="File Browser" />
            <SidebarOption Icon={ExpandLessIcon} title="Show Less" />
            <hr />
            <SidebarOption Icon={ExpandMoreIcon} title="Channels" />
            <hr />
            <SidebarOption Icon={AddIcon} addChannelOption title="Add Channel"  />

            {/* {channels?.docs.map((doc) => {
                <SidebarOption key={doc.id} id={doc.id} addChannelOption title={doc.data().name}  />
            })} */}
            {/* execute if channels available, because it is async, will throw error if not availables */}
            {/* this is to handle firebase connection */}
            {/* {channels?.docs.map((doc) => (
                // console.log(doc.id);
                // console.log(doc.data().name);
                // roomName and title share the same data;
                <SidebarOption key={doc.id} id={doc.id} roomName={doc.get("name")}  title={doc.data().name}  />
            ))} */}

            {/* this is to handle backend connection */}
            {(!channels.length)?<>abc</>:channels.map((room) => (
                // console.log(doc.id);
                // console.log(doc.data().name);
                // roomName and title share the same data;
                <SidebarOption key={room.id} id={room.id} roomName={room.name}  title={room.name}  />
            ))}
            
        </SidebarContainer>
    )
}

const SidebarContainer = styled.div`
    color: white;
    background-color: var(--slack-color);
    flex: 0.3;
    border-top: 1px solid #49274b;
    max-width: 260px;
    margin-top: 46px;

    >hr {
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px solid #49274b;
    }
`;

const SidebarHeader = styled.div`
    display: flex;
    border-bottom: 1px solid #49274b;
    padding: 13px;

    > .MuiSvgIcon-root {
        padding: 8px;
        color: #49274b;
        font-size:18px;
        background-color: white;
        border-radius:999px;
    }
`;

const SidebarInfo = styled.div`
    flex: 1;

    > h2 {
        font-size: 15px;
        font-weight: 900;
        margin-bottom: 5px;
    }

    > h3 {
        display: flex;
        font-size: 13px;
        font-weight: 400;
        align-items: center;
    }

    > h3 >  .MuiSvgIcon-root {
        font-size:18px;
        margin-top: 1px;
        margin-right: 2px;
        color: green;
    }
`;