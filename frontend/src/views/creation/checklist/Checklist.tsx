import React, { useState } from 'react';
import {
  CProgress,
  CProgressBar,
  CListGroup,
  CListGroupItem,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilTask } from '@coreui/icons';

const Checklist: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Demande du Certificat négatif', completed: false, download: true },
    { id: 2, label: 'Rédaction des Statuts', completed: false, download: true },
    { id: 3, label: 'Enregistrement de la déclaration d\'impôt', completed: false, download: false },
    { id: 4, label: 'Inscription au registre du commerce (RC)', completed: false, download: false },
    { id: 5, label: 'Affiliation à la CNSS', completed: false, download: true },
    { id: 6, label: 'Ouverture du compte bancaire pro', completed: false, download: false },
  ]);

  const handleCheck = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilTask} size="xl" className="me-3 text-primary" />
        Checklist des Formalités de Création
      </h2>

      <CCard className="shadow-sm border-0 mb-4">
        <CCardBody>
          <div className="d-flex justify-content-between mb-2">
            <strong>Progression des démarches</strong>
            <span className="text-primary fw-bold">{progress}%</span>
          </div>
          <CProgress height={15} className="mb-1">
            <CProgressBar value={progress} color={progress === 100 ? 'success' : 'primary'} animated />
          </CProgress>
          <small className="text-muted">{completedTasks} sur {tasks.length} étapes terminées</small>
        </CCardBody>
      </CCard>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-gray-100">
          <strong className="fs-5">Liste des tâches</strong>
        </CCardHeader>
        <CListGroup flush>
          {tasks.map(task => (
            <CListGroupItem key={task.id} className="py-3">
              <CRow className="align-items-center">
                <CCol xs={8} md={9}>
                  <CFormCheck
                    id={`task-${task.id}`}
                    label={<span className={task.completed ? 'text-decoration-line-through text-muted' : 'fw-semibold'}>{task.label}</span>}
                    checked={task.completed}
                    onChange={() => handleCheck(task.id)}
                    className="fs-6"
                  />
                </CCol>
                <CCol xs={4} md={3} className="text-end">
                  {task.download && (
                    <CButton color="info" variant="ghost" size="sm" className="d-inline-flex align-items-center">
                      <CIcon icon={cilCloudDownload} className="me-2" />
                      <span className="d-none d-md-inline">Formulaire</span>
                    </CButton>
                  )}
                </CCol>
              </CRow>
            </CListGroupItem>
          ))}
        </CListGroup>
      </CCard>
    </div>
  );
};

export default Checklist;