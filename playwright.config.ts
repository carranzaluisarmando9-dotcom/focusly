import { defineConfig } from '@playwright/test'
export default defineConfig({
 testDir:'./e2e',fullyParallel:false,workers:1,timeout:45000,
 use:{baseURL:'http://127.0.0.1:5173',headless:true,launchOptions:{executablePath:process.env.BRAVE_EXECUTABLE??(process.platform==='win32'?'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe':'/usr/bin/brave-browser')},trace:'retain-on-failure'},
 webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI},
})
