# capstone-project-3900-f10a-geegle

## How to set up and run the system 

### Prerequisites 

We have chosen to run our system using the  
Lubuntu 20.4.1 virtual machine (https://rebrand.ly/o1fy80n)  
on Virtual Box 6.1.38 (https://www.virtualbox.org/wiki/Download_Old_Builds_6_1) 

The browser to be used for running the frontend is Google Chrome  
(https://www.google.com/intl/en_au/chrome/)  

Open the terminal (QTerminal) and ensure that Git (https://git-scm.com/downloads) is downloaded then clone the repository. 

### Set Up: PostgreSQL Database 

In the QTerminal, enter the following commands to install and configure the Postgresql database 

`sudo apt update `

- To update all the packages 
- If requested to enter password for user Lubuntu, enter: ‘lubuntu’ 

`sudo apt-get install postgresql `

- Type ‘y’ and press enter when asked for additional packages to be installed 

`psql --version `

- Verify that postgresql has successfully been installed 

`sudo service postgresql start` 

- Starts the database server 

`cd capstone-project-3900-f10a-geegle/backend/db/ `

- Change directory into the ‘db’ folder in the ‘backend’ folder of the repository where a file ‘init_db.sql’ should exist 

`sudo -u postgres psql `

- Load into the postgresql shell as the admin user ‘postgres’ 

`ALTER USER postgres WITH PASSWORD ‘postgres’; `

- In the shell, type the above command to set the password for the admin user ‘postgres’ which our backend will later connect to 

`\i init_db.sql `

- SQL file to initialise database tables for the system 

`\q `

- Exit from the postgresql shell and close the terminal 

 

### Set Up: node 

Node will be installed using nvm (Node Version Manager). Enter the following commands in a new QTerminal  

`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash `

- If wget does not exist: `sudo apt-get install wget `

Close and reopen the terminal for nvm to be installed 

`nvm install 16.17.1 `

- Installing the same version of node used in the project 

`node -v  `

- Check the current version node is using is node v16.17.1 

- Otherwise enter command: `nvm use 16.17.1` 

 

### Install: node dependencies 

*QTerminal 1*

`cd capstone-project-3900-f10a-geegle/backend/ `

`cp .env.example .env `

- The ‘.env’ file stores private keys and database login information. For ease of demonstration, we provide this file but it would not be stored on the repository in practice/real world deployment 

`npm install `

*QTerminal 2 (open a new qterminal)*

`cd capstone-project-3900-f10a-geegle/frontend/ `

`npm install `

### Run project 

Having two terminals open from above with one in the backend folder and the other in the frontend folder 

*QTerminal 1 (backend)*

`npm start `

*QTerminal 2 (frontend)*

`npm start `
