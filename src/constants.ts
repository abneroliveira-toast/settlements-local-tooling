import { spinners } from 'ora';

export const SCRIPTS_FOLDERS = ['./sql-scripts', 'nodejs-scripts'];
export const DEFAULT_SPINNER = spinners.dots8Bit;
export const SQL_EXTENSION_REGEXP = new RegExp('\\.sql', 'gi');
