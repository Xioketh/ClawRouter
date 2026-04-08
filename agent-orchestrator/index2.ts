// This forces Node to import absolutely everything the package has to offer
import * as OpenClawPackage from 'openclaw';

// This will print out exactly what the package exports
console.log("Here is everything inside openclaw:");
console.log(Object.keys(OpenClawPackage));