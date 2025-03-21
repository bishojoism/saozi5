import { AppBar, Button, ButtonGroup, Container, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { decryptImage, encryptImage } from "./saozi5";
import { MuiFileInput } from "mui-file-input";

export default function App() {
  const [seed, setSeed] = useState('')
  const ref = useRef<HTMLImageElement>(null)
  const [value, setValue] = useState<File | null>(null)
  const callback = useCallback(() => {
    const { current } = ref
    if (value && current) {
      URL.revokeObjectURL(current.src)
      current.src = URL.createObjectURL(value)
    }
  }, [value])
  useEffect(callback, [callback])
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            图片臊子5
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{paddingY: 3}}>
        <Stack spacing={2}>
          <Typography>
            第五代图片混淆技术，抗等比缩放、抗格式转换、抗有损压缩，无噪点、无彩纹、无格线
          </Typography>
          <ButtonGroup>
            <MuiFileInput label="选择" value={value} onChange={newValue => setValue(newValue)}/>
            <TextField label="密码" value={seed} onChange={event => setSeed(event.target.value)}/>
            <Button onClick={() => {
              const { current } = ref
              if (current) {
                encryptImage(current, seed)
              }
            }}>
              加密
            </Button>
            <Button onClick={() => {
              const { current } = ref
              if (current) {
                decryptImage(current, seed)
              }
            }}>
              解密
            </Button>
            <Button onClick={callback}>
              还原
            </Button>
          </ButtonGroup>
          <img ref={ref} />
        </Stack>
      </Container>
    </>
  )
}
