import { DefaultModalProps } from '@Stores/modal';
import { useRef, useState } from 'react';
import { UploadImageForm } from './components/UploadImageForm';
import { PolicyView } from './components/UploadPolicyView';

export function UploadViewDialog({ onClose }: DefaultModalProps) {
  const dirtyRef = useRef(false);

  /** TODO: User 정보로 불러와야 함 */
  const [hasAgreementOfPolicy, setHasAgreementOfPolicy] = useState(false);
  const shouldShowPolicyView = !hasAgreementOfPolicy;

  const handleFormClose = () => {
    console.log(dirtyRef.current);
    if (dirtyRef.current) {
      const wouldExit = confirm('변경되지 않은 머시깽이가 있어요. 그래도 나감?');
      return wouldExit && onClose();
    }

    onClose();
  };

  return (
    <>
      {shouldShowPolicyView && <PolicyView onAgreePolicy={() => setHasAgreementOfPolicy(true)} onDegreePolicy={onClose} />}
      {!shouldShowPolicyView && <UploadImageForm onClose={handleFormClose} onValueChanged={(value) => (dirtyRef.current = value)} />}
    </>
  );
}
