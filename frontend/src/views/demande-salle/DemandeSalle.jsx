import React, { useState } from 'react';
import {
  CForm,
  CCol,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CSpinner,
  CFormSwitch,
  CInputGroup // <-- Added CInputGroup to combine the inputs
} from '@coreui/react';
import axios from 'axios';

const DemandeSalle = () => {
  const [formData, setFormData] = useState({
    nomAssociation: '',
    activiteOuSujet: '',
    adresse: '',
    dateDemande: new Date().toISOString().split('T')[0],
    dateReunion: new Date().toISOString().split('T')[0],
    heureReunion: '',
    membre1: '', // Will be used for President if already created, or Membre 1 if not
    membre2: '',
    membre3: '',
    associationCreee: false
  });

  const [files, setFiles] = useState({
    doc1: [], doc3: null, doc4: null, doc5: null, doc6: null, doc7: null, 
    idPres: null, 
    idMembre1: null, idMembre2: null, idMembre3: null 
  });

  const [isLoading, setIsLoading] = useState(false);

const handleFileChange = (e, key) => {
    if (e.target.multiple) {
      // Si l'input a l'attribut "multiple", on stocke tous les fichiers sous forme de tableau
      setFiles({ ...files, [key]: Array.from(e.target.files) });
    } else {
      // Sinon, on garde le comportement par défaut (1 seul fichier)
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
const activitesArabe = [
  "اجتماع تواصلي",
  "لقاء تواصلي",
  "طلب جلسة عمل",
  "الجمع العام السنوي",
  "إحداث الفرع المحلي"
];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("demande", new Blob([JSON.stringify(formData)], { type: "application/json" }));
    
    Object.keys(files).forEach(key => {
        if (files[key]) {
            submitData.append("documents", files[key]);
        }
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/generer-pdf`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Dossier_${formData.nomAssociation}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Dossier généré avec succès !');
    } catch (error) {
      console.error("Erreur lors de la génération", error);
      alert("Une erreur s'est produite lors de la génération du dossier.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Formulaire de demande de salle / استمارة طلب قاعة</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* 1. COMBINED: Héia & Nom Association */}
                <CCol md={6} className="mb-3">
                  <label className="form-label">Instance ou Nom de l'association / الهيئة أو اسم الجمعية</label>
                    <CFormInput 
                        placeholder="Nom / الاسم" 
                        name="nomAssociation" 
                        value={formData.nomAssociation} 
                        onChange={handleChange} 
                        required 
                    />
                </CCol>

                {/* Informations générales */}
<CCol md={6} className="mb-3">
  <CFormInput
    type="text"
    id="activiteOuSujet"
    name="activiteOuSujet"
    label="Activité ou sujet / النشاط أو الموضوع"
    list="activites-list" // Connecte l'input à la datalist
    value={formData.activiteOuSujet}
    onChange={handleChange}
    required
  />
  <datalist id="activites-list">
    {activitesArabe.map((activite, index) => (
      <option key={index} value={activite} />
    ))}
  </datalist>
</CCol>
                <CCol md={12} className="mb-3">
                  <label className="form-label">Adresse / العنوان</label>
                  <CFormInput name="adresse" value={formData.adresse} onChange={handleChange} />
                </CCol>

                {/* Dates et Heures */}
                <CCol md={4} className="mb-3">
                  <CFormInput type="date" label="Date de demande / تاريخ الطلب" name="dateDemande" value={formData.dateDemande} onChange={handleChange} />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput type="date" label="Date de réunion / تاريخ الاجتماع" name="dateReunion" value={formData.dateReunion} onChange={handleChange} required />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormInput type="time" label="Heure de réunion / وقت الاجتماع" name="heureReunion" value={formData.heureReunion} onChange={handleChange} required />
                </CCol>

                {/* Switch Création */}
                <CCol xs={12} className="mb-4 mt-2 border p-3 rounded bg-gray-50">
                  <CFormSwitch 
                    label="L'association est-elle déjà créée ? / هل الجمعية مؤسسة بالفعل؟" 
                    id="associationCreee" 
                    name="associationCreee" 
                    checked={formData.associationCreee} 
                    onChange={handleChange} 
                    size="lg"
                  />
                </CCol>

                {/* 2. PRESIDENT INPUT (Shown ONLY if Already Created) */}
                {formData.associationCreee && (
                  <CCol xs={12}>
                    <h6 className="mt-3">Informations du Président / معلومات الرئيس</h6>
                    <hr />
                    <CRow>
                      <CCol md={6} className="mb-3">
                        <CFormInput 
                          label="Nom du président / اسم الرئيس" 
                          name="membre1"  // We map it to membre1 so the Backend Java handles it properly
                          value={formData.membre1} 
                          onChange={handleChange} 
                          required={formData.associationCreee}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                )}

                {/* COMMITTEE MEMBERS (Shown ONLY if NOT created) */}
                {!formData.associationCreee && (
                  <CCol xs={12}>
                    <h6 className="mt-3">Membres de la commission préparatoire / أعضاء اللجنة التحضيرية</h6>
                    <hr />
                    <CRow>
                        <CCol md={4} className="mb-3">
                        <CFormInput label="Membre 1 / العضو 1" name="membre1" value={formData.membre1} onChange={handleChange} />
                        </CCol>
                        <CCol md={4} className="mb-3">
                        <CFormInput label="Membre 2 / العضو 2" name="membre2" value={formData.membre2} onChange={handleChange} />
                        </CCol>
                        <CCol md={4} className="mb-3">
                        <CFormInput label="Membre 3 / العضو 3" name="membre3" value={formData.membre3} onChange={handleChange} />
                        </CCol>
                    </CRow>
                  </CCol>
                )}

                {/* Documents / الوثائق */}
                <CCol xs={12} className="mt-4">
                  <h6>Documents justificatifs / الوثائق التعريفية و التبريرية</h6>
                  <hr />
                  <CRow>
                    <CCol md={6} className="mb-3">
                      <CFormInput type="file" label="Loi fondamentale de l'association / قانون أساسي للجمعية" multiple onChange={(e) => handleFileChange(e, 'doc1')} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </CCol>

                    {/* Affichage conditionnel des cartes d'identité */}
                    {formData.associationCreee ? (
                      <CCol md={6} className="mb-3">
                        <CFormInput type="file" label="Carte d'identité du président / بطاقة تعريف رئيس الجمعية" onChange={(e) => handleFileChange(e, 'idPres')} accept=".pdf,.doc,.docx,.jpg,.png" />
                      </CCol>
                    ) : (
                      <>
                        <CCol md={4} className="mb-3">
                            <CFormInput type="file" label="Carte d'identité Membre 1 / بطاقة تعريف العضو 1" onChange={(e) => handleFileChange(e, 'idMembre1')} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </CCol>
                        <CCol md={4} className="mb-3">
                            <CFormInput type="file" label="Carte d'identité Membre 2 / بطاقة تعريف العضو 2" onChange={(e) => handleFileChange(e, 'idMembre2')} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </CCol>
                        <CCol md={4} className="mb-3">
                            <CFormInput type="file" label="Carte d'identité Membre 3 / بطاقة تعريف العضو 3" onChange={(e) => handleFileChange(e, 'idMembre3')} accept=".pdf,.doc,.docx,.jpg,.png" />
                        </CCol>
                      </>
                    )}

                    <CCol md={6} className="mb-3">
                      <CFormInput type="file" label="Récépissé définitif de l'association / الوصل النهائي أو المؤقت للجمعية" onChange={(e) => handleFileChange(e, 'doc3')} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CFormInput type="file" label="Récépissé du registre du commerce / وصل السجل التجاري" onChange={(e) => handleFileChange(e, 'doc4')} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CFormInput type="file" label="Récépissé de la taxe professionnelle / وصل الضريبة المهنية" onChange={(e) => handleFileChange(e, 'doc5')} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CFormInput type="file" label="Autre document 1 / وثيقة أخرى 1" onChange={(e) => handleFileChange(e, 'doc6')} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CFormInput type="file" label="Autre document 2 / وثيقة أخرى 2" onChange={(e) => handleFileChange(e, 'doc7')} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>

              <div className="d-grid gap-2 mt-4">
                <CButton color="primary" type="submit" disabled={isLoading} size="lg">
                  {isLoading ? (
                    <><CSpinner size="sm" className="me-2" /> Génération en cours / جاري التحضير...</>
                  ) : (
                    "Générer le dossier complet / استخراج الملف كامل"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DemandeSalle;