import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import { getFunscriptFromString } from "funscript-utils/lib/funConverter";
import { Funscript } from "funscript-utils/lib/types";
import Dropzone, { FileRejection } from "react-dropzone";
import { MdShowChart } from "react-icons/md";

import style from "./Modify.module.scss";
import FunscriptHeatmap from "../components/controls/FunscriptHeatmap";
import FunscriptPreview from "../components/controls/FunscriptPreview";
import FunscriptOffset from "../components/modifiers/FunscriptOffset";
import FunscriptFunHalver from "../components/modifiers/FunscriptFunHalver";
import FunscriptFunDoubler from "../components/modifiers/FunscriptFunDoubler";
import FunscriptRemapper from "../components/modifiers/FunscriptRemapper";
import FunscriptRandomizer from "../components/modifiers/FunscriptRandomizer";
import FusncriptLimiter from "../components/modifiers/FunscriptLimiter";

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

const Modify = () => {
    const [funscriptError, setFunscriptError] = useState("");
    const [funscriptName, setFunscriptName] = useState("");
    const [funscript, setFunscript] = useState<Funscript | null>(null);
    const [modifiedFunscript, setModifiedFunscript] = useState<Funscript | null>(null);

    const inputHeatmapRef = useRef<HTMLDivElement>(null);
    const outputHeatmapRef = useRef<HTMLDivElement>(null);
    const inputPreviewRef = useRef<HTMLDivElement>(null);
    const [showingPreview, setShowingPreview] = useState(false);
    const [previewDuration, setPreviewDuration] = useState(1);
    const [previewPosition, setPreviewPosition] = useState(0);

    const [preparedFile, setPreparedFile] = useState(null);

    const [page, setPage] = useState("offset");
    const [pageElement, setPageElement] = useState<JSX.Element>(null);

    const handleFunscriptDrop = (files: File[]) => {
        setFunscriptError("");
        try {
            const extension = files[0].name.split(".").slice(-1)[0];
            const reader = new FileReader();
            reader.onloadend = async (e: ProgressEvent<FileReader>) => {
                const resultString = String(e.target.result);
                if (extension === "funscript") {
                    const newFunscript = getFunscriptFromString(resultString);
                    setFunscript(newFunscript);
                    setModifiedFunscript(newFunscript);
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

    useEffect(() => {
        if (!funscript || !funscript.metadata) return;
        //setPreviewDuration(funscript.metadata.duration / 50);
        setPreviewDuration(10000);
        setPreviewPosition(0);
    }, [funscript]);

    useEffect(() => {
        if (!modifiedFunscript) {
            setPreparedFile(null);
            return;
        }

        const newFilename = funscriptName.replace(".funscript", "_HALVED.funscript");
        setPreparedFile({
            url: window.URL.createObjectURL(new Blob([JSON.stringify(modifiedFunscript)])),
            filename: newFilename,
        });
    }, [modifiedFunscript, funscriptName]);

    useEffect(() => {
        switch (page) {
            case "offset":
                setPageElement(
                    <FunscriptOffset
                        funscript={funscript}
                        onApply={newScript => setModifiedFunscript(newScript)}
                    />
                );
                break;
            case "funHalver":
                setPageElement(
                    <FunscriptFunHalver
                        funscript={funscript}
                        onApply={newScript => setModifiedFunscript(newScript)}
                    />
                );
                break;
            case "funDoubler":
                setPageElement(<FunscriptFunDoubler />);
                break;
            case "remapper":
                setPageElement(
                    <FunscriptRemapper
                        funscript={funscript}
                        onApply={newScript => setModifiedFunscript(newScript)}
                    />
                );
                break;
            case "randomizer":
                setPageElement(<FunscriptRandomizer />);
                break;
            case "limiter":
                setPageElement(<FusncriptLimiter />);
                break;
        }
    }, [page, funscript]);

    return (
        <Layout>
            <div className={style.modify}>
                {!funscript ? null : (
                    <div className={style.funscriptPreview} ref={inputPreviewRef}>
                        {!showingPreview ? null : (
                            <FunscriptPreview
                                funscripts={[funscript, modifiedFunscript]}
                                width={
                                    !inputPreviewRef.current
                                        ? 1
                                        : inputPreviewRef.current.offsetWidth
                                }
                                height={
                                    !inputPreviewRef.current
                                        ? 1
                                        : inputPreviewRef.current.offsetHeight
                                }
                                options={[
                                    {
                                        clear: true,
                                        background: "rgba(0,0,0,0.5)",
                                        startTime: previewPosition,
                                        duration: previewDuration,
                                        lineWeight: 4,
                                    },
                                    {
                                        clear: false,
                                        background: "rgba(0,0,0,0)",
                                        startTime: previewPosition,
                                        duration: previewDuration,
                                        lineColor: "#e8739c",
                                        lineWeight: 2,
                                    },
                                ]}
                            />
                        )}
                    </div>
                )}
                <div className={style.sideBySide}>
                    <div>
                        <div className={style.dropzoneContainer}>
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
                        {!funscript ? null : (
                            <>
                                <div className={style.funscriptPreview} ref={inputPreviewRef}>
                                    {!showingPreview ? null : (
                                        <FunscriptPreview
                                            funscripts={[funscript, modifiedFunscript]}
                                            width={
                                                !inputPreviewRef.current
                                                    ? 1
                                                    : inputPreviewRef.current.offsetWidth
                                            }
                                            height={
                                                !inputPreviewRef.current
                                                    ? 1
                                                    : inputPreviewRef.current.offsetHeight
                                            }
                                            options={[
                                                {
                                                    clear: true,
                                                    background: "rgba(0,0,0,0.5)",
                                                    startTime: previewPosition,
                                                    duration: previewDuration,
                                                    lineWeight: 4,
                                                },
                                                {
                                                    clear: false,
                                                    background: "rgba(0,0,0,0)",
                                                    startTime: previewPosition,
                                                    duration: previewDuration,
                                                    lineColor: "#e8739c",
                                                    lineWeight: 2,
                                                },
                                            ]}
                                        />
                                    )}
                                </div>
                                <div className={style.heatmaps} ref={inputHeatmapRef}>
                                    <FunscriptHeatmap
                                        funscript={funscript}
                                        width={
                                            !inputHeatmapRef.current
                                                ? 1
                                                : inputHeatmapRef.current.offsetWidth
                                        }
                                        height={30}
                                        onMouseEnter={() => setShowingPreview(true)}
                                        onMouseLeave={() => setShowingPreview(false)}
                                        onWheel={(e: React.WheelEvent<HTMLCanvasElement>) => {
                                            const dir = e.deltaY;
                                            setPreviewDuration(cur => {
                                                console.log(e);
                                                return Math.min(
                                                    funscript.metadata.duration,
                                                    dir < 0 ? cur / 1.5 : cur * 1.5
                                                );
                                            });
                                        }}
                                        onMouseMove={(e: any) => setPreviewPosition(e.localX)}
                                        hoverDisplayDuration={previewDuration}
                                    />
                                </div>
                                <div className={style.metadata}>
                                    <div>
                                        <p>
                                            Duration:{" "}
                                            {formatDuration(
                                                Math.round(funscript.metadata.duration / 1000.0)
                                            )}
                                        </p>
                                        <span>|</span>
                                        <p>
                                            Intensity:{" "}
                                            {Math.round(funscript.metadata.averageIntensity)}
                                        </p>
                                        <span>|</span>
                                        <p>Actions: {funscript.actions.length}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <div className={style.infoAndSave}>
                            {preparedFile ? (
                                <a href={preparedFile.url} download={preparedFile.filename}>
                                    Save modified script
                                </a>
                            ) : (
                                <p>Add a .funscript to begin</p>
                            )}
                        </div>
                        {!modifiedFunscript ? null : (
                            <>
                                <div className={style.heatmaps} ref={outputHeatmapRef}>
                                    <FunscriptHeatmap
                                        funscript={modifiedFunscript}
                                        width={
                                            !outputHeatmapRef.current
                                                ? 1
                                                : outputHeatmapRef.current.offsetWidth
                                        }
                                        height={30}
                                        onMouseEnter={() => setShowingPreview(true)}
                                        onMouseLeave={() => setShowingPreview(false)}
                                        onWheel={(e: React.WheelEvent<HTMLCanvasElement>) => {
                                            const dir = e.deltaY;
                                            setPreviewDuration(cur => {
                                                console.log(e);
                                                return Math.min(
                                                    modifiedFunscript.metadata.duration,
                                                    dir < 0 ? cur / 1.5 : cur * 1.5
                                                );
                                            });
                                        }}
                                        onMouseMove={(e: any) => setPreviewPosition(e.localX)}
                                        hoverDisplayDuration={previewDuration}
                                    />
                                </div>
                                <div className={style.metadata}>
                                    <div>
                                        <p>
                                            Duration:{" "}
                                            {formatDuration(
                                                Math.round(
                                                    modifiedFunscript.metadata.duration / 1000.0
                                                )
                                            )}
                                        </p>
                                        <span>|</span>
                                        <p>
                                            Intensity:{" "}
                                            {Math.round(
                                                modifiedFunscript.metadata.averageIntensity
                                            )}
                                        </p>
                                        <span>|</span>
                                        <p>Actions: {modifiedFunscript.actions.length}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {funscript && modifiedFunscript ? (
                    <div className={style.operations}>
                        <div className={style.list}>
                            <ul>
                                <li
                                    className={page === "offset" ? style.selected : null}
                                    onClick={() => setPage("offset")}
                                >
                                    Offset
                                </li>
                                <li
                                    className={page === "funHalver" ? style.selected : null}
                                    onClick={() => setPage("funHalver")}
                                >
                                    FunHalver
                                </li>
                                <li
                                    className={page === "funDoubler" ? style.selected : null}
                                    onClick={() => setPage("funDoubler")}
                                >
                                    FunDoubler
                                </li>
                                <li
                                    className={page === "remapper" ? style.selected : null}
                                    onClick={() => setPage("remapper")}
                                >
                                    Remapper
                                </li>
                                <li
                                    className={page === "randomizer" ? style.selected : null}
                                    onClick={() => setPage("randomizer")}
                                >
                                    Randomizer
                                </li>
                                <li
                                    className={page === "limiter" ? style.selected : null}
                                    onClick={() => setPage("limiter")}
                                >
                                    Limiter
                                </li>
                            </ul>
                        </div>
                        <div className={style.page}>{pageElement}</div>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
};

export default Modify;
