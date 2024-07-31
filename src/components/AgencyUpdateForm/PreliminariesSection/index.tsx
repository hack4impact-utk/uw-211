import { PreliminariesFormData } from '@/utils/types/agency-update-form';
import { motion } from 'framer-motion';
import { DeepPartial } from 'react-hook-form';
import AdditionalSubsection from './subsections/AdditionalSubsection';
import GeneralSubsection from './subsections/GeneralSubsection';
import OperationsSubsection from './subsections/OperationsSubsection';
import { FormContext } from '../FormContext';
import { useContext } from 'react';

interface PreliminariesSectionProps {
  defaultValues?: DeepPartial<PreliminariesFormData>;
}

export default function PreliminariesSection({
  defaultValues,
}: PreliminariesSectionProps) {
  const { currentSubstep, stepDelta } = useContext(FormContext);

  return (
    <motion.div
      initial={{
        x: stepDelta >= 0 ? '50%' : '-50%',
        opacity: 0,
      }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* General Subpage */}
      {currentSubstep === 0 && (
        <GeneralSubsection defaultValues={defaultValues} />
      )}

      {/* Operations Subpage */}
      {currentSubstep === 1 && (
        <OperationsSubsection defaultValues={defaultValues} />
      )}

      {/* Additional Subpage */}
      {currentSubstep === 2 && (
        <AdditionalSubsection defaultValues={defaultValues} />
      )}
    </motion.div>
  );
}
