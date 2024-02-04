import { fireEvent, getByLabelText } from '@testing-library/dom';
import {JSDOM} from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '../nav.js'), 'utf8');

let dom;
let container;
let links;

describe('index.html', () => {
  beforeAll(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = script;
    dom.window.document.body.appendChild(scriptEl);
    container = dom.window.document.body;
    links = container.querySelector('.links');
    Object.defineProperty(dom.window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    Object.defineProperty(dom.window, 'innerHeight', { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(new Event('resize'));
  });
  
  test('renders links', () => {
    expect(links).toBeInTheDocument();
    expect(dom.window.innerWidth).toBe(500);
  });

  test('toggle button opens and closes the list', async () => {
    const navToggle = getByLabelText(container, 'toggle');
    fireEvent.click(navToggle);
    expect(links).toHaveClass('show-links');

    fireEvent.click(navToggle);
    expect(links).not.toHaveClass('show-links');
  });
})