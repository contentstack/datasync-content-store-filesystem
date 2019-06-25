import { isEmpty, isPlainObject } from 'lodash';

const requiredPublishKeys = [ 'locale', 'uid', '_content_type_uid'];
const requiredUnublishKeys = [ 'locale', 'uid', '_content_type_uid'];
const requiredEntryAssetDeleteKeys = [ 'locale', 'uid', '_content_type_uid'];
const requiredContentTypeDeleteKeys = ['uid', '_content_type_uid'];

export const validatePublishedObject = (publishedObject) => {
  requiredPublishKeys.forEach((key) => {
    if (!(publishedObject.hasOwnProperty(key))) {
      throw new Error(`${key} is missing from ${JSON.stringify(publishedObject)}`);
    }
  });

  if ((isEmpty(publishedObject)) || !(isPlainObject(publishedObject))) {
    throw new Error(`Publish object.data should be of type plain object and not empty!`);
  }

  if (typeof publishedObject.locale !== 'string' || typeof publishedObject.uid !== 'string' ||
    typeof publishedObject._content_type_uid !== 'string') {
    throw new Error(`Publish object key types do not match expected types!`);
  }

  return;
};

export const validateUnpublishedObject = (unpublishedObject) => {
  requiredUnublishKeys.forEach((key) => {
    if (!(unpublishedObject.hasOwnProperty(key))) {
      throw new Error(`${key} is missing from ${JSON.stringify(unpublishedObject)}`);
    }
  });

  if (isEmpty(unpublishedObject) || !(isPlainObject(unpublishedObject))) {
    throw new Error(`Unpublish object.data should be of type plain object and not empty!`);
  }

  if (typeof unpublishedObject.locale !== 'string' || typeof unpublishedObject.uid !== 'string' ||
    typeof unpublishedObject._content_type_uid !== 'string') {
    throw new Error(`Unpublish object key types do not match expected types!`);
  }

  return;
};

export const validateEntryAssetDeletedObject = (deletedObject) => {
  requiredEntryAssetDeleteKeys.forEach((key) => {
    if (!(deletedObject.hasOwnProperty(key))) {
      throw new Error(`${key} is missing from ${JSON.stringify(deletedObject)}`);
    }
  });

  if (isEmpty(deletedObject) || !(isPlainObject(deletedObject))) {
    throw new Error(`Unpublish object.data should be of type plain object and not empty!`);
  }

  if (typeof deletedObject.locale !== 'string' || typeof deletedObject.uid !== 'string' ||
    typeof deletedObject._content_type_uid !== 'string') {
    throw new Error(`Unpublish object key types do not match expected types!`);
  }

  return;
};

export const validateContentTypeDeletedObject = (deletedObject) => {
  requiredContentTypeDeleteKeys.forEach((key) => {
    if (!(deletedObject.hasOwnProperty(key))) {
      throw new Error(`${key} is missing from ${JSON.stringify(deletedObject)}`);
    }
  });

  // if (!(isEmpty(deletedObject.data)) || !(isPlainObject(deletedObject.data))) {
  //   throw new Error(`Deleted object.data should be of type plain object and not empty!`);
  // }

  if (typeof deletedObject.uid !== 'string' || typeof deletedObject._content_type_uid !== 'string') {
    throw new Error(`Deleted object key types do not match expected types!`);
  }

  return;
};
