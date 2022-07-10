import { App, PluginSettingTab, Setting } from "obsidian";
import imageAutoUploadPlugin from "./main";

export interface PluginSettings {
  uploadByClipSwitch: boolean;
  uploadServer: string;
  uploader: string;
  picgoCorePath: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  uploadByClipSwitch: true,
  uploader: "PicGo",
  uploadServer: "http://127.0.0.1:36677/upload",
  picgoCorePath: "",
};

export class SettingTab extends PluginSettingTab {
  plugin: imageAutoUploadPlugin;

  constructor(app: App, plugin: imageAutoUploadPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "plugin settings" });
    new Setting(containerEl)
      .setName("pasted auto upload Switch")
      .setDesc(
        "if you set this value true, when you paste image, it will be auto uploaded(you should set the picGo server rightly)"
      )
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.uploadByClipSwitch)
          .onChange(async value => {
            this.plugin.settings.uploadByClipSwitch = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Default uploader")
      .setDesc("Default uploader")
      .addDropdown(cb =>
        cb
          .addOption("PicGo", "PicGo(app)")
          .setValue(this.plugin.settings.uploader)
          .onChange(async value => {
            this.plugin.settings.uploader = value;
            this.display();
            await this.plugin.saveSettings();
          })
      );

    if (this.plugin.settings.uploader === "PicGo") {
      new Setting(containerEl)
        .setName("PicGo server")
        .setDesc("PicGo server")
        .addText(text =>
          text
            .setPlaceholder("Please input PicGo server")
            .setValue(this.plugin.settings.uploadServer)
            .onChange(async key => {
              this.plugin.settings.uploadServer = key;
              await this.plugin.saveSettings();
            })
        );
    }
  }
}
