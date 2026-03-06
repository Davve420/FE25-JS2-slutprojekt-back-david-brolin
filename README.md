To Start and get going with the backend part of the Scrumboard project

First you will need to clone the repository... I will assume you already know how to do that otherwise visit: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository 

You will also need to have node.js downloaded on your computer. This is for serving the backend. 
The second step is initializing the project. We will do this with npm. 
Open the terminal, navigate to the root folder for the project and enter the command "npm init" (This step is optional and might not be needed since there already is a package.json file). 

Enter the command "npm install" this will download the folder "node_modules" and all the dependencies that the project needs.
*If you still get errors, there might be something that didn't download correctly (ex. types), please check both the package.json and package-lock.json, in dependencies and devdependencies. Make sure all of them are installed correctly*

Now your project is ready. All you need to do is to run the dev command. "npm run dev". you can change the name of this command to whatever you want, notice that you shouldn't change the contents. 
Now the server is started and you can begin to host the frontend part: https://github.com/Davve420/FE25-JS2-slutprojekt-front-david-brolin
*Tip:* Check the "package.json" file, the command will be located in scripts, look for "dev".




