/*!
 * DataSync Content Store Filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */
declare class FileSystem {
    private assetConnector;
    private config;
    constructor(assetConnector: any, config: any);
    /**
     * @description to publish the retrieved data in filesystem
     * @param  {Object} data: data for publish
     */
    publish(data: any): Promise<{}>;
    /**
     * @description to unpublish the retrieved data from filesystem
     * @param  {Object} data: data for unpublish
     */
    unpublish(data: any): Promise<{}>;
    /**
     * @description to delete the data from filesystem
     * @param  {Object} query: data for delete
     */
    delete(query: any): Promise<{}>;
    find(data: any): Promise<{}>;
    findOne(data: any): Promise<{}>;
    private validate;
    /**
     * @description to delete content type the data from filesystem
     * @param  {Object} query: data for  delete content type
     */
    private deleteContentType;
}
export = FileSystem;
