import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from '../assets/brand/logo-negative'
import { sygnet } from '../assets/brand/sygnet'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { navClient, navEmployee, navAdmin } from '../_nav'
import { useAuth } from '../context/AuthContext'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user, isAdmin, logout } = useAuth() 

  const isClient = user?.role === 'ROLE_CLIENT' 
  let navigation = undefined;
  switch (user?.role) {
    case 'ROLE_CLIENT':
      navigation = navClient
      break
    case 'ROLE_EMPLOYEE':
navigation = navEmployee
      break
    case 'ROLE_ADMIN':
      navigation = navAdmin
      break
    default:
      navigation = navClient;
  }
// 3. FILTER THE NAVIGATION AND CLEAN PROPS
  const filteredNav = navigation
    .filter((item) => {
      if (item.adminOnly) return isAdmin;
      return true;
    })
    .map((item) => {
      // Destructure to remove 'adminOnly' so React doesn't complain
      const { adminOnly, ...cleanItem } = item;
      
      // Do the exact same thing for nested sub-menus
      if (cleanItem.items) {
        cleanItem.items = cleanItem.items
          .filter((subItem) => subItem.adminOnly ? isAdmin : true)
          .map(({ adminOnly, ...cleanSubItem }) => cleanSubItem);
      }
      
      return cleanItem;
    });

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img src={logoNegative} height={35} alt="Logo" />
      </CSidebarBrand>
      <CSidebarNav items={navigation}>
        <SimpleBar>
          {/* 4. PASS THE FILTERED LIST TO THE NAV */}
          <AppSidebarNav items={filteredNav} />
        </SimpleBar>
<div className="nav-item mt-auto">
      <a className="nav-link text-danger" style={{ cursor: 'pointer' }} onClick={logout}>
         <CIcon icon={cilAccountLogout} className="nav-icon" /> Déconnexion
      </a>
    </div>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)