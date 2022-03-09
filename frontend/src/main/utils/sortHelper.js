
export function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      // Stryker disable next-line all : mutants generate false or result in 0 or undefined
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        // Stryker disable next-line ArithmeticOperator : / -1 is == to * -1
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }
  