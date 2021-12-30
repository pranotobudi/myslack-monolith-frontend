import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { firebaseConfig } from '../firebase';
import { initializeApp } from "firebase/app";
import { collection, addDoc, doc, getDoc, getFirestore, Timestamp } from "firebase/firestore"; 
import { useSelector } from "react-redux"
import { selectRoomId, selectRoomName } from '../features/appSlice'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function ChatInput({channelName, channelId, chatRef, websocket, userMongo}) {
    const [input, setInput] = useState("");
    const roomId = useSelector(selectRoomId);
    const roomName = useSelector(selectRoomName);
    console.log("ChatInput-selectRoomId: ", roomId);    
    console.log("ChatInput-channelName: ", channelName);    
    console.log("ChatInput-channelId: ", channelId);    
    console.log("ChatInput-websocket: ", websocket);    
    console.log("ChatInput-userMongo: ", userMongo);    

    const [user] = useAuthState(auth);

    // Initialize Firebase
    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);


    // const docRef = doc(db, "rooms", channelId);
    // const docSnap = await getDoc(docRef);
    
    // await setDoc(doc(db, "cities", "new-city-id"), data);
    // const addDocToFirebase = async (e) => {
    //     channelId=roomId
    //     console.log("input: ", input)
    //     console.log("channelID: ", channelId)
    //     try {
    //         const docRef = await addDoc(collection(db, "rooms", channelId.toString(), "messages"), {
    //             message: input,
    //             timestamp: Timestamp.now(),
    //             username:user.displayName,
    //             userImage: user.photoURL,
    //             //"https://randomuser.me/api/portraits/men/17.jpg"
    //         });
    //         console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // }

    const sendToBackend = () => {
        console.log("inside sendToBackend...")
        try {
            websocket.send(JSON.stringify({
                "message": input,
                "room_id": roomId,
                "user_id": userMongo.id,
                "username":user.displayName,
                "user_image": user.photoURL,
                "timestamp": new Date().toISOString(),
            }));
        } catch (e) {
            console.error("Error adding document: .", e);

        }
    }

    const sendMessage = async (e) => {
        channelId=roomId
        console.log("input: ", input)
        console.log("channelID: ", channelId)
        e.preventDefault(); // prevent refresh
        if (!channelId){
            return false;
        }
        
        // addDocToFirebase();
        sendToBackend();
        // websocket.send(JSON.stringify({"client_id": user.email, "text": input, "room_id": channelName}));

        chatRef.current.scrollIntoView({
            behavior: "smooth",
        });
    
        setInput("");
    };

    return (
        <ChatInputContainer>
            <form>
                <input 
                    value={input} 
                    onChange={(e)=>setInput(e.target.value)}
                    placeholder={`Message #${roomName}`} 
                />
                <Button hidden type="submit" onClick={sendMessage}>
                    SEND
                </Button>
            </form>
        </ChatInputContainer>
    )
}

const ChatInputContainer = styled.div`
    border-radius: 20px;
    > form {
        position: relative;
        display: flex;
        justify-content: center;
    }

    > form > input {
        position : fixed;
        bottom: 30px;
        width: 60%;
        border: 1px solid gray;
        border-radius: 3px;
        padding: 20px;
        outline: none;
    }

    > form > button {
        display: none !important;
    }
`;