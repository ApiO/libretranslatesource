import axios from 'axios';
import { ITranslate, ITranslateOptions } from 'comment-translate-manager';

const url = `http://127.0.0.1:5000/translate`;

// Supported languages: https://libretranslate.com/languages
const langMaps: Map<string, string> = new Map([
    ['zh-CN', 'zn'],
    ['zh-TW', 'zt'],
]);

function convertLang(src: string): string {
    if (langMaps.has(src)) {
        return langMaps.get(src) as string;
    }
    return src.slice(0, 2);
}

interface TranslateRequest {
    q: string | string[], //TODO: find limit
    source: string,
    target: string,
    format?: "text" | "html",
    alternatives?: number //TODO: find limit
  }

interface TranslateResponse {
    detectedLanguage: {
        confidence: number;
        language: string;
    },
    translatedText: string | string[];
}

export class LibreTranslate implements ITranslate {

   get maxLen() {
        return 3000;
   }

   async translate(content: string, { to = 'auto' }: ITranslateOptions){
        const data:TranslateRequest ={
            q: content.split('\n'),
            source: "auto",
            target: convertLang(to),
            format: "text"
        };

        let res = await axios.post<TranslateResponse>(url, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return Array.isArray(res.data.translatedText) 
            ? res.data.translatedText.join('\nsfsfsffsfs\n')
            : res.data.translatedText;
   }

   link(_: string, __: ITranslateOptions) {
        return `[LibreTranslate](${url})`;
   }
}