// src/print/PrintContainer.ts
function printContainer<T>(c: T[]): string {
    let result = "";
    for (const element of c) {
        result += " " + element;
    }
    return result;
}

export default printContainer;