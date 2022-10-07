@echo off
:START
tailwindcss-windows-x64 -i ./src/main.css -o ./dist/main.css --watch
timeout 3
GOTO START ::in case of crash