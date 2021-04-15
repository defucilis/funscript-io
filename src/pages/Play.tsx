import React, { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import Layout from "../components/layout/Layout";

import useHandy from "../lib/HandyReact";
import { MdShowChart, MdMovie, MdCached } from "react-icons/md";
import Dropzone, { FileRejection } from "react-dropzone";

import style from "./Play.module.scss";
import { convertFunscriptToCsv, getFunscriptFromString } from "funscript-utils/lib/funConverter";
import { Funscript } from "funscript-utils/lib/types";
import FunscriptHeatmap from "../components/controls/FunscriptHeatmap";
import SingleScreenPage from "../components/layout/SingleScreenPage";
import { formatColor, getColor } from "funscript-utils/lib/funMapper";
import FunscriptPreview from "../components/controls/FunscriptPreview";
import VideoPlayer, { VideoPlayerRef } from "../components/controls/VideoPlayer";
import useActiveElement from "../lib/useActiveElement";

interface PrepareStatus {
    status: "inactive" | "sync" | "prepare" | "ready";
    syncProgress?: number;
    error?: string;
}

const formatDuration = (seconds: number) => {
    seconds = Math.round(seconds);
    let output = "";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds %= 60;
    if (hours > 1) output += hours + ":";
    if (minutes >= 10) output += minutes + ":";
    else if (minutes > 0 && hours > 0) output += "0" + minutes + ":";
    else if (minutes > 0 && hours === 0) output += minutes + ":";
    else if (minutes === 0) output += "00:";
    if (seconds > 10) output += seconds;
    else if (seconds > 0) output += "0" + seconds;
    else output += "00";
    return output;
};

const Play = () => {
    const { handy } = useHandy();
    const activeElement = useActiveElement();

    const [videoUrl, setVideoUrl] = useState("");
    const [csvUrl, setCsvUrl] = useState("");
    const [funscriptName, setFunscriptName] = useState("");
    const [videoName, setVideoName] = useState("");
    const controlsRef = useRef<HTMLDivElement>();
    const previewRef = useRef<HTMLDivElement>();
    const playerParentRef = useRef<HTMLDivElement>();
    const videoPlayerRef = useRef<VideoPlayerRef>();

    const [waiting, setWaiting] = useState(false);
    const [syncOffset, setSyncOffset] = useState(0);
    const [funscript, setFunscript] = useState<Funscript | null>(null);
    const [syncElement, setSyncElement] = useState<ReactNode>(null);

    const [videoError, setVideoError] = useState("");
    const [funscriptError, setFunscriptError] = useState("");

    const [showingPreview, setShowingPreview] = useState(false);
    const [previewDuration, setPreviewDuration] = useState(1);
    const [previewPosition, setPreviewPosition] = useState(0);

    const [lastSyncTime, setLastSyncTime] = useState(-1);

    useEffect(() => {
        if (!funscript || !funscript.fuMetadata) return;
        //setPreviewDuration(funscript.fuMetadata.duration / 50);
        setPreviewDuration(10000);
        setPreviewPosition(0);
        setLastSyncTime(-1);
    }, [funscript]);

    const [prepareStatus, setPrepareStatus] = useState<PrepareStatus>({
        status: "ready",
    });

    const validateFunscript = (file: File) => {
        const ext = file.name.split(".").slice(-1)[0];
        if (ext !== "funscript" && ext !== "csv") {
            return {
                code: "wrong-file-extension",
                message: "Only .funscript and .csv files allowed",
            };
        }
        return null;
    };

    const validateVideo = (file: File) => {
        const ext = file.name.split(".").slice(-1)[0];
        if (ext !== "mp4" && ext !== "m4v") {
            return {
                code: "wrong-file-extension",
                message: "Only .mp4 and .m4v files allowed",
            };
        }
        return null;
    };

    useEffect(() => {
        let offsets = [];
        for (let i = 0; i < 300; i++) {
            offsets.push(Math.random() * 100 + 100);
        }
        //discard all readings more than one standard deviation from the mean, to reduce error
        const mean = offsets.reduce((acc, offset) => acc + offset, 0) / offsets.length;
        const errors = offsets.map(offset => Math.pow(offset - mean, 2));
        const sd = Math.sqrt(errors.reduce((acc, offset) => acc + offset, 0) / errors.length);
        offsets = offsets.filter(offset => Math.abs(offset - mean) < sd);
        //get average offset
        const offsetAggregate = offsets.reduce((acc, offset) => acc + offset) / offsets.length;
        console.log({ offsetAggregate });
    }, []);

    const handleVideoDrop = (files: File[]) => {
        setVideoError("");
        try {
            console.log(files);
            const objectUrl = URL.createObjectURL(files[0]);
            console.log("Object Url: ", objectUrl);
            setPlaying(false);
            setPlaybackTime(0);
            setVideoUrl(objectUrl);
            setVideoName(files[0].name);
        } catch (error) {
            setVideoError(error);
        }
    };

    useEffect(() => {
        setLastSyncTime(-1);
        setPlaying(false);
        setPlaybackTime(0);
    }, [videoUrl]);

    const handleVideoRejected = (rejections: FileRejection[]) => {
        setVideoError(
            rejections[0].errors.find(error => error.code === "wrong-file-extension").message
        );
    };

    const handleFunscriptDrop = (files: File[]) => {
        setFunscriptError("");
        try {
            const extension = files[0].name.split(".").slice(-1)[0];
            const fileName = files[0].name.substr(0, files[0].name.length - extension.length - 1);
            const reader = new FileReader();
            reader.onloadend = async (e: ProgressEvent<FileReader>) => {
                const resultString = String(e.target.result);
                if (extension === "funscript") {
                    setFunscript(getFunscriptFromString(resultString));
                    const csv = convertFunscriptToCsv(resultString);
                    const csvFile = new File([csv], fileName);
                    const uploadedCsv = await handy.uploadCsv(csvFile);
                    setCsvUrl(uploadedCsv.url);
                } else if (extension === "csv") {
                    setFunscript(null);
                    const csvFile = new File([resultString], fileName);
                    const uploadedCsv = await handy.uploadCsv(csvFile);
                    setCsvUrl(uploadedCsv.url);
                } else {
                    throw new Error("invalid type for script file");
                }
            };
            reader.readAsText(files[0]);
            setFunscriptName(files[0].name);
        } catch (error) {
            setFunscriptError(error);
        }
    };

    const handleFunscriptRejected = (rejections: FileRejection[]) => {
        setFunscriptError(
            rejections[0].errors.find(error => error.code === "wrong-file-extension").message
        );
    };

    const [playbackTime, setPlaybackTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const handlePlay = () => {
        if (playing) return;
        setPlaying(true);
        syncPlay(true, playbackTime * 1000);
        setLastSyncTime(-1);
    };
    const handlePause = () => {
        if (!playing) return;
        setPlaying(false);
        syncPlay(false);
        setLastSyncTime(-1);
    };
    const handleSeek = (seconds: number) => {
        console.log("Seek from", { playing, seconds });
        setPlaybackTime(seconds);
        if (playing) {
            syncPlay(true, seconds * 1000);
        }
        setLastSyncTime(-1);
    };

    const fullPrepare = useCallback(
        async (url: string) => {
            setWaiting(true);
            const status: PrepareStatus = {
                status: "sync",
                syncProgress: 0,
                error: null,
            };
            setPrepareStatus({ ...status });
            console.log({ status });
            try {
                const result = await handy.getServerTimeOffset(10, progress => {
                    status.syncProgress = progress * 100;
                    setPrepareStatus({ ...status });
                    console.log({ status });
                });
                status.syncProgress = 100;
                setPrepareStatus({ ...status });
                console.log({ status });
                console.log(result);
            } catch (error) {
                console.error(error);
                status.status = "inactive";
                status.error = "Failed to sync with server: " + error.error;
                setPrepareStatus({ ...status });
                console.log({ status });
            }
            if (status.error) {
                setWaiting(false);
                return;
            }

            status.status = "prepare";
            setPrepareStatus({ ...status });
            console.log({ status });
            try {
                const result = await handy.syncPrepare(url);
                status.status = "ready";
                setPrepareStatus({ ...status });
                console.log({ status });
                console.log(result);
            } catch (error) {
                console.error(error);
                status.status = "inactive";
                status.error = "Failed to download script to Handy: " + error.error;
                setPrepareStatus({ ...status });
                console.log({ status });
            }
            setWaiting(false);
        },
        [handy]
    );

    useEffect(() => {
        if (!csvUrl) return;
        fullPrepare(csvUrl);
    }, [csvUrl, fullPrepare]);

    useEffect(() => {
        const getElement = () => {
            switch (prepareStatus.status) {
                case "inactive":
                    return prepareStatus.error ? (
                        <p className={style.error}>{prepareStatus.error}</p>
                    ) : null;
                case "sync":
                    return (
                        <p>{`Determine server sync offset time: ${prepareStatus.syncProgress}%`}</p>
                    );
                case "prepare":
                    return <p>{`Downloading script to Handy`}</p>;
                case "ready":
                    return <p>{`Ready to play`}</p>;
                default:
                    return <p>{`Unexpected app error`}</p>;
            }
        };
        setSyncElement(getElement());
    }, [prepareStatus]);

    const syncPlay = async (play: boolean, time = 0) => {
        setWaiting(true);
        console.log("sync play", { play, time });
        try {
            const result = await handy.syncPlay(play, time);
            if (result.setOffset) setSyncOffset(result.setOffset);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        setWaiting(false);
    };

    const uploadSyncOffset = useCallback(
        async (offset: number) => {
            setSyncOffset(offset);
            setWaiting(true);
            console.log("sync offset to " + offset);
            try {
                const result = await handy.syncOffset(offset);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
            setWaiting(false);
        },
        [handy]
    );

    const incrementSyncOffset = useCallback(
        (increment: number) => {
            uploadSyncOffset(syncOffset + increment);
        },
        [uploadSyncOffset, syncOffset]
    );

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (activeElement) return;
            e.preventDefault();

            switch (e.key) {
                case " ":
                    videoPlayerRef.current.togglePlay();
                    break;
                case "ArrowDown":
                    if (waiting) return;
                    incrementSyncOffset(-50);
                    break;
                case "ArrowUp":
                    if (waiting) return;
                    incrementSyncOffset(50);
                    break;
                case "ArrowLeft":
                    videoPlayerRef.current.seekOffset(-10);
                    break;
                case "ArrowRight":
                    videoPlayerRef.current.seekOffset(10);
                    break;
            }
        };
        const supressKeyUp = (e: KeyboardEvent) => {
            if (activeElement) return;
            e.preventDefault();
        };

        window.addEventListener("keydown", handleKey);
        window.addEventListener("keyup", supressKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("keyup", supressKeyUp);
        };
    }, [waiting, incrementSyncOffset, activeElement]);

    const handleVideoProgress = async (seconds: number) => {
        setPlaybackTime(seconds);
        if (!playing || (lastSyncTime >= 0 && Math.abs(seconds - lastSyncTime) < 10)) return;
        const first = lastSyncTime < 0;
        setLastSyncTime(seconds);
        try {
            await handy.syncAdjustTimestamp(seconds, first ? 1 : 0.5);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <SingleScreenPage>
                <div className={style.play}>
                    <div className={style.dropzones}>
                        <Dropzone
                            onDropAccepted={handleVideoDrop}
                            onDropRejected={handleVideoRejected}
                            accept={["video/*"]}
                            multiple={false}
                            validator={validateVideo}
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <div
                                    className={`${style.dropzone} ${
                                        isDragActive ? style.active : null
                                    }`}
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <div>
                                        <MdMovie />
                                        {videoName ? (
                                            <p>{videoName}</p>
                                        ) : (
                                            <p>Drag a video file here</p>
                                        )}
                                    </div>
                                    {videoError ? (
                                        <p className={style.dropError}>{videoError}</p>
                                    ) : null}
                                </div>
                            )}
                        </Dropzone>
                        <Dropzone
                            onDropAccepted={handleFunscriptDrop}
                            onDropRejected={handleFunscriptRejected}
                            multiple={false}
                            validator={validateFunscript}
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <div
                                    className={`${style.dropzone} ${
                                        isDragActive ? style.active : null
                                    }`}
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <div>
                                        <MdShowChart />
                                        {funscriptName ? (
                                            <p>{funscriptName}</p>
                                        ) : (
                                            <p>Drag a .funscript or .csv file here</p>
                                        )}
                                    </div>
                                    {funscriptError ? (
                                        <p className={style.dropError}>{funscriptError}</p>
                                    ) : null}
                                </div>
                            )}
                        </Dropzone>
                    </div>
                    <div className={style.preparingPlayer}>
                        {prepareStatus.status !== "ready" ? (
                            <div className={style.preparing}>
                                {prepareStatus.status === "inactive" ? (
                                    prepareStatus.error ? (
                                        <div className={style.error}>
                                            <p className={style.error}>{prepareStatus.error}</p>
                                            <button onClick={() => fullPrepare(csvUrl)}>
                                                Try Again
                                            </button>
                                        </div>
                                    ) : (
                                        <p></p>
                                    )
                                ) : (
                                    <div>
                                        <MdCached className="spin" />
                                        <div className={style.progress}>
                                            <div
                                                style={{ width: `${prepareStatus.syncProgress}%` }}
                                            >
                                                {prepareStatus.status === "prepare" ? (
                                                    <div className="scrollingBars"></div>
                                                ) : null}
                                            </div>
                                        </div>
                                        {syncElement}
                                    </div>
                                )}
                            </div>
                        ) : !videoUrl ? (
                            <div className={style.preparing}></div>
                        ) : (
                            <div style={{ height: "100%" }} ref={playerParentRef}>
                                <VideoPlayer
                                    ref={videoPlayerRef}
                                    videoClassName={style.player}
                                    videoUrl={videoUrl}
                                    onPlay={handlePlay}
                                    onPause={handlePause}
                                    onSeek={handleSeek}
                                    onProgress={handleVideoProgress}
                                />
                            </div>
                        )}
                        <div className={style.preview} ref={previewRef}>
                            {!funscript || !showingPreview ? null : (
                                <FunscriptPreview
                                    funscripts={[funscript]}
                                    width={!previewRef.current ? 1 : previewRef.current.offsetWidth}
                                    height={
                                        !previewRef.current ? 1 : previewRef.current.offsetHeight
                                    }
                                    options={[
                                        {
                                            clear: true,
                                            background: "rgba(0,0,0,0.5)",
                                            startTime: previewPosition,
                                            duration: previewDuration,
                                        },
                                    ]}
                                />
                            )}
                        </div>
                    </div>
                    {csvUrl ? (
                        <div className={style.controls} ref={controlsRef}>
                            <div className={style.infoControls}>
                                <div className={style.scriptInfo}>
                                    <h2>Funscript Metadata</h2>
                                    {!funscript ? (
                                        <p>{`Can't get metadata from CSV script`}</p>
                                    ) : (
                                        <>
                                            <p>
                                                Duration:{" "}
                                                {formatDuration(
                                                    funscript.fuMetadata.duration / 1000
                                                )}
                                            </p>
                                            <p>
                                                Average Intensity:{" "}
                                                <span
                                                    style={{
                                                        color: formatColor(
                                                            getColor(
                                                                funscript.fuMetadata
                                                                    .averageIntensity
                                                            )
                                                        ),
                                                    }}
                                                >
                                                    {Math.round(
                                                        funscript.fuMetadata.averageIntensity
                                                    )}
                                                </span>
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div className={style.syncOffset}>
                                    <div className={style.syncButton}>
                                        <button
                                            disabled={waiting}
                                            onClick={() => incrementSyncOffset(-50)}
                                        >
                                            Delay Handy
                                        </button>
                                        <p>(Down Arrow)</p>
                                    </div>
                                    <div>
                                        <p>
                                            <span>Handy is </span>
                                            <span>
                                                {syncOffset === 0
                                                    ? "not offset"
                                                    : `${
                                                          syncOffset < 0 ? "delayed" : "advanced"
                                                      } by ${Math.abs(syncOffset)}ms`}
                                            </span>
                                        </p>
                                    </div>
                                    <div className={style.syncButton}>
                                        <button
                                            disabled={waiting}
                                            onClick={() => incrementSyncOffset(50)}
                                        >
                                            Advance Handy
                                        </button>
                                        <p>(Up Arrow)</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.heatmap}>
                                <FunscriptHeatmap
                                    funscript={funscript}
                                    width={
                                        !controlsRef.current ? 1 : controlsRef.current.offsetWidth
                                    }
                                    height={30}
                                    onMouseEnter={() => setShowingPreview(true)}
                                    onMouseLeave={() => setShowingPreview(false)}
                                    onWheel={(e: React.WheelEvent<HTMLCanvasElement>) => {
                                        const dir = e.deltaY;
                                        setPreviewDuration(cur => {
                                            console.log(e);
                                            return Math.min(
                                                funscript.fuMetadata.duration,
                                                dir < 0 ? cur / 1.5 : cur * 1.5
                                            );
                                        });
                                    }}
                                    onMouseMove={(e: any) => setPreviewPosition(e.localX)}
                                    hoverDisplayDuration={previewDuration}
                                    playbackTime={
                                        !playing && !playbackTime ? undefined : playbackTime
                                    }
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </SingleScreenPage>
        </Layout>
    );
};

export default Play;
