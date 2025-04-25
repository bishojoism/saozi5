import { AppBar, Button, ButtonGroup, Container, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { decryptImage, encryptImage } from "./saozi5";
import { MuiFileInput } from "mui-file-input";
import { GitHub } from "@mui/icons-material";

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            图片臊子 5.1
          </Typography>
          <IconButton href="https://github.com/bishojoism/saozi5" color="inherit" size="large" edge="end">
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ paddingY: 3 }}>
        <Stack spacing={2}>
          <Typography>
            第五代图片混淆技术，牺牲少许视觉效果获得抗等比缩放能力（现在不用点保存原图了）。
          </Typography>
          <Typography>
            v5.1：兼容老旧设备。
          </Typography>
          <ButtonGroup>
            <MuiFileInput inputProps={{ accept: 'image/*' }} label="选择" value={value} onChange={newValue => setValue(newValue)} />
            <TextField label="密码" value={seed} onChange={event => setSeed(event.target.value)} />
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
