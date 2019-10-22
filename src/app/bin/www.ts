#!/usr/bin/env node
import dotenv from 'dotenv';

dotenv.config();

import { AppServer } from '../app';
import { PORT } from '../config'

new AppServer().start(PORT);
