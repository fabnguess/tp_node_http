#!/usr/bin/env node

import sade from 'sade';
import { listAndCheckDependencies } from '../index.js';

const prog = sade('tpnodehttp').version('1.0.0');

prog
  .command('run')
  .describe('Checks for dependency updates')
  .action(listAndCheckDependencies);
