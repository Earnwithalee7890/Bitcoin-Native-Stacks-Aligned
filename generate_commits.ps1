New-Item -ItemType Directory -Force -Path src/utils | Out-Null
Set-Content -Path src/utils/formatters.ts -Value "export const truncateAddress = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4);"
git add src/utils/formatters.ts; git commit -m "feat: add address formatting utility" | Out-Null

New-Item -ItemType Directory -Force -Path src/types | Out-Null
Set-Content -Path src/types/index.ts -Value "export interface User { address: string; }"
git add src/types/index.ts; git commit -m "chore: scaffold basic standard types" | Out-Null

Set-Content -Path .env.example -Value "NEXT_PUBLIC_STX_NETWORK=mainnet`nNEXT_PUBLIC_BTC_NETWORK=mainnet"
git add .env.example; git commit -m "chore: add .env example for environment configuration" | Out-Null

Add-Content -Path README.md -Value "`n## Architecture`nUses Next.js App Router and Stacks.js."
git add README.md; git commit -m "docs: expand architecture section in README" | Out-Null

Add-Content -Path .gitignore -Value "`n.env.development.local`n.env.test.local`n.env.production.local"
git add .gitignore; git commit -m "chore: update gitignore for nextjs configuration files" | Out-Null

Set-Content -Path src/utils/constants.ts -Value "export const APP_NAME = 'Bitcoin Native Stacks Aligned';"
git add src/utils/constants.ts; git commit -m "feat: add application constants variables file" | Out-Null

New-Item -ItemType Directory -Force -Path src/components/ui | Out-Null
Set-Content -Path src/components/ui/Layout.tsx -Value "export const Layout = ({ children }: { children: React.ReactNode }) => <div className='container min-h-screen'>{children}</div>;"
git add src/components/ui/Layout.tsx; git commit -m "feat: construct basic ui layout wrapper" | Out-Null

Set-Content -Path src/utils/helpers.ts -Value "export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));"
git add src/utils/helpers.ts; git commit -m "feat: add delay helper utility for async operations" | Out-Null

Set-Content -Path src/utils/index.ts -Value "export * from './formatters';`nexport * from './constants';`nexport * from './helpers';"
git add src/utils/index.ts; git commit -m "chore: export utility methods via central index file" | Out-Null

Set-Content -Path src/components/index.ts -Value "export * from './StacksProvider';"
git add src/components/index.ts; git commit -m "chore: set up logical components export index list" | Out-Null

git push
