/// <reference types="vite/client" />
export interface ImportMetaEnv {
 readonly VITE_API_URL: string;
 readonly VITE_APP_TITLE: string;
 // add more variables here as needed
}

export interface ImportMeta {
 readonly env: ImportMetaEnv;
}
