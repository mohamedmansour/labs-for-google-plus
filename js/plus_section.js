
/**
 * Different Google Plus Modules for different Labs Features. These are basically
 * different access sections.
 * 
 * @enum {Object<number, number>}
 */
PlusSection = {
  STREAM     : 1 << 0,
  PROFILE    : 1 << 1,
  HANGOUT    : 1 << 2,
};

/**
 * Converts the string representation of the enum to its value.
 *
 * @param {string} val The enum name as a text.
 * @return {Object<PositionEnum>} the enum value.
 */
PlusSection.valueOf = function(val)
{
  return LabsModule[val.toUpperCase()];
};