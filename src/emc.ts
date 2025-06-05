import { decode, encode } from "ns9_1"

async function join(files: File[]) {
    const buffers = (await Promise.all(files.map(async file => {
        const name = new TextEncoder().encode(file.name)
        const nameLength = new Uint8Array([name.byteLength])
        const bytes = await file.bytes()
        const bytesLength = new Uint32Array(1)
        bytesLength[0] = bytes.byteLength
        return [nameLength, name, bytesLength, bytes]
    }))).flat()
    const total = new Uint8Array(buffers.reduce((acc, buffers) => acc + buffers.byteLength, 0))
    let offset = 0
    for (const buffer of buffers) {
        total.set(buffer, offset)
        offset += buffer.byteLength
    }
    return total
}

async function split(total: Uint8Array) {
    let offset = 0
    const files: File[] = []
    while (offset < total.length) {
        const nameLength = total[offset++]
        const name = new TextDecoder().decode(total.slice(offset, offset += nameLength))
        const bytesLength = new Uint32Array(total.slice(offset, offset += 4))[0]
        const bytes = total.slice(offset, offset += bytesLength)
        files.push(new File([bytes], name))
    }
    return files
}

const gif = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00]

function encrypt(data: Uint8Array, limit: number) {
    let images: Uint8Array[] = []
    for (let i = 0; i < data.length; i += limit) {
        const size = Math.min(limit, data.length - i)
        const image = new Uint8Array(gif.length + size)
        image.set(gif)
        image.set(data.slice(i, i + size), gif.length)
        images.push(image)
    }
    return images
}

function decrypt(images: Uint8Array[]) {
    const data = new Uint8Array(images.reduce((acc, image) => acc + image.byteLength - gif.length, 0))
    let offset = 0
    for (const image of images) {
        data.set(image.slice(gif.length), offset)
        offset += image.byteLength - gif.length
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
                body.set('file', new Blob([image]))
                const res = await fetch('https://api.xinyew.cn/api/360tc', { method: 'POSt', body })
                if (res.status !== 200) throw new Error(res.statusText)
                const { error, data } = await res.json() as {
                    error: string
                    data: null | {
                        url: string
                    }
                }
                if (!data) throw error
                const { url } = data
                urls.push(url)
                err = undefined
                break
            } catch (e: any) {
                err = e
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
                const res = await fetch(url)
                if (res.status !== 200) throw new Error(res.statusText)
                images.push(new Uint8Array(await res.arrayBuffer()))
                err = undefined
                break
            } catch (e: any) {
                err = e
            }
        }
        if (err) throw err
    }
    return images
}

export async function en(files: File[]) {
    return encode((await enc(encrypt(await join(files), 10485760))).join('\n'))
}

export async function de(code: string) {
    return split(decrypt(await dec((await decode(code)).split('\n'))))
}