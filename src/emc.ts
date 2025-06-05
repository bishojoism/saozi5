import { decode, encode } from "ns9_1"

async function join(files: File[]): Promise<Uint8Array> {
    const buffers: Uint8Array[] = []

    for (const file of files) {
        const nameBytes = new TextEncoder().encode(file.name)
        const nameLength = new Uint8Array([nameBytes.length])

        const content = new Uint8Array(await file.arrayBuffer())
        const contentLength = new Uint8Array(new Uint32Array([content.length]).buffer)

        buffers.push(nameLength, nameBytes, contentLength, content)
    }

    const totalSize = buffers.reduce((sum, buf) => sum + buf.length, 0)
    const result = new Uint8Array(totalSize)

    let offset = 0
    for (const buf of buffers) {
        result.set(buf, offset)
        offset += buf.length
    }

    return result
}

async function split(data: Uint8Array): Promise<File[]> {
    const files: File[] = []
    let offset = 0

    while (offset < data.length) {
        if (offset + 1 > data.length) throw new Error("Invalid data format: missing name length")
        const nameLength = data[offset++]

        if (offset + nameLength > data.length) throw new Error("Invalid data format: incomplete file name")
        const nameBytes = data.slice(offset, offset + nameLength)
        offset += nameLength
        const name = new TextDecoder().decode(nameBytes)

        if (offset + 4 > data.length) throw new Error("Invalid data format: missing file size")
        const contentLength = new DataView(data.buffer, data.byteOffset + offset, 4).getUint32(0, true)
        offset += 4

        if (offset + contentLength > data.length) throw new Error("Invalid data format: incomplete file content")
        const content = data.slice(offset, offset + contentLength)
        offset += contentLength

        files.push(new File([content], name))
    }

    return files
}

const jpg = new Uint8Array(await (await fetch('https://tgi12.jia.com/114/936/14936926.jpg')).arrayBuffer())

function encrypt(data: Uint8Array, limit: number) {
    let images: Uint8Array[] = []
    for (let i = 0; i < data.length; i += limit) {
        const size = Math.min(limit, data.length - i)
        const image = new Uint8Array(jpg.length + size)
        image.set(jpg)
        image.set(data.slice(i, i + size), jpg.length)
        images.push(image)
    }
    return images
}

function decrypt(images: Uint8Array[]) {
    const data = new Uint8Array(images.reduce((acc, image) => acc + image.byteLength - jpg.length, 0))
    let offset = 0
    for (const image of images) {
        data.set(image.slice(jpg.length), offset)
        offset += image.byteLength - jpg.length
    }
    return data
}

async function enc(images: Uint8Array[]) {
    const urls: string[] = []
    for (const image of images) {
        let err
        for (let i = 0; i < 5; i++) {
            try {
                const body = new FormData()
                body.set('file', new Blob([image]), '花.jpg')
                const res = await fetch('https://api.xinyew.cn/api/360tc', { method: 'POST', body })
                if (res.status !== 200) throw new Error(res.statusText)
                const { error, data } = await res.json() as {
                    error: string
                    data: null | {
                        url: string
                    }
                }
                if (!data) throw error
                const { url } = data
                urls.push(url.substring(25, url.length - 4))
                err = undefined
                break
            } catch (e: any) {
                if (e) err = e
            }
        }
        if (err) throw err
    }
    return urls
}

async function dec(urls: string[]) {
    const images: Uint8Array[] = []
    for (const url of urls) {
        let err
        for (let i = 0; i < 5; i++) {
            try {
                const res = await fetch(`https://ps.ssl.qhimg.com/${url}.jpg`)
                if (res.status !== 200) throw new Error(res.statusText)
                images.push(new Uint8Array(await res.arrayBuffer()))
                err = undefined
                break
            } catch (e: any) {
                if (e) err = e
            }
        }
        if (err) throw err
    }
    return images
}

export async function en(files: File[]) {
    return encode((await enc(encrypt(await join(files), 1048576))).join('\n'))
}

export async function de(code: string) {
    return split(decrypt(await dec((await decode(code)).split('\n'))))
}