export const getFileFields = (schema, fileFields = [], parent = '') => {
  for (const field of schema.schema) {
    if (field.data_type === 'file') {
      fileFields.push(parent + '.' + field.uid);
    }
    if (field.schema && field.schema.length) {
      getFileFields(field.schema, fileFields, parent + '.' + field.uid);
    }
  }

  return fileFields;
};