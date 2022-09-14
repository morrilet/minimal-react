# minimal-react
A minimal React toolchain using Webpack and Babel.

# Usage
1. Install in a project with `npm install /path/to/react-toolchain`
2. Create a react app using `npx react-toolchain my-app-name`
3. (Optional) Move generated files into the working directory with `mv my-app-name/* .`

# Notes
This is a little broken right now, and for my use case that was just fine. It might mess up the installed package.json, and the workflow
of moving generated files out of the app directory and into a working directory is a little weird.


Built with a heavy dose of help from [this post](https://dev.to/nikhilkumaran/don-t-use-create-react-app-how-you-can-set-up-your-own-reactjs-boilerplate-43l0).
