"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const config = require("config");
const ECSZ = require("aws-ecs-z");

const commander = new ECSZ.EasyCommander(config);
commander.exec(process.argv);
