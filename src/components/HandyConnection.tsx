import React, { useState, useEffect, ReactNode, useCallback } from "react";
import useHandy from "../lib/HandyReact";

import { MdCheckCircle, MdCached, MdError } from "react-icons/md";

import style from "./HandyConnection.module.scss";

const HandyConnection = () => {
    const { handy } = useHandy();
    const [loading, setLoading] = useState(true);
    const [handyConnected, setHandyConnected] = useState(false);
    const [icon, setIcon] = useState<ReactNode>(null);
    const [label, setLabel] = useState("");
    const [connectionKey, setConnectionKey] = useState("");

    const tryConnect = useCallback(async () => {
        setLoading(true);
        try {
            const result = await handy.getStatus();
            if (result.success) {
                setHandyConnected(true);
                setConnectionKey(handy.connectionKey);
            }
        } catch (error) {
            console.error(error);
            setHandyConnected(false);
        }
        setLoading(false);
    }, [handy]);

    useEffect(() => {
        tryConnect();
    }, [tryConnect]);

    useEffect(() => {
        if (loading) {
            setIcon(
                <span className={`${style.icon} ${style.loading}`}>
                    <MdCached className="spin" />
                </span>
            );
            setLabel("Connecting...");
            return;
        } else {
            if (handyConnected) {
                setIcon(
                    <span className={`${style.icon} ${style.connected}`}>
                        <MdCheckCircle />
                    </span>
                );
                setLabel("Handy Connected");
            } else {
                setIcon(
                    <span className={`${style.icon} ${style.notConnected}`}>
                        <MdError />
                    </span>
                );
                setLabel("Handy Disconnected");
            }
        }
    }, [handyConnected, loading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (handyConnected) disconnect();
        else connect();
    };

    const disconnect = () => {
        handy.connectionKey = "";
        setHandyConnected(false);
    };

    const connect = () => {
        handy.connectionKey = connectionKey;
        tryConnect();
    };

    const handleConnectionKeyChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConnectionKey(e.target.value);
    };

    return (
        <div className={style.handyConnection}>
            <p>
                {icon}
                <span className={style.navText}>{label}</span>
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    disabled={handyConnected || loading}
                    value={connectionKey}
                    onChange={handleConnectionKeyChanged}
                    placeholder={"Connection Key"}
                />
                <input
                    type="submit"
                    disabled={loading}
                    value={handyConnected ? "Disconnect" : "Connect"}
                />
            </form>
        </div>
    );
};

export default HandyConnection;
