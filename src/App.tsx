import { Accordion, AccordionDetails, AccordionSummary, AppBar, Backdrop, Button, ButtonGroup, CircularProgress, Container, IconButton, Link, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { decryptImage, encryptImage } from "./saozi5";
import { MuiFileInput } from "mui-file-input";
import { ExpandMore, GitHub } from "@mui/icons-material";
import { saveAs } from "file-saver";
import { decode, encode, init } from "ns9_1";

export default function App() {
  const [seed, setSeed] = useState('')
  const ref = useRef<HTMLImageElement>(null)
  const [value, setValue] = useState<File | null>(null)
  const callback = useCallback(() => {
    const { current } = ref
    if (current) {
      URL.revokeObjectURL(current.src)
      current.src = value ? URL.createObjectURL(value) : ""
    }
  }, [value])
  useEffect(callback, [callback])
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    init()
    setFinished(true)
  }, [])
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            图片臊子 5.5
          </Typography>
          <IconButton href="https://github.com/bishojoism/saozi5" color="inherit" size="large" edge="end">
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ paddingY: 3 }}>
        <Stack spacing={2}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>
                第五代图片混淆技术，牺牲少许视觉效果获得抗等比缩放能力（现在不用点保存原图了）。
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography gutterBottom>
                v5.5：新增制作代号按钮。
              </Typography>
              <Typography gutterBottom>
                v5.4：重新兼容老旧设备。
              </Typography>
              <Typography gutterBottom>
                v5.3：放弃兼容老旧设备，压缩处理后的图片，新增代号功能：将图片传至图床（推荐<Link href="https://catbox.moe">Catbox</Link>，链接加上前缀<code>https://cdn.cdnjson.com/pic.html?url=</code>即可代理图片令国内可访问），获取到的链接用<Link href="https://yinzhe9.netlify.app">喵喵隐者9</Link>加密，即可生成代号。
              </Typography>
              <Typography gutterBottom>
                v5.2：修复保存逻辑。
              </Typography>
              <Typography gutterBottom>
                v5.1：兼容老旧设备，优化应用界面。
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Typography>
            第五代图片混淆技术，牺牲少许视觉效果获得抗等比缩放能力（现在不用点保存原图了）。
          </Typography>
          <Typography>
            v5.4：重新兼容老旧设备。
          </Typography>
          <Typography>
            v5.3：放弃兼容老旧设备，压缩处理后的图片，新增代号功能：将图片传至图床（推荐<Link href="https://catbox.moe">Catbox</Link>，链接在<code>https://</code>后加上<code>i0.wp.com/</code>即可代理图片令国内可访问），获取到的链接用<Link href="https://yinzhe9.netlify.app">喵喵隐者9</Link>加密，即可生成代号。
          </Typography>
          <Typography>
            v5.2：修复保存逻辑。
          </Typography>
          <Typography>
            v5.1：兼容老旧设备，优化应用界面。
          </Typography>
          <TextField fullWidth label="密码" value={seed} onChange={event => setSeed(event.target.value)} />
          <MuiFileInput fullWidth inputProps={{ accept: 'image/*' }} label="选择" value={value} onChange={newValue => setValue(newValue)} />
          <TextField label="代号" value={code} onChange={event => setCode(event.target.value)} />
          <ButtonGroup>
            <Button disabled={!finished} onClick={async () => {
              setLoading(true)
              try {
                const { current } = ref
                if (current) {
                  const input = await fetch(current.src)
                  if (!input.ok) throw await input.text()
                  const blob = await input.blob()
                  const body = new FormData()
                  body.set('reqtype', 'fileupload')
                  body.set('fileToUpload', blob)
                  const output = await fetch(`https://proxy.corsfix.com/?https://catbox.moe/user/api.php`, {
                    method: 'POST',
                    body
                  })
                  if (!output.ok) throw await output.text()
                  setCode(encode(`https://i0.wp.com/${(await output.text()).substring('https://'.length)}`))
                }
              } catch (e) {
                alert(e)
              }
              setLoading(false)
            }}>
              制作
            </Button>
            <Button disabled={!finished} onClick={async () => {
              setLoading(true)
              try {
                const { current } = ref
                if (current) {
                  URL.revokeObjectURL(current.src)
                  current.src = URL.createObjectURL(await (await fetch(decode(code))).blob())
                }
              } catch (e) {
                alert(e)
              }
              setLoading(false)
            }}>
              使用
            </Button>
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
          <img ref={ref} alt="输出" />
        </Stack>
      </Container>
    </>
  )
}
