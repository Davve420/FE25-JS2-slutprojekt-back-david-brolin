To Start and get going with the backend part of the Scrumboard project

First you will need to clone the repository... I will assume you already know how to do that otherwise visit: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository 

You will also need to have node.js downloaded on your computer. This is for serving the backend. 
https://nodejs.org/en/download

The second step is to install the project dependencies with npm.
Open the terminal, navigate to the root folder for the project and run the command "npm install".

This will download the folder "node_modules" and all the dependencies that the project needs.
*If you get errors, there might be something that didn't download correctly (ex. types), please check both the package.json and package-lock.json, in dependencies and devdependencies. Make sure all of them are installed correctly*. If there are errors please check https://www.npmjs.com/package/installed-check or https://stackoverflow.com/questions/22915698/how-to-easily-verify-correct-npm-dependencies-installed 
*You may see npm warnings from nested package dependencies (for example around rimraf). Warnings are normal, but if npm shows a hard error and stops the install, then run "npm install" again and verify all dependencies are present.*

Now your project is ready. All you need to do is to run the dev command. "npm run dev". you can change the name of this command to whatever you want, notice that you shouldn't change the contents. 

*Tip:* Check the "package.json" file, the command will be located in scripts, look for "dev".

Now the server is started and you can begin to host the frontend part: https://github.com/Davve420/FE25-JS2-slutprojekt-front-david-brolin

*Check that the server is running on http://localhost:3000*







