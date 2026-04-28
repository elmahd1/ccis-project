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

// FORMS
const FormDemandeSalle = React.lazy(() => import('./views/demande-salle/DemandeSalle'))
const FormDemarche = React.lazy(() => import('./views/demarches/FicheDemarche'))
const FormEspace = React.lazy(() => import('./views/espace-entreprise/FicheEspace'))

const routes = [
  { path: '/', exact: true, name: 'Accueil' },
  
  // --- Routes Employé / Admin ---
  { path: '/dashboard', name: 'Tableau de bord', element: Dashboard },
  { path: '/employee/inbox', name: 'Boîte de réception', element: EmployeeInbox },
  { path: '/employee/organisations', name: 'Annuaire des Organisations', element: OrganizationDirectory },

  // --- Routes Client ---
  { path: '/client/workspaces', name: 'Mes Espaces', element: ClientWorkspaces },
  { path: '/client/workspace/:id', name: 'Tableau de bord Organisation', element: ClientDashboard },
  
  // --- Form Routes ---
  { path: '/client/nouvelle-demande/salle/:orgId', name: 'Nouvelle Demande de Salle', element: FormDemandeSalle },
  { path: '/client/nouvelle-demande/demarche/:orgId', name: 'Nouvelle Démarche', element: FormDemarche },
  { path: '/client/nouvelle-demande/espace/:orgId', name: 'Nouvel Espace Entreprise', element: FormEspace },
]
export { routes }
export default routes