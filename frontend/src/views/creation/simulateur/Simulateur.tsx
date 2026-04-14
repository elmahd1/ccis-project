import React, { useState } from 'react';
import {
  CForm,
  CFormSelect,
  CFormInput,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CInputGroupText,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilMoney, cilBriefcase, cilCheckCircle, cilBuilding } from '@coreui/icons';

const Simulateur: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreAssocies: '',
    capital: '',
    activiteCommerciale: false,
    activiteArtisanale: false,
    activiteLiberale: false,
  });
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombreAssocies } = formData;
    let recommendation = 'SARL'; // Logique par défaut

    if (parseInt(nombreAssocies) === 1) {
      recommendation = 'Auto-entrepreneur ou SARL AU (Associé Unique)';
    } else if (parseInt(nombreAssocies) > 1) {
      recommendation = 'SARL ou SAS';
    }

    setResult(recommendation);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilBuilding} size="xl" className="me-3 text-primary" />
        Simulateur de Forme Juridique
      </h2>

      <CRow>
        <CCol md={7}>
          <CCard className="shadow-sm border-0 mb-4">
            <CCardHeader className="bg-gray-100">
              <strong>Décrivez votre projet</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-4 g-3">
                  <CCol md={6}>
                    <CFormLabel>Nombre d'associés</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText><CIcon icon={cilPeople} /></CInputGroupText>
                      <CFormSelect name="nombreAssocies" value={formData.nombreAssocies} onChange={handleChange} required>
                        <option value="">Sélectionnez...</option>
                        <option value="1">1 (Seul)</option>
                        <option value="2">2</option>
                        <option value="3">3 ou plus</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Capital prévu (en DH)</CFormLabel>
                    <CInputGroup>
                      <CInputGroupText><CIcon icon={cilMoney} /></CInputGroupText>
                      <CFormInput
                        type="number"
                        name="capital"
                        value={formData.capital}
                        onChange={handleChange}
                        placeholder="Ex: 10000"
                        required
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>

                <div className="mb-4">
                  <CFormLabel className="d-flex align-items-center mb-2">
                    <CIcon icon={cilBriefcase} className="me-2" />
                    Nature de l'activité (plusieurs choix possibles)
                  </CFormLabel>
                  <div className="d-flex gap-4">
                    <CFormCheck id="activiteCommerciale" name="activiteCommerciale" label="Commerciale" checked={formData.activiteCommerciale} onChange={handleChange} />
                    <CFormCheck id="activiteArtisanale" name="activiteArtisanale" label="Artisanale" checked={formData.activiteArtisanale} onChange={handleChange} />
                    <CFormCheck id="activiteLiberale" name="activiteLiberale" label="Libérale" checked={formData.activiteLiberale} onChange={handleChange} />
                  </div>
                </div>

                <CButton type="submit" color="primary" size="lg" className="w-100">
                  Lancer la simulation
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={5}>
          {result ? (
            <CCard className="shadow-sm border-0 bg-success text-white">
              <CCardBody className="text-center py-5">
                <CIcon icon={cilCheckCircle} size="3xl" className="mb-3" />
                <h4 className="mb-3">Statut Recommandé</h4>
                <div className="display-6 fw-bold mb-3">{result}</div>
                <p className="mb-0 text-white-50">
                  Cette recommandation est basée sur vos réponses. Prenez rendez-vous avec un conseiller pour valider ce choix.
                </p>
              </CCardBody>
            </CCard>
          ) : (
            <CAlert color="info" className="d-flex align-items-center h-100">
              Remplissez le formulaire à gauche pour découvrir le statut juridique le mieux adapté à votre projet.
            </CAlert>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default Simulateur;