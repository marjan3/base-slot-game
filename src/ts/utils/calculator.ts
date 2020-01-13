export const Calculator = {
    calculatePositionInReel(index: number, height: number, spacing: number, offset: number) {
        const positionY = index * (height + spacing);
        const offsetY = offset * (height + spacing);
        return positionY + offsetY;
    }
};

export const delay = function (value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, value)
    });
};