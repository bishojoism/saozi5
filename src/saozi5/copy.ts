interface CopyData {
    image: ImageData
    x: number
    y: number
}

export default function copy(input: CopyData, output: CopyData, w: number, h: number) {
    for (let i = 0; i < h; i++) {
        const inputP = 4 * (input.x + (input.y + i) * input.image.width), outputP = 4 * (output.x + (output.y + i) * output.image.width)
        output.image.data.set(input.image.data.slice(inputP, inputP + 4 * w), outputP)
    }
}