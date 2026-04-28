import React from 'react'
import CIcon from '@coreui/icons-react'
import { 
  cilBuilding, 
  cilBell, 
  cilSpeedometer, 
  cilFolderOpen,
  cilPeople
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// ==========================================
// 1. CLIENT NAVIGATION MENU
// ==========================================
export const navClient = [
    {
    component: CNavTitle,
    name: 'Mes Démarches',
  },
  {
    component: CNavItem,
    name: 'Mes Espaces (Workspaces)',
    to: '/client/workspaces',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Historique des demandes',
    to: '/client/historique',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },

];

// ==========================================
// 2. EMPLOYEE & ADMIN NAVIGATION MENU
// ==========================================
export const navEmployee = [
  
  {
    component: CNavItem,
    name: 'Tableau de bord',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Gestion Administrative',
  },
  {
    component: CNavItem,
    name: 'Boîte de réception',
    to: '/employee/inbox',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },

];
export const navAdmin = [
  ... navClient,
  ...navEmployee,
    {
    component: CNavItem,
    name: 'Annuaire des entreprises',
    to: '/employee/organisations',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    adminOnly: true,
  },
  {
    component: CNavItem,
    name: 'Gestion des utilisateurs',
    to: '/admin/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    adminOnly: true,
  }
];