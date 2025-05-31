import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorageBoolean(key: string, defaultValue: boolean = false): [boolean, Dispatch<SetStateAction<boolean>>] {
    const [value, setValue] = useState(typeof localStorage === 'undefined' ? defaultValue : (() => { const x = localStorage.getItem(key); return x ? JSON.parse(x) : defaultValue })())
    useEffect(() => {
        if (typeof localStorage === 'undefined') return
        localStorage.setItem(key, String(value))
    }, [key, value])
    return [value, setValue]
}