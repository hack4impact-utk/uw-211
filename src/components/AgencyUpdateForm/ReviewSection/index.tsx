import { AgencyUpdateFormData } from '@/utils/types/agency-update-form';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ReviewPreliminariesSection from './ReviewPreliminariesSection';
import ReviewAccessibilitySection from './ReviewAccessibilitySection';
import ReviewServicesSection from './ReviewServicesSection';
import ReviewOpportunitiesSection from './ReviewOpportunitiesSection';

interface ReviewSectionProps {
  formData: AgencyUpdateFormData;
}

export default function ReviewSection({ formData }: ReviewSectionProps) {
  const t = useTranslations('Form');
  return (
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col gap-10">
        {/* Header */}
        <section>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {t('review.title')}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {t('review.description')}
          </p>
        </section>

        {/* Preliminaries */}
        <ReviewPreliminariesSection formData={formData} />

        <hr />

        {/* Accessibility */}
        <ReviewAccessibilitySection formData={formData} />

        <hr />

        {/* Services */}
        <ReviewServicesSection formData={formData} />

        <hr />

        {/* Opportunities */}
        <ReviewOpportunitiesSection formData={formData} />
      </div>
    </motion.div>
  );
}
