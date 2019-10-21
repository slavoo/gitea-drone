#!/usr/bin/env node
import { AppServer } from '../app';
import { PORT } from '../config'


new AppServer().start(PORT);
