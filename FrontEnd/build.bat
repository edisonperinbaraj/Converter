set /p pathName=Enter Server Credentials(User@server):%=%
echo Initializing Grunt...
set tempval=%0
set tempval=%tempval:build.bat=%
set drive=%tempval:~0,2%
%drive%
cd %tempval%
cmd /C npm install -g grunt-cli
cmd /C npm install grunt --save-dev
cmd /C npm install grunt-contrib-concat --save-dev
cmd /C npm install grunt-contrib-cssmin --save-dev
cmd /C npm install grunt-contrib-jshint --save-dev
cmd /C npm install grunt-contrib-uglify --save-dev
cmd /C npm install grunt-ng-annotate --save-dev
cmd /C npm install grunt-contrib-copy --save-dev
cmd /C npm install grunt-contrib-clean --save-dev
cmd /C npm install grunt-rev --save-dev
cmd /C npm install grunt-usemin --save-dev
cmd /C grunt
copy js\system.js dist\js\
copy js\config.js dist\js\
cd dist
jar -cvf dc.war *
pause
psftp %pathName% -be -b psftp-AD.scr
pause
