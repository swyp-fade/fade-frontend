import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import AgreementsView from './components/AgreementsView';
import InitializeAccountView from './components/InitializeAccountView';
import { AnimatePresence, motion } from 'framer-motion';

export default function Page() {
  const [hasAgreements, setHasAgreements] = useState(false);

  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get('code');

  if (authorizationCode === null || authorizationCode === '') {
    return <Navigate to="/login" />;
  }

  return (
    <AnimatePresence mode="wait">
      {!hasAgreements && (
        <motion.div key="view-1" initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
          <AgreementsView onAgree={() => setHasAgreements(true)} />
        </motion.div>
      )}
      {hasAgreements && (
        <motion.div key="view-2" initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
          <InitializeAccountView authorizationCode={authorizationCode} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
