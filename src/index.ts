import { ReverseProxy } from './ReverseProxy'

const p   : ReverseProxy = new ReverseProxy()
// Examle:
// p.spyFunction = (strBody: string): string =>  strBody.replace(/\<(\/?)p\>/,"<$1h1>")
