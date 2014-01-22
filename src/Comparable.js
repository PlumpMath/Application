// {{{ Comparable

/**
 * Comparable is the abstract base class for comparability.
 * A class should extend Comparable if it needs to be compared to others
 * of its same class.
 */
var Comparable = function () {};

// {{{ compare

/**
 * Compares <code>this</code> and <code>other</code>.
 * If <code>this > other</code>, the method will return 1;
 * if <code>this < other</code>, the method will return -1;
 * if <code>this === other</code>, the method will return 0.
 *
 * @param   other   the object to compare with
 * @return          1 if >, -1 if < and 0 if ===
 */
Comparable.prototype.compare = function (other) {};


// }}}
// {{{ isGreaterThan

/**
 * Check if <code>this > other</code>.
 * The method will return <code>true</code> if <code>this > other</code>
 * and <code>false</code> otherwise.
 *
 * @param   other   the object to compare with
 * @return          true if >, otherwise false
 */
Comparable.prototype.isGreaterThan = function (other) {
  return this.compare(other) > 0;
};

// }}}
// {{{ isLessThan

/**
 * Check if <code>this < other</code>.
 * The method will return <code>true</code> if <code>this < other</code>
 * and <code>false</code> otherwise.
 *
 * @param   other   the object to compare with
 * @return          true if <, otherwise false
 */
Comparable.prototype.isLessThan = function (other) {
  return this.compare(other) < 0;
};

// }}}
// {{{ isEqualTo

/**
 * Check if <code>this === other</code>.
 * The method will return <code>true</code> if <code>this === other</code>
 * and <code>false</code> otherwise.
 *
 * @param   other   the object to compare with
 * @return          true if ===, otherwise false
 */
Comparable.prototype.isEqualTo = function (other) {
  return this.compare(other) === 0;
};

// }}}
// }}}
