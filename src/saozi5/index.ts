import copy from "./copy"
import { decrypt, encrypt, N2M } from "./saozi"

const N = 256, M = N2M(N)

export function encryptImage(img: HTMLImageElement, seed: string) {
    const image = document.createElement('img')
    image.onload = () => {
        const { width, height } = image
        const w = Math.ceil(width / N), h = Math.ceil(height / N)
        const canvas = document.createElement('canvas')
        canvas.width = w * N
        canvas.height = h * N
        const context = canvas.getContext('2d')
        if (!context) throw new Error('获取画布上下文失败')
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        const input = context.getImageData(0, 0, canvas.width, canvas.height)
        const result = encrypt(N, seed)
        const length = result.reduce((length, { size }) => length + size, 0)
        const xOutput = new ImageData(w * length, input.height)
        let xIndex = 0
        for (const { index, size } of result) {
            copy({ image: input, x: w * index, y: 0 }, { image: xOutput, x: w * xIndex, y: 0 }, w * size, input.height)
            xIndex += size
        }
        const yOutput = new ImageData(xOutput.width, h * length)
        let yIndex = 0
        for (const { index, size } of result) {
            copy({ image: xOutput, x: 0, y: h * index }, { image: yOutput, x: 0, y: h * yIndex }, xOutput.width, h * size)
            yIndex += size
        }
        const newCanvas = document.createElement('canvas')
        newCanvas.width = yOutput.width
        newCanvas.height = yOutput.height
        const newContext = newCanvas.getContext('2d')
        if (!newContext) throw new Error('获取新画布上下文失败')
        newContext.putImageData(yOutput, 0, 0)
        const reCanvas = document.createElement('canvas')
        reCanvas.width = Math.round(newCanvas.width / canvas.width * width)
        reCanvas.height = Math.round(newCanvas.height / canvas.height * height)
        const reContext = reCanvas.getContext('2d')
        if (!reContext) throw new Error('获取重画布上下文失败')
        reContext.drawImage(newCanvas, 0, 0, reCanvas.width, reCanvas.height)
        reCanvas.toBlob(blob => {
            if (!blob) throw new Error('转为类文件对象失败')
            URL.revokeObjectURL(img.src)
            img.src = URL.createObjectURL(blob)
        }, "image/webp", 0.95)
    }
    image.src = img.src
}

export function decryptImage(img: HTMLImageElement, seed: string) {
    const image = document.createElement('img')
    image.onload = () => {
        const { width, height } = image
        const w = Math.ceil(width / M), h = Math.ceil(height / M)
        const canvas = document.createElement('canvas')
        canvas.width = w * M
        canvas.height = h * M
        const context = canvas.getContext('2d')
        if (!context) throw new Error('获取画布上下文失败')
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        const input = context.getImageData(0, 0, canvas.width, canvas.height)
        const result = decrypt(M, seed)
        const length = result.length
        const xOutput = new ImageData(w * length, input.height)
        let xIndex = 0
        for (const { index } of result) {
            copy({ image: input, x: w * index, y: 0 }, { image: xOutput, x: w * xIndex, y: 0 }, w, input.height)
            xIndex++
        }
        const yOutput = new ImageData(xOutput.width, h * length)
        let yIndex = 0
        for (const { index } of result) {
            copy({ image: xOutput, x: 0, y: h * index }, { image: yOutput, x: 0, y: h * yIndex }, xOutput.width, h)
            yIndex++
        }
        const newCanvas = document.createElement('canvas')
        newCanvas.width = yOutput.width
        newCanvas.height = yOutput.height
        const newContext = newCanvas.getContext('2d')
        if (!newContext) throw new Error('获取新画布上下文失败')
        newContext.putImageData(yOutput, 0, 0)
        const reCanvas = document.createElement('canvas')
        reCanvas.width = Math.round(newCanvas.width / canvas.width * width)
        reCanvas.height = Math.round(newCanvas.height / canvas.height * height)
        const reContext = reCanvas.getContext('2d')
        if (!reContext) throw new Error('获取重画布上下文失败')
        reContext.drawImage(newCanvas, 0, 0, reCanvas.width, reCanvas.height)
        reCanvas.toBlob(blob => {
            if (!blob) throw new Error('转为类文件对象失败')
            URL.revokeObjectURL(img.src)
            img.src = URL.createObjectURL(blob)
        }, "image/webp", 0.95)
    }
    image.src = img.src
}