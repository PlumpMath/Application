// {{{ Version

/**
 * Version is a class to store version numbers
 *
 * @param   major   major number
 * @param   minor   minor number
 * @param   patch   patch number
 */
var Version = function (major, minor, patch) {
  // @hint Number
  // @hint Number
  // @hint Number

  this.major = major;
  this.minor = minor;
  this.patch = patch;
};

/**
 * Version extends Comparable
 *
 * @see   Comparable
 */
extend(Comparable, Version);

// {{{ compare

/**
 * Overrides abstract method compare, from Comparable
 *
 * @see   Comparable#compare
 */
Version.prototype.compare = function (version) {
  var a = [this.major, this.minor, this.patch],
      b = [version.major, version.minor, version.patch];

  // compare major first, then minor, then patch
  for (i = 0; i < 3; i++) {
    // this version is larger than the other
    if (a[i] > b[i]) return 1;
    // this version is smaller than the other
    if (a[i] < b[i]) return -1;
  }

  // the versions are equal
  return 0;
}

// }}}
// {{{ toString

/**
 * Builds string from Version
 *
 * @return          [major].[minor].[patch]
 */
Version.prototype.toString = function () {
  return this.major + "." + this.minor + "." + this.patch;
};

// }}}
// {{{ fromString

/**
 * Builds Version from string
 *
 * @param   str     String in format, [major].[minor].[patch]
 * @return          <code>true</code> if successful, otherwise false
 */
Version.prototype.fromString = function (str) {
  str = str.split(".");

  // if str is not in the correct format, false
  if (str.length < 3) return false;

  this.major = +str[0];
  this.minor = +str[1];
  this.patch = +str[2];

  return true;
};

// }}}
// }}}
