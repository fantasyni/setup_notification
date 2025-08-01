import { defineConfig } from 'tsup'

export default defineConfig([{
  entry: ['./src/send.ts'],
  clean: true,
  dts: true,
  format: ['cjs'],
  outDir: 'dist',
  noExternal: [ /(.*)/ ]
}])