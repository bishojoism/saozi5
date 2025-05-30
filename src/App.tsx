import { Accordion, AccordionDetails, AccordionSummary, AppBar, Backdrop, Box, Button, ButtonGroup, Card, CardContent, CardHeader, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, Stack, Tab, Tabs, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { decryptImage, encryptImage } from "./saozi5";
import { MuiFileInput } from "mui-file-input";
import { ExpandMore, GitHub, Newspaper } from "@mui/icons-material";
import { saveAs } from "file-saver";
import { decode, encode, init } from "ns9_1";
import useLocalStorageBoolean from "./useLocalStorageBoolean";

function Old() {
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
      <Stack spacing={3}>
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
              v5.3：放弃兼容老旧设备，压缩处理后的图片，新增代号功能：将图片传至图床（推荐<Link href="https://catbox.moe">Catbox</Link>，链接在<code>https://</code>后加上<code>i0.wp.com/</code>即可代理图片令国内可访问），获取到的链接用<Link href="https://yinzhe9.netlify.app">喵喵隐者9</Link>加密，即可生成代号。
            </Typography>
            <Typography gutterBottom>
              v5.2：修复保存逻辑。
            </Typography>
            <Typography gutterBottom>
              v5.1：兼容老旧设备，优化应用界面。
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="密码" value={seed} onChange={event => setSeed(event.target.value)} />
              <MuiFileInput inputProps={{ accept: 'image/*' }} label="选择" value={value} onChange={setValue} />
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
                      const output = await fetch(`https://qkwen.netlify.app/api?url=https://catbox.moe/user/api.php`, {
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
              <img ref={ref} alt="预览" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}

function New() {
  const [url, setUrl] = useState<string>()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  return (
    <>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack spacing={3}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>
              第一次色图革命，能将图片转换成文本（现在不用传混淆图了）。
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              v5.6：制作新版界面。
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Card>
          <CardHeader title="使用代号" />
          <CardContent>
            <Stack spacing={2}>
              <TextField label="代号" value={code} onChange={event => setCode(event.target.value)} />
              <Button disabled={!code} onClick={() => {
                if (!code) return
                setUrl(decode(code).replace('https://i0.wp.com/', 'https://i1.wp.com/'))
              }}>使用</Button>
              <img alt="预览" src={url} />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="制作代号" />
          <CardContent>
            <Stack spacing={2}>
              <MuiFileInput inputProps={{ accept: 'image/*' }} label="选择" value={file} onChange={setFile} />
              <Button disabled={!file} onClick={async () => {
                if (!file) return
                setLoading(true)
                try {
                  const body = new FormData()
                  body.set('reqtype', 'fileupload')
                  body.set('fileToUpload', file)
                  const output = await fetch(`https://qkwen.netlify.app/api?url=https://catbox.moe/user/api.php`, {
                    method: 'POST',
                    body
                  })
                  if (!output.ok) throw await output.text()
                  setText(encode(`https://i0.wp.com/${(await output.text()).substring('https://'.length)}`))
                  setLoading(false)
                } catch (e) {
                  setLoading(false)
                  alert(e)
                }
              }}>制作</Button>
              <TextField label="代号" value={text} disabled={!text} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}

export default function App() {
  const [show, setShow] = useLocalStorageBoolean("周刊第一期", true)
  const handleClose = () => setShow(false)
  const [value, setValue] = useState('new')
  return (
    <>
      <Dialog fullWidth open={show} onClose={handleClose} maxWidth="md">
        <DialogTitle>
          报纸
        </DialogTitle>
        <DialogContent>
          <h1>袅吧月刊第一期（2025年5月）</h1>
          <blockquote>
            编者按：欢迎大家投稿《袅吧月刊》，可通过私信“图片臊子作者”投稿。
          </blockquote>
          <pre><code>
            编者：“美少女主义”
          </code></pre>
          <h2 id="封面">
            封面
          </h2>
          <blockquote>
            编者按：列宁说过：“报纸不仅是集体的宣传员和集体的鼓动员，而且是集体的组织者。”我认为，我们袅吧很有必要出一份报纸。
          </blockquote>
          <pre><code>
            作者：“美少女主义”
          </code></pre>
          <img alt="封面图" src="https://i1.wp.com/files.catbox.moe/fsqx2m.jpg" width="100%" />
          <h2 id="目录">
            目录
          </h2>
          <ol>
            <li><Link href="#封面">封面</Link></li>
            <li><Link href="#目录">目录</Link></li>
            <li><Link href="#第一次色图革命">第一次色图革命</Link></li>
            <li><Link href="#本月色图精选集">本月色图精选集</Link></li>
          </ol>
          <h2 id="第一次色图革命">
            第一次色图革命
          </h2>
          <blockquote>
            编者按：阿姆斯特朗说过：“我的一小步，人类的一大步。”我觉得，图片臊子5新出的“代号”功能意义非凡，乃不世之功，完全配得上“第一次色图革命”的称号。
          </blockquote>
          <pre><code>
            作者：“美少女主义”
          </code></pre>
          <p>
            2025年5月25日11点42分，“图片臊子作者”发帖：<Link href="https://tieba.baidu.com/p/9739011132">“混淆图也能被秒删是吧，看我马上开发一种能把图片直接加密成文本的技术。”</Link>
          </p>
          <p>
            当天20点09分，“图片臊子作者”发帖：<Link href="https://tieba.baidu.com/p/9739878308">“我做出来了，技术革新，网址不变。”</Link>
          </p>
          <p>
            从此，<Link href="https://saozi5.netlify.app">图片臊子5</Link>多了一个“代号”功能：将图片直接转化为文字。
          </p>
          <p>
            2025年5月31日09点00分，“图片臊子作者”回帖：<Link href="https://tieba.baidu.com/p/9752783642">“我修了一下，把i0强行转成i1了，现在应该兼容各个浏览器了，再试一下。”</Link>
          </p>
          <p>
            从此，“代号”功能彻底完工。
          </p>
          <h2 id="本月色图精选集">
            本月色图精选集
          </h2>
          <blockquote>
            编者按：苏格拉底说过：“未经审视的生活是不值得过的。”这份精选集收录了吧友们纯粹用新技术发的所有色图。
          </blockquote>
          <pre><code>
            作者：“美少女主义”
          </code></pre>
          <ol>
            <li>
              粮求各娃区姿卷、洪吊游喝睁券病慢。纸振匹烈习另芒：厨姑知一、
            </li>
            <li>
              粮求各娃区姿卷洪吊游、喝睁券？病慢纸振干姜侍机，翻疏元患刀
            </li>
            <li>
              粮求各娃区…姿：卷洪吊游？喝睁券病慢纸振扑机翻槽哑：戴哑观
            </li>
            <li>
              粮求各娃区姿卷洪吊游喝睁。券…病慢纸振剪萌测米武校觉
            </li>
            <li>
              粮求各娃区！姿卷洪。吊游喝睁券病慢纸！振任日呼德呼劈！妥艳
            </li>
            <li>
              粮求各娃区姿卷？洪吊游喝睁券病慢纸振加羡力凯烛季觉
            </li>
            <li>
              粮：求各娃区姿卷洪吊游喝睁券病慢纸振劫晓：捉帖臂序妥艳
            </li>
            <li>
              粮求各娃区姿卷洪吊游，喝睁券病慢~纸壤、沉番…低沉番塘？休挽艳
            </li>
            <li>
              粮求各娃区姿卷？洪吊游喝睁券病慢、纸振干伪眼唤者、剃：停加耍观
            </li>
            <li>
              粮求各娃区姿卷洪，吊游喝睁券病慢纸振俭号恋华腔：润剂渡壤。观
            </li>
            <li>
              粮求各娃区姿卷洪吊游喝睁券病。慢纸振吓？柔短币兼湿规
            </li>
            <li>
              粮求、各娃区姿卷洪吊游喝睁券病慢纸振厨德仰带写，斗画榆，一
            </li>
          </ol>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            关闭
          </Button>
        </DialogActions>
      </Dialog >
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            图片臊子 5.6
          </Typography>
          <IconButton onClick={() => setShow(true)} color="inherit">
            <Newspaper />
          </IconButton>
          <IconButton href="https://github.com/bishojoism/saozi5" color="inherit" size="large" edge="end">
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ paddingY: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
              <Tab value="new" label="新版" />
              <Tab value="old" label="旧版" />
            </Tabs>
          </Box>
          <Box hidden={value != 'new'}>
            <New />
          </Box>
          <Box hidden={value != 'old'}>
            <Old />
          </Box>
        </Stack>
      </Container>
    </>
  )
}
