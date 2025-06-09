import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

process.env.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL || '';