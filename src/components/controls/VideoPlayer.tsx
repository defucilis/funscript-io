import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import useDoubleClick from "use-double-click";
import ReactPlayer from "react-player";

import { MdPlayArrow, MdPause, MdFullscreen, MdFullscreenExit, MdShowChart } from "react-icons/md";

import style from "./VideoPlayer.module.scss";
import { formatDuration } from "../../lib/utils";

export interface VideoPlayerRef {
    seek: (seconds: number) => void;
    seekOffset: (offsetSeconds: number) => void;
    togglePlay: () => void;
}

const VideoPlayer = forwardRef(
    (
        {
            videoUrl,
            videoClassName,
            onPlay,
            onPause,
            onSeek,
            onProgress,
            onShowingPreviewChange,
        }: {
            videoUrl: string;
            videoClassName?: string;
            onPlay?: () => void;
            onPause?: () => void;
            onSeek?: (seconds: number) => void;
            onProgress?: (seconds: number) => void;
            onShowingPreviewChange?: (showingPreview: boolean) => void;
        },
        ref: React.ForwardedRef<VideoPlayerRef>
    ) => {
        const playerParentRef = useRef<HTMLDivElement>();
        const videoParentRef = useRef<HTMLDivElement>();
        const videoRef = useRef<ReactPlayer>();
        const [playing, setPlaying] = useState(false);
        const [playbackTime, setPlaybackTime] = useState(0);
        const [fullscreen, setFullscreen] = useState(false);
        const [videoDuration, setVideoDuration] = useState(0);
        const [showControls, setShowControls] = useState(true);
        const [mouseInterval, setMouseInterval] = useState<NodeJS.Timeout>();
        const [mouseOnControls, setMouseOnControls] = useState(false);
        const [showPlayingPreview, setShowPlayingPreview] = useState(false);

        useDoubleClick({
            onSingleClick: e => {
                setPlaying(cur => !cur);
            },
            onDoubleClick: e => {
                if (fullscreen) document.exitFullscreen();
                else playerParentRef.current.requestFullscreen();
            },
            ref: videoParentRef,
            latency: 200,
        });

        useImperativeHandle(ref, () => ({
            seek: (seconds: number) => seekAbsolute(seconds),
            seekOffset: (offsetSeconds: number) => seekAbsolute(playbackTime + offsetSeconds),
            togglePlay: () => {
                if (playing) pause();
                else play();
            },
        }));

        const handleSeek = (seconds: number) => {
            if (onSeek) onSeek(seconds);
        };

        const handleProgress = (state: {
            played: number;
            playedSeconds: number;
            loaded: number;
            loadedSeconds: number;
        }) => {
            setPlaybackTime(state.playedSeconds);
            if (onProgress) onProgress(state.playedSeconds);
        };

        const play = () => {
            setPlaying(true);
            if (onPlay) onPlay();
        };

        const pause = () => {
            setPlaying(false);
            if (onPause) onPause();
            //should I send handleProgress here?
            //const newTime = videoRef.current.getCurrentTime();
            //setPlaybackTime(newTime);
            //if(onProgress) onProgress(newTime);
        };

        const seekPercent = (durationFraction: number) => {
            const duration = (durationFraction / 100) * videoDuration;
            videoRef.current.seekTo(duration, "seconds");
            setPlaybackTime(duration);
            handleSeek(duration);
        };

        const seekAbsolute = (seconds: number) => {
            const time = Math.max(0, Math.min(videoDuration, seconds));
            videoRef.current.seekTo(time, "seconds");
            setPlaybackTime(time);
            handleSeek(time);
        };

        const handleMouseMove = () => {
            setShowControls(true);
            if (mouseInterval) {
                clearTimeout(mouseInterval);
            }
            const timeoutId = setTimeout(() => setShowControls(false), 3000);
            setMouseInterval(timeoutId);
        };

        useEffect(() => {
            const handleFullscreenChange = () => {
                if (document.fullscreenElement) setFullscreen(true);
                else setFullscreen(false);
            };
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            return () => {
                document.removeEventListener("fullscreenchange", handleFullscreenChange);
            };
        }, []);

        useEffect(() => {
            if (onShowingPreviewChange) onShowingPreviewChange(showPlayingPreview);
        }, [showPlayingPreview, onShowingPreviewChange]);

        return (
            <div className={style.videoPlayer} ref={playerParentRef} onMouseMove={handleMouseMove}>
                <div style={{ height: "100%" }} ref={videoParentRef}>
                    <ReactPlayer
                        ref={videoRef}
                        url={videoUrl}
                        className={videoClassName}
                        width={"100%"}
                        height={"100%"}
                        playing={playing}
                        progressInterval={50}
                        onProgress={handleProgress}
                        onPlay={() => {
                            if (onPlay) {
                                onPlay();
                            }
                        }}
                        onPause={() => {
                            if (onPause) {
                                onPause();
                            }
                        }}
                        onDuration={(duration: number) => setVideoDuration(duration)}
                    />
                </div>
                <div
                    className={style.videoOverlay}
                    style={{
                        bottom: showControls || !fullscreen || mouseOnControls ? 0 : "-2rem",
                    }}
                    onMouseEnter={() => setMouseOnControls(true)}
                    onMouseLeave={() => setMouseOnControls(false)}
                >
                    <button
                        onClick={() => {
                            if (playing) pause();
                            else play();
                        }}
                    >
                        {playing ? <MdPause /> : <MdPlayArrow />}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.01}
                        value={(playbackTime / (videoDuration || 1)) * 100}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            seekPercent(Number(e.target.value));
                        }}
                    />
                    <div className={style.duration}>
                        <p>
                            {formatDuration(playbackTime)} / {formatDuration(videoDuration)}
                        </p>
                    </div>
                    <div className={style.buttons}>
                        <button
                            className={showPlayingPreview ? style.active : null}
                            onClick={() => setShowPlayingPreview(!showPlayingPreview)}
                        >
                            <MdShowChart />
                        </button>
                        <button
                            onClick={() => {
                                if (fullscreen) document.exitFullscreen();
                                else playerParentRef.current.requestFullscreen();
                            }}
                        >
                            {fullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                        </button>
                    </div>
                </div>
                <div
                    className={style.minimalOverlay}
                    style={{
                        width: `${(100 * playbackTime) / videoDuration}%`,
                        opacity: showControls || !fullscreen || mouseOnControls ? 0 : 1,
                    }}
                ></div>
            </div>
        );
    }
);

export default VideoPlayer;
