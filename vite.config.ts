import { defineConfig } from "vite"
import Dts from "vite-plugin-dts"
export default defineConfig({
	build: {
		lib: {
			entry: "src/core/index.ts",
			name: "FyhUtils",
			fileName: name => `index.${name}.js`,
		},
	},
	plugins: [Dts()],
})
