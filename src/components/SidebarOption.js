import React from 'react';
import styled from 'styled-components';
import { firebaseConfig } from '../firebase';
import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore"; 
import {enterRoom} from "../features/appSlice";
import { useDispatch } from "react-redux";

export default function SidebarOption({id, roomName, Icon, title, addChannelOption}) {
    const dispatch = useDispatch();
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("SidebarOption comp")

    // const addChannel = async () => {
    //     const channelName = prompt("Please enter the channel name");
    //     if (channelName){
    //         try {
    //             const docRef = await addDoc(collection(db, "rooms"), {
    //                 name: channelName,
    //             });
    //             console.log("Document written with ID: ", docRef.id);
    //           } catch (e) {
    //             console.error("Error adding document: ", e);
    //           }
              
    //     }
    // };

    const addChannel = async () => {
        const channelName = prompt("Please enter the channel name");
        if (channelName){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id:"", name: channelName })
            };
            const response = await fetch(`${process.env.REACT_APP_EXTERNAL_HOST}/room`, requestOptions);
            const json = await response.json();
            console.log("POST addchannel response.data: ",json["data"]);
        }
    }

    const selectChannel = () => {
        console.log("roomID: ",id);
        if (id){
            dispatch(enterRoom({
                roomId: id,
                roomName: roomName,
            }))
        }
    };

    return (
        <SidebarOptionContainer
            onClick = {addChannelOption? addChannel : selectChannel }
        >
            {Icon && <Icon fontSize="small" style={{ padding: 10 }} />}
            {Icon ? (
                <h3>{title}</h3>
            ):(
                <SidebarOptionChannel>
                    <span>#</span> {title}
                </SidebarOptionChannel>
            )}
        </SidebarOptionContainer>

    )
}

const SidebarOptionContainer = styled.div`
    display: flex;
    font-size: 12px;
    align-items: center;
    padding-left: 2px;
    cursor: pointer;

    :hover{
        opacity: 0.9;
        background-color: #340c36;
    }

    > h3 {
        font-weight: 500;
    }

    > h3 > span {
        padding: 15px;
    }
`;
const SidebarOptionChannel = styled.h3`
    padding: 10px 0;
    font-weight: 300;
`;
