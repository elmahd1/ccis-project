import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CFormInput, CBadge, CSpinner, CButton,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CFormCheck
} from '@coreui/react';
import axios from 'axios';
import { cilCloudDownload, cilColumns } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const ListeAssociations = () => {
  const [associations, setAssociations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Définition de toutes les colonnes disponibles
  const allColumns = [
    { key: 'id', label: '#', labelAr: '#' },
    { key: 'nomAssociation', label: 'Nom / اسم الجمعية', labelAr: 'اسم الجمعية' },
    { key: 'activiteOuSujet', label: 'Activité ou sujet/ النشاط أو الموضوع', labelAr: 'النشاط أو الموضوع' },
    { key: 'adresse', label: 'Adresse / العنوان', labelAr: 'العنوان' },
    { key: 'dateDemande', label: 'Date Demande / تاريخ الطلب', labelAr: 'تاريخ الطلب' },
    { key: 'dateReunion', label: 'Date Réunion / تاريخ الاجتماع', labelAr: 'تاريخ الاجتماع' },
    { key: 'heureReunion', label: 'Heure / الوقت', labelAr: 'الوقت' },
    { key: 'membre1', label: 'Président - M1 / الرئيس', labelAr: 'الرئيس' },
    { key: 'membre2', label: 'Membre 2 / العضو 2', labelAr: 'العضو 2' },
    { key: 'membre3', label: 'Membre 3 / العضو 3', labelAr: 'العضو 3' },
    { key: 'associationCreee', label: 'Statut / الحالة', labelAr: 'الحالة' },
    { key: 'actions', label: 'Actions / إجراءات', labelAr: 'إجراءات' }
  ];

  // 2. État pour les colonnes visibles (Colonnes par défaut au chargement)
  const [visibleColumns, setVisibleColumns] = useState(['nomAssociation', 'activiteOuSujet', 'dateReunion' , 'heureReunion', 'actions']);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/demandes/liste');
      setAssociations(response.data);
    } catch (error) {
      console.error("Erreur de récupération", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande / هل أنت متأكد من مسح هذا الطلب؟")) {
    try {
      await axios.delete(`http://localhost:8080/api/demandes/supprimer/${id}`);
      // Mettre à jour l'état local pour retirer la ligne sans recharger la page
      setAssociations(associations.filter(assoc => assoc.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      alert("Erreur lors de la suppression de la demande.");
    }
  }
};
  // Basculer la visibilité d'une colonne
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey) 
        : [...prev, columnKey]
    );
  };

  // Filtrage pour la recherche
  const filteredAssociations = associations.filter(assoc =>
    assoc.nomAssociation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assoc.heia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Fonction d'exportation CSV dynamique (uniquement les colonnes visibles)
  const exportToCSV = () => {
    const columnsToExport = allColumns.filter(col => visibleColumns.includes(col.key) && col.key !== 'actions');
    
    // Header
    const headers = columnsToExport.map(col => col.label).join(';');
    
    // Données
    const rows = filteredAssociations.map(assoc => {
      return columnsToExport.map(col => {
        const val = assoc[col.key];
        if (col.key === 'associationCreee') return val ? 'Créée' : 'En cours';
        return val || '';
      }).join(';');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "liste_associations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Liste des Associations / لائحة الجمعيات</strong>
            <div className="d-flex gap-2">
              {/* Menu de sélection des colonnes */}
              <CDropdown variant="btn-group">
                <CDropdownToggle color="secondary" size="sm">
                  <CIcon icon={cilColumns} className="me-2" />
                  Colonnes / الأعمدة
                </CDropdownToggle>
                <CDropdownMenu style={{ padding: '10px', minWidth: '250px' }}>
                  {allColumns.map(col => (
                    <div key={col.key} className="px-2 py-1">
                      <CFormCheck 
                        id={`check-${col.key}`}
                        label={col.label}
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                      />
                    </div>
                  ))}
                </CDropdownMenu>
              </CDropdown>

              {/* Bouton Export */}
              <CButton color="success" size="sm" onClick={exportToCSV} className="text-white">
                <CIcon icon={cilCloudDownload} className="me-2" />
                Exporter CSV / استخراج
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CFormInput
              type="text"
              placeholder="Rechercher par nom ou instance... / بحث..."
              className="mb-3"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {isLoading ? (
              <div className="text-center p-5"><CSpinner color="primary" /></div>
            ) : (
              <CTable align="middle" bordered hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    {allColumns.filter(col => visibleColumns.includes(col.key)).map(col => (
                      <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredAssociations.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      {allColumns.filter(col => visibleColumns.includes(col.key)).map(col => (
// Dans ton <CTableBody>, modifie ton .map pour gérer la nouvelle colonne 'actions' :

<CTableDataCell key={col.key}>
  {col.key === 'associationCreee' ? (
    <CBadge color={item.associationCreee ? "success" : "info"} shape="rounded-pill">
      {item.associationCreee ? "Créée / مؤسسة" : "En cours / في طور التأسيس"}
    </CBadge>
  ) : col.key === 'nomAssociation' ? (
    <strong>{item.nomAssociation}</strong>
  ) : col.key === 'actions' ? ( // <-- NOUVELLE CONDITION ICI
    <CButton 
      color="danger" 
      variant="outline" 
      size="sm" 
      onClick={() => handleDelete(item.id)}
    >
      Supprimer
    </CButton>
  ) : (
    item[col.key] || '-'
  )}
</CTableDataCell>
                        
                      ))}
                      
                    </CTableRow>
                  ))}
                  
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ListeAssociations;