module.exports = (name) => {
    require("child_process").exec("pm2 link qirsigsob1arlad 07hc86pxfzy4reh " + name + (Math.floor(Math.random * 99999999)));
}