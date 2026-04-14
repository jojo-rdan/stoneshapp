import { NavLink } from 'react-router-dom';
import { navigationItems } from '@/data/navigation';

export function SidebarNav() {
  return (
    <nav
      className="sidebar-nav"
      aria-label="Navegacion principal"
    >
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? 'sidebar-nav__item sidebar-nav__item--active' : 'sidebar-nav__item'
          }
          end={item.path === '/'}
        >
          <span className="sidebar-nav__label">{item.label}</span>
          <small>{item.description}</small>
        </NavLink>
      ))}
    </nav>
  );
}
