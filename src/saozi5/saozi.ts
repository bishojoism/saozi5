import shuffle from "./shuffle"

export function encrypt(length: number, seed: string): {index: number, size: number}[] {
    if (length === 0) return []
    if (length === 1) return [{index: 0, size: 1}]
    const result: {index: number, size: number}[] = []
    const count = length - 2
    const array = shuffle(count, seed)
    const map = new Array(count)
    for (let i = 0; i < count; i++) map[array[i]] = i
    result.push({index: 0, size: 2})
    for (let i = 0; i < count; i++) result.push({index: map[i], size: 3})
    result.push({index: length - 2, size: 2})
    return result
}

export function decrypt(length: number, seed: string): {index: number}[] {
    if (length === 0) return []
    if (length === 1) return [{index: 0}]
    const result: {index: number}[] = []
    const count = (length - 4) / 3
    const array = shuffle(count, seed)
    result.push({index: 0})
    for (let i = 0; i < count; i++) result.push({index: array[i] * 3 + 3})
    result.push({index: length - 1})
    return result
}

// const length = 114514
// const seed = 'test'
// const raw = shuffle(length, seed)
// const encrypted: number[] = []
// for (const {index, size} of encrypt(length, seed)) {
//     encrypted.push(...raw.slice(index, index + size))
// }
// const decrypted: number[] = []
// for (const {index} of decrypt(encrypted.length, seed)) {
//     decrypted.push(encrypted[index])
// }
// console.log(decrypted.length === raw.length && decrypted.every((value, index) => value === raw[index]))