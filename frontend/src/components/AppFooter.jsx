// AppFooter.jsx - Customized for CCIS
import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">© {new Date().getFullYear()} CCIS - Chambre de Commerce</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)