export const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const removeIdFromObject = (item: Partial<{ id: string; }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...itemObj } = item;
    return { ...itemObj };
};