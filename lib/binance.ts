// lib/supabaseClient.js
import { UMFutures } from "@binance/futures-connector";
import CryptoJS from 'crypto-js';

const apiKey =process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;


interface Parameter {
    key: string;
    value: string | number;
    disabled: boolean;
  }
  
  function convertToParameters(obj: any, parentKey: string = ''): Parameter[] {
    const parameters: Parameter[] = [];
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (Array.isArray(value)) {
          value.forEach((val) => {
            parameters.push({ key: fullKey, value: val, disabled: false });
          });
        } else if (typeof value === 'object' && value !== null) {
          parameters.push(...convertToParameters(value, fullKey));
        } else {
          parameters.push({ key: fullKey, value, disabled: false });
        }
      }
    }
  
    return parameters;
  }


class RequestWrapper {
    private paramsObject: { [key: string]: any } = {};
    private binanceApiSecret: string;
    private binanceApiKey: string;
    private parameters: any[];
    private ts: number;
  
    constructor(parameters: any[], binanceApiSecret: string, binanceApiKey: string) {
      this.parameters = convertToParameters(parameters);
      this.binanceApiSecret = binanceApiSecret;
      this.binanceApiKey = binanceApiKey;
      this.ts = Date.now();
    }
  
    private is_empty(value: any): boolean {
      return value === null || value === undefined || value === '';
    }
  
    private is_disabled(disabled: boolean): boolean {
      return disabled === true;
    }
  
    private createParamsObject() {
      this.parameters.forEach((param) => {
        if (
          param.key !== 'signature' &&
          param.key !== 'timestamp' &&
          !this.is_empty(param.value) &&
          !this.is_disabled(param.disabled)
        ) {
          this.paramsObject[param.key] = param.value;
        }
      });
  
      Object.assign(this.paramsObject, { timestamp: this.ts });
    }
  
    private signRequest() {
      const queryString = Object.keys(this.paramsObject)
        .map((key) => `${encodeURIComponent(key)}=${this.paramsObject[key]}`)
        .join('&');
  
      const signature = CryptoJS.HmacSHA256(queryString, this.binanceApiSecret).toString();
      this.paramsObject['signature'] = signature;
    }
  
    public async sendRequest(url: string, method: string = 'GET') {
      this.createParamsObject();
      this.signRequest();
      console.log(url)

      const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-MBX-APIKEY", this.binanceApiKey);
  
      const queryString = Object.keys(this.paramsObject)
        .map((key) => `${encodeURIComponent(key)}=${this.paramsObject[key]}`)
        .join('&');
  
      const fullUrl = `${url}?${queryString}`;
  
      const response = await fetch(fullUrl, {
        method,
        headers: myHeaders
      });
  
      return response.json();
    }
  }

const get = (url:string, parameters:any) => {
    const wrapper = new RequestWrapper(parameters, apiSecret, apiKey);
    return wrapper.sendRequest(url);
}

const post = (url:string, parameters:any) => {
    const wrapper = new RequestWrapper(parameters, apiSecret, apiKey);
    return wrapper.sendRequest(url, 'POST');
}

export { get, post };

