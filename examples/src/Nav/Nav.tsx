import { NavLink } from 'react-router-dom';

import './Nav.css';

function getClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link-active' : 'nav-link';
}

export function Nav() {
  return (
    <nav>
      <ul className="nav-menu">
        <li>
          <NavLink to="/" className={getClassName}>Basic examples</NavLink>
        </li>
        <li>
          <NavLink to="/heavy" className={getClassName}>Heavy content</NavLink>
        </li>
        <li>
          <NavLink to="/customization" className={getClassName}>Customization</NavLink>
        </li>
        <li>
          <NavLink to="/body-scrollbars" className={getClassName}>Body scrollbars</NavLink>
        </li>
        <li>
          <NavLink to="/table" className={getClassName}>Table with scrollbars</NavLink>
        </li>
        <li>
          <NavLink to="/sticky" className={getClassName}>Table with sticky elements</NavLink>
        </li>
      </ul>
    </nav>
  );
}
