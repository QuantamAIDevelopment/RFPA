/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.png?url' {
  const url: string
  export default url
}

declare module '*.svg?url' {
  const url: string
  export default url
}