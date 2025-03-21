import { create } from "random-seed"

export default function shuffle(count: number, seed: string) {
    const array = new Array<number>(count)
    if (count === 0) return array
    for (let i = 0; i < count; i++) array[i] = i
    const rand = create(seed)
    for (let i = count - 1; i; i--) {
        const r = rand(i)
        const t = array[i]
        array[i] = array[r]
        array[r] = t
    }
    return array
}