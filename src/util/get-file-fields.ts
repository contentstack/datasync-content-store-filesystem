export const getFileFieldPaths = (schema, fileFields = [], parent = '') => {
  for (const field of schema.schema) {
    if (field.data_type === 'file') {
      fileFields.push(`${parent ? `${parent}.` : ''}${field.uid}`);
    }
    if (field.schema?.length) {
      getFileFieldPaths(field, fileFields, `${parent ? `${parent}.` : ''}${field.uid}`);
    } else if (field.blocks?.length) {
      for (const block of field.blocks)  {
        getFileFieldPaths(block, fileFields, `${parent ? `${parent}.` : ''}${field.uid}`);
      }
    }
  }

  return fileFields;
};