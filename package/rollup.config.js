import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import license from 'rollup-plugin-license';

const packageJson = require('./package.json');

const banner = `
  @licence
  ${packageJson.name} - v${packageJson.version}
  ${packageJson.description}
  
  Author: ${packageJson.author}
  Released under the ${packageJson.license} license.
`;

export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss(),
    license({ banner }),
  ],
};
