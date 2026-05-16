// routes.js - Updated with new routes
import React from 'react'

// ==========================================
// AUTH ROUTES
// ==========================================
const ProfileCompletion = React.lazy(() => import('./views/client/ProfileCompletion'))
const PendingActivation = React.lazy(() => import('./views/client/PendingActivation'))

// ==========================================
// ADMIN ROUTES
// ==========================================
const Dashboard = React.lazy(() => import('./views/admin/Dashboard'))
const AdminReports = React.lazy(() => import('./views/admin/AdminReports'))
const UserManagement = React.lazy(() => import('./views/admin/ManageUsersPage'))

// ==========================================
// EMPLOYEE routes
// ==========================================
const OrganizationDirectory = React.lazy(() => import('./views/employee/OrganizationDirectory')) 
const EmployeeInbox = React.lazy(() => import('./views/employee/EmployeeInbox'))
const EmployeeClientManagement = React.lazy(() => import('./views/employee/EmployeeClientManagement'))
const EmployeeDemandeDetail = React.lazy(() => import('./views/employee/EmployeeDemandeDetail'))

// ==========================================
// CLIENT routes
// ==========================================
const ClientWorkspaces = React.lazy(() => import('./views/client/Workspaces'))
const ClientDashboard = React.lazy(() => import('./views/client/OrganizationDashboard'))
const HistoriqueDemandes = React.lazy(() => import('./views/client/HistoriqueDemandes'))
const ModifyOrganizations = React.lazy(() => import('./views/client/ModifyOrganizations'))
const DemandeSalle = React.lazy(() => import('./views/client/DemandeSalle'))
const FicheAccueilRessortissant = React.lazy(() => import('./views/client/FicheAccueilRessortissant'))
const FicheRenseignements = React.lazy(() => import('./views/client/FicheRenseignements'))

const routes = [
    { path: '/', exact: true, name: 'Accueil' },
    
    // Auth routes
    { path: '/complete-profile/:userId', name: 'Compléter mon profil', element: ProfileCompletion, isPublic: true },
    { path: '/pending-activation', name: 'Activation en attente', element: PendingActivation, isPublic: true },
    
    // Routes Employé
    { path: '/employee/inbox', name: 'Boîte de réception', element: EmployeeInbox, roles: ['ROLE_EMPLOYEE'] },
    { path: '/employee/organisations', name: 'Annuaire des Organisations', element: OrganizationDirectory, roles: ['ROLE_EMPLOYEE'] },
    { path: '/employee/demande/:type/:id', name: 'Détail de la demande', element: EmployeeDemandeDetail, roles: ['ROLE_EMPLOYEE'] },
    { path: '/employee/clients', name: 'Gestion des clients', element: EmployeeClientManagement, roles: ['ROLE_EMPLOYEE'] },
    // Routes Client
    { path: '/client/workspaces', name: 'Mes Espaces', element: ClientWorkspaces, roles: ['ROLE_CLIENT'] },
    { path: '/client/workspace/:id', name: 'Tableau de bord', element: ClientDashboard, roles: ['ROLE_CLIENT'] },
    { path: '/client/historique/:orgId?', name: 'Historique', element: HistoriqueDemandes, roles: ['ROLE_CLIENT'] },
    { path: '/client/modifier-espace/:id', name: 'Modifier mon espace', element: ModifyOrganizations, roles: ['ROLE_CLIENT'] },
    
    // Updated client forms with new names
    { path: '/client/nouvelle-demande/salle/:orgId', name: 'Demande de Salle', element: DemandeSalle, roles: ['ROLE_CLIENT'] },
    { path: '/client/nouvelle-demande/ressortissant/:orgId', name: "Fiche d'Accueil Ressortissant", element: FicheAccueilRessortissant, roles: ['ROLE_CLIENT'] },
    { path: '/client/nouvelle-demande/renseignements/:orgId', name: 'Fiche de Renseignements', element: FicheRenseignements, roles: ['ROLE_CLIENT'] },

    // Routes Admin
    { path: '/admin/dashboard', name: 'Tableau de bord', element: Dashboard, roles: ['ROLE_ADMIN'] },
    { path: '/admin/reports', name: 'Rapports', element: AdminReports, roles: ['ROLE_ADMIN'] },
    { path: '/admin/users', name: 'Gestion Utilisateurs', element: UserManagement, roles: ['ROLE_ADMIN'] },
]

export { routes }
export default routes