import React from 'react'

// ==========================================
// EMPLOYEE & ADMIN PAGES
// ==========================================
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// Verify this path! Change it if ListeAssociations is saved elsewhere.
const OrganizationDirectory = React.lazy(() => import('./views/employee/OrganizationDirectory')) 
const EmployeeInbox = React.lazy(() => import('./views/employee/EmployeeInbox'))

// ==========================================
// CLIENT PAGES
// ==========================================
const ClientWorkspaces = React.lazy(() => import('./views/client/Workspaces'))
const ClientDashboard = React.lazy(() => import('./views/client/OrganizationDashboard'))
const HistoriqueDemandes = React.lazy(() => import('./views/client/HistoriqueDemandes'))
// FORMS
const FormDemandeSalle = React.lazy(() => import('./views/demande-salle/DemandeSalle'))
const FormDemarche = React.lazy(() => import('./views/demarches/FicheDemarche'))
const FormEspace = React.lazy(() => import('./views/espace-entreprise/FicheEspace'))

const UserManagement = React.lazy(() => import('./views/pages/ManageUsersPage'))

const routes = [
  { path: '/', exact: true, name: 'Accueil' },
  
  // --- Routes Employé / Admin ---
{ path: '/dashboard', name: 'Dashboard', element: Dashboard, roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },
{ path: '/employee/inbox', name: 'Inbox', element: EmployeeInbox, roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },
  { path: '/employee/organisations', name: 'Annuaire des Organisations', element: OrganizationDirectory, roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },

  // --- Routes Client ---
  { path: '/client/workspaces', name: 'Mes Espaces', element: ClientWorkspaces, roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
  { path: '/client/workspace/:id', name: 'Tableau de bord Organisation', element: ClientDashboard, roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
{ path: '/client/historique/:orgId?', name: 'Historique', element: HistoriqueDemandes, roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
  // --- Form Routes ---
  { path: '/client/nouvelle-demande/salle/:orgId', name: 'Nouvelle Demande de Salle', element: FormDemandeSalle, roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
  { path: '/client/nouvelle-demande/demarche/:orgId', name: 'Nouvelle Démarche', element: FormDemarche, roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
  { path: '/client/nouvelle-demande/espace/:orgId', name: 'Nouvel Espace Entreprise', element: FormEspace, roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
  
  { path: '/admin/users', name: 'Gestion Utilisateurs', element: UserManagement, roles: ['ROLE_ADMIN'] },
]
export { routes }
export default routes