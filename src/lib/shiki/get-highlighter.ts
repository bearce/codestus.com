import fs from "fs"
import path from "path"
import { Options } from "rehype-pretty-code"
import shiki from "shiki"
import { environmentMode } from "../env"

// Shiki loads languages and themes using "fs" instead of "import", so Next.js
// doesn't bundle them into production build. To work around, we manually copy
// them over to our source code (lib/shiki/*) and update the "paths".
//
// Note that they are only referenced on server side
// See: https://github.com/shikijs/shiki/issues/138
const getShikiPath = (): string => path.join(process.cwd(), "src/lib/shiki")
const getShikiPublicPath = (paths: string = ""): string => path.join(process.cwd(), paths)

const touched = { current: false }

// "Touch" the shiki assets so that Vercel will include them in the production
// bundle. This is required because shiki itself dynamically access these files,
// so Vercel doesn't know about them by default
const touchShikiPath = (): void => {
  if (touched.current) {
    return
  }
  fs.readdirSync(getShikiPath())
  touched.current = true
}

const getHighlighter: Options["getHighlighter"] = async (options) => {
  // touchShikiPath()

  fs.readdirSync(process.cwd()).forEach((file) => {
    console.log("Level 1:", file)
  })

  fs.readdirSync(path.join(process.cwd(), "/.next")).forEach((file) => {
    console.log("Level 2 (.next):", file)
  })
  
  fs.readdirSync(path.join(process.cwd(), "/.next/server")).forEach((file) => {
    console.log("Level 3 (server):", file)
  })
  
  fs.readdirSync(path.join(process.cwd(), "/.next/server/pages")).forEach((file) => {
    console.log("Level 4 (pages):", file)
  })
  
  fs.readdirSync(path.join(process.cwd(), "../")).forEach((file) => {
    console.log("Level 0 (pages):", file)
  })
  
  fs.readdirSync(path.join(process.cwd(), "../../")).forEach((file) => {
    console.log("Level -1 (pages):", file)
  })

  return shiki.getHighlighter({
    ...(options as any),
    paths: {
      languages: environmentMode.production()
        ? `${getShikiPublicPath("/.next/server/pages")}/languages/`
        : `${getShikiPublicPath()}/public/languages/`,
      themes: environmentMode.production()
        ? `${getShikiPublicPath("/.next/server/pages")}/themes/`
        : `${getShikiPublicPath()}/public/themes/`,
    },
  })
}

export default getHighlighter
