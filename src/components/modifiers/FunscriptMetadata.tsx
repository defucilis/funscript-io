import React, { ChangeEvent, useEffect, useState } from "react";

import style from "./Modifiers.module.scss";
import { Funscript } from "funscript-utils/lib/types";
import { addFunscriptMetadata } from "funscript-utils/lib/funConverter";

const FunscriptMetadata = ({
    funscript,
    onApply,
}: {
    funscript: Funscript;
    onApply?: (funscript: Funscript) => void;
}): JSX.Element => {
    /*
"creator": "Slibowitz",
        "description": "",
        "duration": 1306,
        "license": "",
        "notes": "",
        "performers": [],
        "script_url": "https://discuss.eroscripts.com/t/slibowitz-script-index/13335",
        "tags": [],
        "title": "Tries a Big Cock inside her Tight Pussy - Eva Elfie_Eva Elfie",
        "type": "basic",
        "video_url": ""
        */

    const [creator, setCreator] = useState("");
    const [description, setDescription] = useState("");
    const [license, setLicense] = useState("");
    const [notes, setNotes] = useState("");
    const [performers, setPerformers] = useState("");
    const [scriptUrl, setScriptUrl] = useState("");
    const [tags, setTags] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (!funscript || !funscript.metadata) return;
        setCreator(funscript.metadata.creator || "");
        setDescription(funscript.metadata.description || "");
        setLicense(funscript.metadata.license || "");
        setNotes(funscript.metadata.notes || "");
        setPerformers(
            funscript.metadata.performers.length > 0 ? funscript.metadata.performers.join(", ") : ""
        );
        setScriptUrl(funscript.metadata.script_url || "");
        setTags(funscript.metadata.tags.length > 0 ? funscript.metadata.tags.join(", ") : "");
        setTitle(funscript.metadata.title || "");
        setType(funscript.metadata.type || "");
        setVideoUrl(funscript.metadata.video_url || "");
    }, [funscript]);

    const apply = () => {
        const metadata = {
            creator,
            description,
            license,
            notes,
            performers: performers ? performers.split(",").map(performer => performer.trim()) : [],
            // eslint-disable-next-line @typescript-eslint/camelcase
            script_url: scriptUrl,
            tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
            title,
            type,
            // eslint-disable-next-line @typescript-eslint/camelcase
            video_url: videoUrl,
        };
        const newScript = addFunscriptMetadata({ ...funscript, metadata });
        if (onApply) onApply(newScript);
    };

    const clear = () => {
        if (onApply) onApply(funscript);
    };

    return (
        <div className={style.modifier}>
            <h2>Metadata Editor</h2>
            <p className={style.description}>
                Adds custom metadata to the funscript file, for display in various player
                applications
            </p>

            <div className={style.control}>
                <label htmlFor="creator">Creator</label>
                <input
                    id="creator"
                    type="text"
                    className={style.wideInput}
                    value={creator}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCreator(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setDescription(e.target.value)
                    }
                ></textarea>
            </div>
            <div className={style.control}>
                <label htmlFor="license">License</label>
                <input
                    id="license"
                    type="text"
                    className={style.wideInput}
                    value={license}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLicense(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                ></textarea>
            </div>
            <div className={style.control}>
                <label htmlFor="performers">
                    Performers
                    <br />
                    (comma separated)
                </label>
                <input
                    id="performers"
                    type="text"
                    className={style.wideInput}
                    value={performers}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPerformers(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="script_url">Script URL</label>
                <input
                    id="script_url"
                    type="text"
                    className={style.wideInput}
                    value={scriptUrl}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setScriptUrl(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="tags">
                    Tags
                    <br />
                    (comma separated)
                </label>
                <input
                    id="tags"
                    type="text"
                    className={style.wideInput}
                    value={tags}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    className={style.wideInput}
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="type">Type</label>
                <input
                    id="type"
                    type="text"
                    className={style.wideInput}
                    value={type}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
                />
            </div>
            <div className={style.control}>
                <label htmlFor="video_url">Video URL</label>
                <input
                    id="video_url"
                    type="text"
                    className={style.wideInput}
                    value={videoUrl}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                />
            </div>
            <button onClick={apply}>Apply Metadata</button>
            <button onClick={clear}>Reset Metadata</button>
        </div>
    );
};

/*
setCreator(funscript.metadata.creator || "");
setDescription(funscript.metadata.description || "");
setLicense(funscript.metadata.license || "");
setNotes(funscript.metadata.notes || "");
setPerformers(funscript.metadata.performers.length > 0 ? funscript.metadata.performers.join(", ") : "");
setScriptUrl(funscript.metadata.script_url || "");
setTags(funscript.metadata.tags.length > 0 ? funscript.metadata.tags.join(", ") : "");
setTitle(funscript.metadata.title || "");
setType(funscript.metadata.type || "");
setVideoUrl(funscript.metadata.video_url || "");

*/

export default FunscriptMetadata;
