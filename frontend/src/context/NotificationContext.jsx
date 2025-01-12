// src/context/NotificationContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "../api/Socket";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import NotificationAPI from "../api/NotificationAPI";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!auth.user) return;

    // Fetch existing notifications
    const fetchNotifications = async () => {
      try {
        const response = await NotificationAPI.get(`/user/${auth.user.id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [auth.user]);

  useEffect(() => {
    if (!auth.user) return;

    // 2. Connect to WebSocket and listen for new notifications
    const socket = new SockJS(SOCKET_URL); // e.g., "http://localhost:8081/ws"
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Optionally, set a reconnect delay
      onConnect: () => {
        console.log("Connected to Notification WebSocket");

        // Subscribe to the user's notification topic
        stompClient.subscribe(
          `/topic/user.${auth.user.id}`,
          (message) => {
            console.log("Received message:", message);
            if (message.body) {
              const notification = JSON.parse(message.body);
              // Update state with the new notification
              setNotifications((prev) => [notification, ...prev]);

              // Display a toast notification
              toast.info(notification.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          }
        );
      },
      onStompError: (frame) => {
        console.error("WebSocket Stomp Error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [auth.user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
