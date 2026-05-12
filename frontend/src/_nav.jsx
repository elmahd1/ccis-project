import React from 'react'
import CIcon from '@coreui/icons-react'
import { 
    cilBuilding, 
    cilBell, 
    cilSpeedometer, 
    cilFolderOpen,
    cilPeople,
    cilChart,
    cilUser,
    cilSettings
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

// ==========================================
// 1. CLIENT NAVIGATION MENU
// ==========================================
export const navClient = [
    {
        component: CNavTitle,
        name: 'Mes Espaces',
    },
    {
        component: CNavItem,
        name: 'Mes Organisations',
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
// 2. EMPLOYEE NAVIGATION MENU
// ==========================================
export const navEmployee = [
    {
        component: CNavTitle,
        name: 'Gestion',
    },
    {
        component: CNavItem,
        name: 'Boîte de réception',
        to: '/employee/inbox',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Annuaire des clients',
        to: '/employee/organisations',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
];

// ==========================================
// 3. ADMIN NAVIGATION MENU
// ==========================================
export const navAdmin = [
    {
        component: CNavTitle,
        name: 'Administration',
    },
    {
        component: CNavItem,
        name: 'Tableau de bord',
        to: '/admin/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Gestion des utilisateurs',
        to: '/admin/users',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Rapports & Analyses',
        to: '/admin/reports',
        icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    },
];