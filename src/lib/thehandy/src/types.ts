export enum HandyMode {
    off = 0,
    automatic = 1,
    position = 2,
    calibration = 3,
    sync = 4,
}

export interface CommandResponse {
    success: boolean;
    connected: boolean;
    cmd?: string;
    error?: string;
}

export interface VersionResponse extends CommandResponse {
    version: string;
    latest: string;
}

export interface ModeResponse extends CommandResponse {
    mode: HandyMode;
}

export interface SettingsResponse extends ModeResponse {
    position: number;
    speed: number;
    stroke: number;
}

export interface StatusResponse extends CommandResponse {
    position: number;
    speed: number;
    setSpeedPercent: number;
}

export interface SetResponse extends CommandResponse {
    currentPosition: number;
}

export interface SetSpeedResponse extends SetResponse {
    speed: number;
    speedPercent: number;
}

export interface SetStrokeResponse extends SetResponse {
    stroke: number;
    strokePercent: number;
}

export interface SyncPrepareResponse extends CommandResponse {
    downloaded: boolean;
}

export interface SyncPlayResponse extends CommandResponse {
    setOffset: number;
    serverTimeDelta?: number;
}

export interface SyncOffsetResponse extends CommandResponse {
    offset: number;
}
