import fetch from "node-fetch";
import { PluginSettings } from "./setting";

interface PicGoResponse {
  success: string;
  msg: string;
  result: string[];
}

export class PicGoUploader {
  settings: PluginSettings;

  constructor(settings: PluginSettings) {
    this.settings = settings;
  }

  async uploadFiles(fileList: Array<String>): Promise<any> {
    const response = await fetch(this.settings.uploadServer, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ list: fileList }),
    });
    const data = await response.json();
    return data;
  }

  async uploadFileByClipboard(): Promise<any> {
    const res = await fetch(this.settings.uploadServer, {
      method: "POST",
    });
    let data: PicGoResponse = await res.json();

    if (!data.success) {
      let err = { response: data, body: data.msg };
      return {
        code: -1,
        msg: data.msg,
        data: "",
      };
    } else {
      return {
        code: 0,
        msg: "success",
        data: data.result[0],
      };
    }
  }
}
