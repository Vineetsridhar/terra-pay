import React, { useEffect } from "react";
import { globalEmitter } from "./emitter";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
type NotificationType = "info" | "error" | "warning" | "success"


export function Notification(props: any) {
    useEffect(() => {
        globalEmitter.addListener(
            "notification",
            handleNotificationEmitted
        );
        return unmount
    })


    function handleNotificationEmitted(event: {
        message: string;
        type: NotificationType;
    }) {
        createNotification(event.type, event.message);
    }

    function unmount() {
        globalEmitter.removeListener(
            "notification",
            handleNotificationEmitted
        );
    }

    const createNotification = (type: NotificationType, message: string) => {
        switch (type) {
            case "info":
                NotificationManager.info(message);
                break;
            case "success":
                NotificationManager.success(message);
                break;
            case "warning":
                NotificationManager.warning(
                    "Warning message",
                    "Close after 3000ms",
                    3000
                );
                break;
            case "error":
                NotificationManager.error(message);
                break;
        }
    };

    return (
        <div>
            <NotificationContainer />
        </div>
    );

}

export default Notification;
