import React, { useCallback } from "react";

import { useDropzone } from "react-dropzone";

import style from "Dropzone.module.scss";

const Dropzone = () => {
    const onDrop = useCallback(files => {
        console.log("Files dropped", files);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className={style.dropzoneContainer}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop file here</p> : <p>Drag a .mp4 file here to test</p>}
            </div>
        </div>
    );
};

export default Dropzone;
