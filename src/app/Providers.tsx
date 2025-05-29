'use client'

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { ReactNode } from "react"

const theme = createTheme({
    colorSchemes: {
        dark: true
    }
})

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}