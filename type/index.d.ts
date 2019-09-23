
declare module "fileSystemContentStoreModule" {
	export declare class FilesystemStore {
    	private readonly assetStore;
    	private readonly config;
    	private readonly pattern;
    	private readonly unwanted;
    	private readonly localePath;
	    constructor(assetStore: any, config: any);
	    publish(input: any): Promise<unknown>;
	    unpublish(input: any): Promise<unknown>;
	    delete(input: any): Promise<unknown>;
	    updateContentType(data: any): Promise<any>;
	    private publishAsset;
	    private unpublishAsset;
	    private unpublishEntry;
	    private deleteAsset;
	    private deleteContentType;
	    private deleteAllEntries;
	    private deleteSchema;
	    private deleteEntry;
	    private publishEntry;
	}

	interface IConnector {
	    publish<T>(input: T): Promise<{
	        T: any;
	    }>;
	    unpublish<T>(input: T): Promise<{
	        T: any;
	    }>;
	    delete<T>(input: T): Promise<{
	        T: any;
	    }>;
	}

	interface IAssetConnector {
	    start(): IConnector;
	}

	interface IFilesystemConfig {
	    baseDir: string;
	    internal?: any;
	    patterns?: {
	        asset?: string;
	        contentType?: string;
	        entry?: string;
	    };
	    unwanted?: {
	        asset?: any;
	        contentType?: any;
	        entry?: any;
	    };
	    [propName: string]: any;
	}

	interface IConfig {
	    contentStore: IFilesystemConfig;
	    assetStore: any;
	}

	export declare const setAssetConnector: (instance: IAssetConnector) => void;
	export declare const setConfig: (config: IConfig) => void;
	export declare const getConfig: () => IConfig;
	export declare const getFilesystemClient: () => any;
	export declare const start: (connector: IAssetConnector, config?: IConfig) => Promise<unknown>;

}