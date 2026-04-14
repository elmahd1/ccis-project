import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardText,
  CCardFooter,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CCol,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilNewspaper, cilInstitution, cilLightbulb, cilCalendar, cilArrowRight, cilFilter } from '@coreui/icons';

interface Article {
  id: number;
  categorie: 'Loi' | 'Opportunité' | 'Événement';
  titre: string;
  resume: string;
  date: string;
}

const Actualites: React.FC = () => {
  const [filter, setFilter] = useState<'Tout' | 'Loi' | 'Opportunité' | 'Événement'>('Tout');

  const articles: Article[] = [
    {
      id: 1,
      categorie: 'Loi',
      titre: 'Nouvelle loi de finance 2026',
      resume: 'Découvrez les principaux changements fiscaux pour les PME et TPE applicables dès ce trimestre. Un résumé détaillé des nouvelles tranches de l\'IS.',
      date: '01 Avril 2026',
    },
    {
      id: 2,
      categorie: 'Opportunité',
      titre: 'Appel à projets innovation de la région',
      resume: 'Des subventions allant jusqu\'à 500 000 DH sont disponibles pour les startups et PME intégrant des solutions technologiques ou écologiques.',
      date: '05 Avril 2026',
    },
    {
      id: 3,
      categorie: 'Événement',
      titre: 'Salon de l\'Entrepreneuriat à Marrakech',
      resume: 'Venez rencontrer les experts de la CCISMS, des banquiers et des investisseurs lors de cet événement incontournable de 3 jours.',
      date: '10 Avril 2026',
    },
  ];

  const filteredArticles = filter === 'Tout' ? articles : articles.filter(a => a.categorie === filter);

  const getCategoryMeta = (categorie: string) => {
    switch (categorie) {
      case 'Loi': return { color: 'primary', icon: cilInstitution };
      case 'Opportunité': return { color: 'success', icon: cilLightbulb };
      case 'Événement': return { color: 'info', icon: cilCalendar };
      default: return { color: 'secondary', icon: cilNewspaper };
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilNewspaper} size="xl" className="me-3 text-primary" />
        Fil d'actualité économique & légal
      </h2>

      {/* Barre de Filtres */}
      <CCard className="mb-4 shadow-sm border-0">
        <CCardBody className="p-2">
          <CNav variant="pills" className="d-flex align-items-center">
            <span className="text-muted fw-bold ms-3 me-3 d-none d-md-inline">
              <CIcon icon={cilFilter} className="me-2" /> Filtrer par :
            </span>
            {['Tout', 'Loi', 'Opportunité', 'Événement'].map(cat => (
              <CNavItem key={cat}>
                <CNavLink 
                  active={filter === cat} 
                  onClick={() => setFilter(cat as any)}
                  style={{ cursor: 'pointer', borderRadius: '50px' }}
                  className="px-4"
                >
                  {cat !== 'Tout' && <CIcon icon={getCategoryMeta(cat).icon} className="me-2" />}
                  {cat}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>
        </CCardBody>
      </CCard>

      {/* Flux d'articles */}
      <CRow>
        {filteredArticles.map(article => {
          const meta = getCategoryMeta(article.categorie);
          return (
            <CCol md={6} xl={4} key={article.id} className="mb-4">
              <CCard className="h-100 shadow-sm border-0">
                <CCardHeader className="bg-transparent border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                  <CBadge color={meta.color} shape="rounded-pill" className="px-3 py-2">
                    <CIcon icon={meta.icon} className="me-1" /> {article.categorie}
                  </CBadge>
                  <small className="text-muted fw-semibold">{article.date}</small>
                </CCardHeader>
                <CCardBody>
                  <CCardTitle className="fs-5 mb-3">{article.titre}</CCardTitle>
                  <CCardText className="text-muted">{article.resume}</CCardText>
                </CCardBody>
                <CCardFooter className="bg-transparent border-top-0 pb-3">
                  <CButton color={meta.color} variant="ghost" className="w-100 d-flex justify-content-between align-items-center">
                    Lire l'article complet <CIcon icon={cilArrowRight} />
                  </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          );
        })}
      </CRow>
    </div>
  );
};

export default Actualites;