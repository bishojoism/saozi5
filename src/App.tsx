import { AppBar, Button, ButtonGroup, Container, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { decryptImage, encryptImage } from "./saozi5";
import { MuiFileInput } from "mui-file-input";
import { GitHub } from "@mui/icons-material";
import { saveAs } from "file-saver";

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
            图片臊子 5.2
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
            v5.2：修复保存逻辑。
          </Typography>
          <Typography>
            v5.1：兼容老旧设备，优化应用界面。
          </Typography>
          <TextField fullWidth label="密码" value={seed} onChange={event => setSeed(event.target.value)} />
          <MuiFileInput fullWidth inputProps={{ accept: 'image/*' }} label="选择" value={value} onChange={newValue => setValue(newValue)} />
          <ButtonGroup>
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
              重来
            </Button>
            <Button onClick={() => {
              const { current } = ref
              if (current) {
                saveAs(current.src, "输出.png")
              }
            }}>
              保存
            </Button>
          </ButtonGroup>
          <img ref={ref} alt="输出"/>
        </Stack>
      </Container>
    </>
  )
}
