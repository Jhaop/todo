import './style.css';

export default function Header (header) {
    const title = document.createElement('h1');
    title.classList.add('headerTitle');
    title.innerHTML = 'My tasks manager';

    header.appendChild(title);
}