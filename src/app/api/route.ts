async function proxy(req: Request) {
    try {
        const { url, method, headers, body } = req
        headers.delete('host')
        return fetch(new URL(url).searchParams.get('url')!, {
            method,
            headers,
            body,
            // @ts-expect-error 只有在node.js环境下才有这个参数
            duplex: 'half'
        })
    } catch (e) {
        return new Response(String(e))
    }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
export const HEAD = proxy