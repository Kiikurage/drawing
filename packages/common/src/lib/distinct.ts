export function distinct<T>(): (previousValue: T[], currentValue: T) => T[] {
    const uniqueValueSet = new Set<T>();

    return (previousValue: T[], currentValue: T) => {
        if (uniqueValueSet.has(currentValue)) {
            return previousValue;
        } else {
            previousValue.push(currentValue);
            uniqueValueSet.add(currentValue);
            return previousValue;
        }
    };
}
