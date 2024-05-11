# minimal-react
A minimal React toolchain using Webpack and Babel.

# Usage
1. Install in a project with `npm install /path/to/react-toolchain`
2. Create a react app using `npx create-minimal-react-app my-app-name`
3. (Optional) Move generated files into the working directory with `mv my-app-name/* .`

# Notes
This is still being updated with use - it may act strangely and require some debugging.
If you use it in a larger project that is tracked by Git, be sure to remove the included `.git` directory and `.gitignore` file so your pushes / pulls work correctly.

Built with a heavy dose of help from [this post](https://dev.to/nikhilkumaran/don-t-use-create-react-app-how-you-can-set-up-your-own-reactjs-boilerplate-43l0).
