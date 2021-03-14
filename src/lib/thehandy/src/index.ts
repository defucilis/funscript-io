import {
    HandyMode,
    ModeResponse,
    SetSpeedResponse,
    SetStrokeResponse,
    SettingsResponse,
    StatusResponse,
    SyncOffsetResponse,
    SyncPlayResponse,
    SyncPrepareResponse,
    VersionResponse,
} from "./types";

const baseUrl = "https://www.handyfeeling.com/api/v1/";

class Handy {
    _connectionKey: string;
    mode: HandyMode;
    serverTimeOffset: number;

    constructor(connectionKey?: string) {
        if (connectionKey) this.connectionKey = connectionKey;
        else {
            const storedConnectionKey = localStorage.getItem("connectionKey");
            if (storedConnectionKey) this._connectionKey = storedConnectionKey;
        }
        this.mode = HandyMode.off;
        this.serverTimeOffset = 0;
    }

    get connectionKey() {
        return this._connectionKey;
    }
    set connectionKey(connectionKey: string) {
        this._connectionKey = connectionKey;
        localStorage.setItem("connectionKey", connectionKey);
    }

    //---------------------------------------------
    //                  GET DATA
    //---------------------------------------------
    async setMode(mode: HandyMode): Promise<ModeResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("setMode") + "?mode=" + mode;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async toggleMode(mode: HandyMode): Promise<ModeResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("toggleMode") + "?mode=" + mode;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async setSpeed(speed: number, absolute?: boolean): Promise<SetSpeedResponse> {
        this.enforceConnectionKey();
        const type = absolute ? "mm/s" : "%";
        const url = this.getUrl("setSpeed") + "?speed=" + speed + "&type=" + type;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async setStroke(speed: number, absolute?: boolean): Promise<SetStrokeResponse> {
        this.enforceConnectionKey();
        const type = absolute ? "mm" : "%";
        const url = this.getUrl("setStroke") + "?stroke=" + speed + "&type=" + type;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async stepSpeed(directionUp: boolean): Promise<SetSpeedResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("stepSpeed") + "?step=" + directionUp;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async stepStroke(directionUp: boolean): Promise<SetStrokeResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("stepStroke") + "?step=" + directionUp;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    //---------------------------------------------
    //                  GET DATA
    //---------------------------------------------
    async getVersion(): Promise<VersionResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("getVersion");
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async getSettings(): Promise<SettingsResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("getSettings");
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async getStatus(): Promise<StatusResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("getStatus");
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    //---------------------------------------------
    //             SERVER TIME SYNC
    //---------------------------------------------
    async getServerTimeOffset(trips = 30): Promise<number> {
        this.enforceConnectionKey();
        const url = this.getUrl("getServerTime");

        //don't count the first one
        await (await fetch(url)).json();

        let offsets = [];
        for (let i = 0; i < trips; i++) {
            const startTime = new Date().valueOf();

            const response = await fetch(url);
            const json = await response.json();
            const endTime = new Date().valueOf();
            const rtd = endTime - startTime;
            const estimatedServerTime = Number(json.serverTime) + rtd / 2;
            const offset = estimatedServerTime - endTime;
            offsets.push(offset);
        }

        //discard all readings more than one standard deviation from the mean, to reduce error
        const mean = offsets.reduce((acc, offset) => acc + offset, 0) / offsets.length;
        const errors = offsets.map(offset => Math.pow(offset - mean, 2));
        const sd = Math.sqrt(errors.reduce((acc, offset) => acc + offset, 0) / errors.length);
        offsets = offsets.filter(offset => Math.abs(offset - mean) < sd);

        //get average offset
        const offsetAggregate = offsets.reduce((acc, offset) => acc + offset) / offsets.length;
        this.serverTimeOffset = offsetAggregate;
        return this.serverTimeOffset;
    }

    //---------------------------------------------
    //                 VIDEO SYNC
    //---------------------------------------------
    async syncPrepare(
        scriptUrl: string,
        name?: string,
        size?: number
    ): Promise<SyncPrepareResponse> {
        this.enforceConnectionKey();
        let url = this.getUrl("syncPrepare") + "?url=" + scriptUrl + "&timeout=30000";
        if (name) url += "&name=" + name;
        if (size) url += "&size=" + size;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async syncPlay(play = true, time = 0): Promise<SyncPlayResponse> {
        this.enforceConnectionKey();
        const serverTime = new Date().valueOf() + this.serverTimeOffset;
        const url =
            this.getUrl("syncPlay") +
            "?play=" +
            play +
            "&serverTime=" +
            serverTime +
            "&time=" +
            time;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async syncOffset(offset: number): Promise<SyncOffsetResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("syncOffset") + "?offset=" + offset;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    //---------------------------------------------
    //                  UTILS
    //---------------------------------------------
    enforceConnectionKey() {
        if (!this.connectionKey) throw new Error("connection key not set");
    }

    getUrl(cmd: string) {
        return baseUrl + this.connectionKey + "/" + cmd;
    }

    /*
    public static void GetVersion(Action<HandyVersionData> onSuccess = null, Action<string> onError = null)
    public static void GetSettings(Action<HandySettingsData> onSuccess = null, Action<string> onError = null)
    public static void GetStatus(Action<HandyStatusData> onSuccess = null, Action<string> onError = null)
    public static async void GetServerTime(int trips = 30, Action<long> onSuccess = null, Action<string> onError = null)
    public static void SetMode(HandyMode mode, Action<HandyMode> onSuccess = null, Action<string> onError = null)
    public static void ToggleMode(HandyMode mode, Action<HandyMode> onSuccess = null, Action<string> onError = null)
    public static void SetSpeed(float speed, HandySpatialMode mode = HandySpatialMode.Percent, Action<HandySettingsData> onSuccess = null, Action<string> onError = null)
    public static void StepSpeedUp(Action<HandySpatialData> onSuccess = null, Action<string> onError = null)
    public static void StepSpeedDown(Action<HandySpatialData> onSuccess = null, Action<string> onError = null)
    public static void SetStroke(float stroke, HandySpatialMode mode = HandySpatialMode.Percent, Action<HandySettingsData> onSuccess = null, Action<string> onError = null)
    public static void StepStrokeUp(Action<HandySpatialData> onSuccess = null, Action<string> onError = null)
    public static void StepStrokeDown(Action<HandySpatialData> onSuccess = null, Action<string> onError = null)
    public static void SetPosition(float position, HandySpatialMode mode = HandySpatialMode.Percent, 
    public static void ReSync(Action onSuccess = null, Action<string> onError = null)
    public static void SyncPrepare(string url, string fileName = "", int fileSize = -1, Action onSuccess = null, Action<string> onError = null)
    public static void SyncPlay(int time = 0, Action<HandyPlayingData> onSuccess = null, Action<string> onError = null)
    public static void SyncPause(Action<HandyPlayingData> onSuccess = null, Action<string> onError = null)
    public static void SyncOffset(int offset, Action<HandyPlayingData> onSuccess = null, Action<string> onError = null)
    public static void SyncAdjustTimestamp(Action<long> onSuccess = null, Action<string> onError = null)
    public static async void PatternToUrl(Vector2Int[] patternData, Action<string> onSuccess = null, Action<string> onError = null)
    public static async void FunscriptToUrl(string funscript, string fileName = "", Action<string> onSuccess = null, Action<string> onError = null)
    public static async void CsvToUrl(string csv, string fileName = "", Action<string> onSuccess = null, Action<string> onError = null)
    private static void EnforceMode(HandyMode mode, Action command, Action<string> onError)
    private static void TryLogVerbose(string commandDescription)
    private static void TryLogError(string commandDescription, string error, Action<string> onError)
    private static void TryLogResponse(string commandString, JSONNode responseJson)
    private static bool CheckConnectionKey(string commandDescription, Action<string> onError)
    private static bool ReportErrors(string commandDescription, JSONNode responseJson, Action<string> onError)
    private static async Task<string> GetAsync(string uri)
    private static async Task<string> PostAsync(string uri, string fileName, Stream file)
    */
}

export default Handy;
