import { CompilerConfig } from '@ton-community/blueprint';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/thrower.func'],
};
